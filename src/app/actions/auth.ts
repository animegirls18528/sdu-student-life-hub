'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

// ── Rate Limiter (in-memory, per email) ────────────────────────────────────
// ป้องกัน Brute Force / Password Spray / Credential Stuffing
const RATE_LIMIT_MAX = 10;          // จำนวนครั้งสูงสุดที่อนุญาต
const RATE_LIMIT_BLOCK_MS = 60_000; // ระยะเวลา block (60 วินาที)

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(email: string): { blocked: boolean; blockedUntil?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(email);
  if (!entry) return { blocked: false };

  // ยัง block อยู่?
  if (entry.blockedUntil > now) {
    return { blocked: true, blockedUntil: entry.blockedUntil };
  }

  // window หมดแล้ว → reset
  if (now - entry.windowStart >= RATE_LIMIT_BLOCK_MS) {
    rateLimitMap.delete(email);
    return { blocked: false };
  }

  return { blocked: false };
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(email);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_BLOCK_MS) {
    rateLimitMap.set(email, { count: 1, windowStart: now, blockedUntil: 0 });
    return;
  }

  const newCount = entry.count + 1;
  const blockedUntil = newCount >= RATE_LIMIT_MAX ? now + RATE_LIMIT_BLOCK_MS : entry.blockedUntil;
  rateLimitMap.set(email, { ...entry, count: newCount, blockedUntil });
}

function resetRateLimit(email: string): void {
  rateLimitMap.delete(email);
}
// ───────────────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type FormState = {
  error?: string;
  success?: boolean;
  rateLimitedUntil?: number; // timestamp (ms) ที่จะ unblock
};

export async function login(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') === 'on';

  // ── ตรวจ Rate Limit ก่อนทุกอย่าง ──
  const rateCheck = isRateLimited(email);
  if (rateCheck.blocked) {
    return {
      error: 'Too Many Requests — Please wait 60 seconds before trying again.',
      rateLimitedUntil: rateCheck.blockedUntil,
    };
  }

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Auto-create Super Admin if it doesn't exist (for development/demo purposes)
    if (!user && email === 'superadmin@sdu.ac.th') {
      const { hashPassword } = await import('@/lib/auth');
      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
        },
      });
    }

    if (!user) {
      // นับเป็น failed attempt สำหรับ rate limiting
      recordFailedAttempt(email);
      await prisma.loginLog.create({ data: { username: email, success: false } });
      return { error: 'Invalid email or password' };
    }

    if (user.isLocked) {
      return { error: 'Your account has been blocked due to multiple failed login attempts. Please contact admin.' };
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      // นับ rate limit
      recordFailedAttempt(email);

      const newAttempts = user.failedLoginAttempts + 1;
      const willLock = newAttempts >= 5;

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: newAttempts, isLocked: willLock },
      });

      await prisma.loginLog.create({ data: { username: email, success: false } });

      // ตรวจอีกครั้งว่าถูก block แล้วหรือยัง (หลังบวก 1)
      const afterCheck = isRateLimited(email);
      if (afterCheck.blocked) {
        return {
          error: 'Too Many Requests — Please wait 60 seconds before trying again.',
          rateLimitedUntil: afterCheck.blockedUntil,
        };
      }

      if (willLock) {
        return { error: 'Too many failed attempts. Your account has been blocked.' };
      }
      return { error: 'Invalid email or password' };
    }

    // Login สำเร็จ → reset rate limit
    resetRateLimit(email);

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0 },
    });

    await prisma.loginLog.create({ data: { username: email, success: true } });

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      imageUrl: user.imageUrl,
      tokenVersion: user.tokenVersion,
    }, rememberMe);

    // Success! Redirect to dashboard
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  const { logout } = await import('@/lib/auth');
  await logout();
  redirect('/login');
}
