"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac";

export async function getTeachingSchedules() {
  try {
    const session = await getSession();
    if (!session) return [];

    return await prisma.teachingSchedule.findMany({
      include: {
        user: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" }
      ]
    });
  } catch (error) {
    console.error("Error fetching teaching schedules:", error);
    return [];
  }
}

export async function getMyTeachingSchedules() {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const whereClause = (session.role === "SUPER_ADMIN" || session.role === "ADMIN")
      ? {}
      : { userId: session.id };

    const schedules = await prisma.teachingSchedule.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" }
      ]
    });

    return { success: true, schedules };
  } catch (error) {
    console.error("Error fetching my schedules:", error);
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function createTeachingSchedule(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_teaching_schedule")) {
      return { success: false, error: "Unauthorized" };
    }

    const courseName = formData.get("courseName") as string;
    const courseCode = formData.get("courseCode") as string;
    const dayOfWeek = formData.get("dayOfWeek") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const room = formData.get("room") as string;
    const type = formData.get("type") as string;

    if (!courseName || !dayOfWeek || !startTime || !endTime || !room) {
      return { success: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
    }

    await prisma.teachingSchedule.create({
      data: {
        userId: session.id,
        courseName,
        courseCode: courseCode || null,
        dayOfWeek,
        startTime,
        endTime,
        room,
        type: type || "บรรยาย",
      }
    });

    revalidatePath("/dashboard/teaching-schedule");
    revalidatePath("/dashboard/schedule");
    
    return { success: true };
  } catch (error) {
    console.error("Error creating schedule:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกตารางสอน" };
  }
}

export async function deleteTeachingSchedule(id: string) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_teaching_schedule")) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership or admin status
    const schedule = await prisma.teachingSchedule.findUnique({
      where: { id }
    });

    if (!schedule) {
      return { success: false, error: "ไม่พบตารางสอนนี้" };
    }

    if (schedule.userId !== session.id && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return { success: false, error: "ไม่มีสิทธิ์ลบตารางสอนนี้" };
    }

    await prisma.teachingSchedule.delete({
      where: { id }
    });

    revalidatePath("/dashboard/teaching-schedule");
    revalidatePath("/dashboard/schedule");

    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการลบตารางสอน" };
  }
}
