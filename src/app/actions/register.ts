"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "ชื่อ-นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
  confirmPassword: z.string().min(8, "รหัสผ่านยืนยันต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
  studentId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export async function registerUser(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: validatedData.error.issues[0].message,
      };
    }

    const { name, email, password, studentId } = validatedData.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "อีเมลนี้มีผู้ใช้งานแล้ว" };
    }

    // Check if student ID already exists (only if provided)
    if (studentId) {
      const existingStudentId = await prisma.user.findUnique({
        where: { studentId },
      });

      if (existingStudentId) {
        return { error: "รหัสนักศึกษานี้มีผู้ใช้งานแล้ว" };
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        studentId: studentId || null,
        role: "STUDENT",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง" };
  }
}
