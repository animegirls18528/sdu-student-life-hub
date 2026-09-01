"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getMyCourses() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    if (session.role === "TEACHER") {
      const courses = await prisma.course.findMany({
        where: { instructor: session.name },
        include: {
          enrollments: true,
        },
        orderBy: { code: "asc" },
      });

      const coursesWithStats = courses.map(course => {
        return {
          ...course,
          stats: {
            totalStudents: course.enrollments.length,
          }
        };
      });

      return { success: true, courses: coursesWithStats, role: session.role };
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.id },
      include: {
        course: {
          include: {
            attendances: {
              where: { userId: session.id },
            },
          },
        },
      },
      orderBy: {
        course: {
          code: "asc",
        },
      },
    });

    // Process data to include summary
    const coursesWithStats = enrollments.map(enrollment => {
      const attendances = enrollment.course.attendances;
      const totalClasses = attendances.length;
      const presentCount = attendances.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
      const absentCount = attendances.filter(a => a.status === "ABSENT").length;
      const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

      return {
        ...enrollment.course,
        stats: {
          totalClasses,
          presentCount,
          absentCount,
          attendanceRate
        }
      };
    });

    return { success: true, courses: coursesWithStats, role: session.role };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getCourseAttendance(courseId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    if (session.role === "TEACHER") {
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: courseId },
        include: {
          user: true,
        },
        orderBy: {
          user: {
            studentId: "asc"
          }
        }
      });

      const allAttendances = await prisma.attendance.findMany({
        where: { courseId: courseId },
        orderBy: { date: "desc" },
      });

      return { success: true, course, role: session.role, enrollments, attendances: allAttendances };
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: session.id,
        courseId: courseId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, course, role: session.role, attendances };
  } catch (error) {
    console.error("Error fetching course attendance:", error);
    return { success: false, error: "Failed to fetch attendance records" };
  }
}

export async function checkIn(courseId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const today = new Date();
    // Offset for local timezone if necessary, but simple ISO string works for basic date tracking
    const todayStr = today.toISOString().split('T')[0];

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: courseId,
        }
      }
    });

    if (!enrollment) {
      return { success: false, error: "You are not enrolled in this course" };
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_courseId_date: {
          userId: session.id,
          courseId: courseId,
          date: todayStr,
        }
      }
    });

    if (existingAttendance) {
      return { success: false, error: "You have already checked in for today" };
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: session.id,
        courseId: courseId,
        date: todayStr,
        status: "PRESENT", // Assuming normal check-in is PRESENT. Logic for LATE could be added based on time.
      }
    });

    await createAuditLog(session.id, "CHECK_IN", attendance.id, {
      courseId, date: todayStr, status: "PRESENT"
    });

    revalidatePath("/dashboard/attendance");
    revalidatePath(`/dashboard/attendance/${courseId}`);

    return { success: true, attendance };
  } catch (error) {
    console.error("Error during check-in:", error);
    return { success: false, error: "Failed to check in" };
  }
}

export async function markStudentAttendance(courseId: string, studentId: string, date: string, status: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return { success: false, error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.instructor !== session.name) {
      return { success: false, error: "Not authorized to manage this course" };
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_courseId_date: {
          userId: studentId,
          courseId: courseId,
          date: date,
        }
      }
    });

    if (existingAttendance) {
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status },
      });
    } else {
      await prisma.attendance.create({
        data: {
          userId: studentId,
          courseId: courseId,
          date: date,
          status: status,
        }
      });
    }

    await createAuditLog(session.id, "MARK_ATTENDANCE", courseId, {
      studentId, date, status
    });

    revalidatePath(`/dashboard/attendance/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return { success: false, error: "Failed to mark attendance" };
  }
}
