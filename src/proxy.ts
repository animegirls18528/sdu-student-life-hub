import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { canAccessRoute } from '@/lib/rbac';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add Security Headers
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Prevent browser from caching dashboard pages (fixes back-button after logout)
  const normalizedPath = pathname.toLowerCase();
  if (normalizedPath.startsWith('/dashboard')) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
  }

  // Protect routes
  if (normalizedPath.startsWith('/dashboard')) {
    const token = req.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // ── RBAC Route Check ──────────────────────────────────────────
      if (!canAccessRoute(role, pathname)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // ── JWT Session Auto-Refresh ──────────────────────────────────
      // If the token will expire in less than 1 hour, issue a new one
      const exp = payload.exp as number;
      const now = Math.floor(Date.now() / 1000);
      const ONE_HOUR = 60 * 60;

      if (exp && exp - now < ONE_HOUR) {
        // Determine original expiry duration
        const iat = payload.iat as number;
        const originalDuration = exp - iat;
        const isLongLived = originalDuration > 2 * 24 * 60 * 60; // >2 days = remember me
        const newExpiry = isLongLived ? '30d' : '1d';
        const newDuration = isLongLived ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        const newToken = await new SignJWT({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          name: payload.name,
          imageUrl: payload.imageUrl,
          tokenVersion: payload.tokenVersion,
          jti: crypto.randomUUID(),
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(newExpiry)
          .sign(JWT_SECRET);

        res.cookies.set('session', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(Date.now() + newDuration),
          path: '/',
        });
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
