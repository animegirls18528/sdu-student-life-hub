"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { headers } from "next/headers";

/**
 * Request a reset password link for a user email.
 * Generates a secure random token valid for 15 minutes, saves it to the database,
 * and sends an email containing the reset link via Gmail SMTP.
 */
export async function requestResetLink(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "ไม่พบอีเมลนี้ในระบบฐานข้อมูล" };
    }

    // Generate a secure random token (64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Determine application URL dynamically
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      const headersList = await headers();
      const host = headersList.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      baseUrl = `${protocol}://${host}`;
    }

    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Gmail SMTP transporter configurations
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `"SDU Student Life Hub" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "ตั้งรหัสผ่านใหม่สำหรับบัญชี SDU Student Life Hub",
        text: `คุณได้ส่งคำขอเพื่อตั้งรหัสผ่านใหม่ กรุณาคลิกลิงก์ต่อไปนี้เพื่อดำเนินการต่อ: ${resetLink} (ลิงก์นี้มีอายุใช้งาน 15 นาที)`,
        html: `
          <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
            <div style="max-w: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); text-align: left; border: 1px solid #f3f4f6;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 20px; letter-spacing: 1px;">
                  SDU
                </div>
              </div>
              <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">ตั้งรหัสผ่านใหม่</h2>
              <p style="color: #4b5563; font-size: 15px; line-height: 24px; margin-bottom: 24px;">
                สวัสดีคุณ ${user.name},<br><br>
                เราได้รับคำขอเปลี่ยนรหัสผ่านสำหรับบัญชี SDU Student Life Hub ของคุณ กรุณาคลิกปุ่มด้านล่างเพื่อทำการตั้งรหัสผ่านใหม่:
              </p>
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${resetLink}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px; transition: background-color 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                  ตั้งรหัสผ่านใหม่
                </a>
              </div>
              <p style="color: #6b7280; font-size: 13px; line-height: 20px; margin-bottom: 20px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                * ลิงก์รีเซ็ตรหัสผ่านนี้มีอายุการใช้งาน 15 นาที (จะหมดอายุในเวลา ${new Date(resetTokenExpires).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)<br>
                หากคุณไม่ได้เป็นผู้ส่งคำขอนี้ คุณสามารถละเว้นอีเมลนี้ได้และรหัสผ่านเดิมของคุณจะยังคงปลอดภัย
              </p>
              <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 30px;">
                หากปุ่มด้านบนใช้งานไม่ได้ คุณสามารถคัดลอกลิงก์ด้านล่างไปวางในเบราว์เซอร์ของคุณ:<br>
                <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
              </p>
            </div>
            <div style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
              © SDU Student Life Hub. All rights reserved.
            </div>
          </div>
        `,
      });

      return { success: true };
    } catch (emailError) {
      console.error("SMTP Error:", emailError);
      console.log(`\n==================================================`);
      console.log(`DEV MODE: SMTP failed to send email. SMTP Config check:`);
      console.log(`SMTP_EMAIL: ${process.env.SMTP_EMAIL}`);
      console.log(`SMTP_PASSWORD: ${process.env.SMTP_PASSWORD ? 'PRESENT (hidden)' : 'MISSING'}`);
      console.log(`Reset link generated: ${resetLink}`);
      console.log(`==================================================\n`);

      return {
        success: true,
        devMessage: `ระบบไม่สามารถส่งอีเมลผ่าน SMTP ได้ แต่ในโหมดทดสอบ (Developer Mode) คุณสามารถใช้ลิงก์นี้เพื่อดำเนินการต่อได้: ${resetLink}`,
      };
    }
  } catch (error) {
    console.error("Request reset link error:", error);
    return { error: "เกิดข้อผิดพลาดทางเทคนิค กรุณาลองใหม่อีกครั้ง" };
  }
}

/**
 * Validate a reset token to check if it exists and hasn't expired.
 */
export async function validateResetToken(token: string) {
  if (!token) {
    return { error: "ไม่พบโทเค็นสำหรับการตั้งรหัสผ่านใหม่" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return { error: "โทเค็นการตั้งรหัสผ่านใหม่ไม่ถูกต้องหรือเคยใช้ไปแล้ว" };
    }

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      return { error: "ลิงก์นี้หมดอายุการใช้งานแล้ว (เกิน 15 นาที) กรุณาทำรายการขอลิงก์ใหม่อีกครั้ง" };
    }

    return { success: true, email: user.email };
  } catch (error) {
    console.error("Validate reset token error:", error);
    return { error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลของลิงก์" };
  }
}

/**
 * Reset user password with token verification.
 */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!token) {
    return { error: "ไม่พบโทเค็นสำหรับการตั้งรหัสผ่านใหม่" };
  }

  try {
    // 1. Verify token validity once more
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return { error: "โทเค็นการตั้งรหัสผ่านใหม่ไม่ถูกต้องหรือเคยใช้ไปแล้ว" };
    }

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      return { error: "ลิงก์นี้หมดอายุการใช้งานแล้ว กรุณาทำรายการขอลิงก์ใหม่อีกครั้ง" };
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password and invalidate the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Reset password with token error:", error);
    return { error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่านใหม่ กรุณาลองใหม่อีกครั้ง" };
  }
}
