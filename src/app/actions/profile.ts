"use server";

import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function updateProfile(data: { name: string, studentId?: string }) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updateData: any = { name: data.name };
    if (session.role === "STUDENT" && data.studentId !== undefined) {
      updateData.studentId = data.studentId;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "รหัสนักศึกษานี้มีอยู่ในระบบแล้ว" };
    }
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" };
  }
}

export async function changePassword(data: { currentPassword?: string, newPassword: string }) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return { success: false, error: "ไม่พบผู้ใช้" };

    // Verify current password if user has one (they should)
    if (data.currentPassword) {
      const isValid = await verifyPassword(data.currentPassword, user.password);
      if (!isValid) {
        return { success: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
      }
    }

    const hashedNewPassword = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedNewPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" };
  }
}

export async function uploadProfilePicture(formData: FormData) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "ไม่มีไฟล์อัปโหลด" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/profiles
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.name.split(".").pop();
    const filename = `${session.id}-${uniqueSuffix}.${extension}`;
    const filePath = join(uploadDir, filename);

    // Write file
    await writeFile(filePath, buffer);

    // Save to database
    const imageUrl = `/uploads/profiles/${filename}`;
    await prisma.user.update({
      where: { id: session.id },
      data: { imageUrl },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Upload profile picture error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์" };
  }
}
