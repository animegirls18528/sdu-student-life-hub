"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/rbac";

export async function getActivities() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const activities = await prisma.activity.findMany({
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return { success: true, activities };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { success: false, error: "Failed to fetch activities" };
  }
}

export async function getActivityById(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!activity) {
      return { success: false, error: "Activity not found" };
    }

    // Check if the user has already registered
    const existingRegistration = await prisma.activityRegistration.findUnique({
      where: {
        userId_activityId: {
          userId: session.id,
          activityId: id,
        },
      },
    });

    return {
      success: true,
      activity,
      userRegistration: existingRegistration,
    };
  } catch (error) {
    console.error("Error fetching activity:", error);
    return { success: false, error: "Failed to fetch activity" };
  }
}

export async function registerForActivity(activityId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!activity) {
      return { success: false, error: "Activity not found" };
    }

    // Check capacity
    const currentRegistrations = await prisma.activityRegistration.count({
      where: { activityId, status: "REGISTERED" },
    });

    if (currentRegistrations >= activity.maxParticipants) {
      return { success: false, error: "กิจกรรมนี้มีผู้ลงทะเบียนเต็มแล้ว" };
    }

    // Check duplicate
    const existing = await prisma.activityRegistration.findUnique({
      where: {
        userId_activityId: {
          userId: session.id,
          activityId,
        },
      },
    });

    if (existing) {
      if (existing.status === "REGISTERED") {
        return { success: false, error: "คุณลงทะเบียนกิจกรรมนี้ไปแล้ว" };
      }
      // Re-register if previously cancelled
      await prisma.activityRegistration.update({
        where: { id: existing.id },
        data: { status: "REGISTERED" },
      });
    } else {
      await prisma.activityRegistration.create({
        data: {
          activityId,
          userId: session.id,
          status: "REGISTERED",
        },
      });
    }

    await createAuditLog(session.id, "REGISTER_ACTIVITY", activityId, {
      activityName: activity.title
    });

    revalidatePath("/dashboard/activities");
    revalidatePath(`/dashboard/activities/${activityId}`);
    revalidatePath("/dashboard/activities/my-registrations");

    return { success: true };
  } catch (error) {
    console.error("Error registering for activity:", error);
    return { success: false, error: "Failed to register" };
  }
}

export async function cancelActivityRegistration(activityId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const registration = await prisma.activityRegistration.findUnique({
      where: {
        userId_activityId: {
          userId: session.id,
          activityId,
        },
      },
    });

    if (!registration) {
      return { success: false, error: "Registration not found" };
    }

    if (registration.status !== "REGISTERED") {
      return { success: false, error: "Cannot cancel this registration" };
    }

    await prisma.activityRegistration.update({
      where: { id: registration.id },
      data: { status: "CANCELLED" },
    });

    await createAuditLog(session.id, "CANCEL_ACTIVITY", activityId);

    revalidatePath("/dashboard/activities");
    revalidatePath(`/dashboard/activities/${activityId}`);
    revalidatePath("/dashboard/activities/my-registrations");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return { success: false, error: "Failed to cancel registration" };
  }
}

export async function getMyActivityRegistrations() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const registrations = await prisma.activityRegistration.findMany({
      where: { userId: session.id },
      include: { activity: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, registrations };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return { success: false, error: "Failed to fetch registrations" };
  }
}

export async function createActivity(data: any) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_activities")) {
      return { success: false, error: "Unauthorized" };
    }

    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        maxParticipants: parseInt(data.maxParticipants),
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/dashboard/activities");
    return { success: true, activity };
  } catch (error) {
    console.error("Error creating activity:", error);
    return { success: false, error: "Failed to create activity" };
  }
}

export async function updateActivity(id: string, data: any) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_activities")) {
      return { success: false, error: "Unauthorized" };
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        maxParticipants: parseInt(data.maxParticipants),
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/dashboard/activities");
    revalidatePath(`/dashboard/activities/${id}`);
    return { success: true, activity };
  } catch (error) {
    console.error("Error updating activity:", error);
    return { success: false, error: "Failed to update activity" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_activities")) {
      return { success: false, error: "Unauthorized" };
    }

    // Must delete related registrations first
    await prisma.activityRegistration.deleteMany({
      where: { activityId: id },
    });

    await prisma.activity.delete({
      where: { id },
    });

    revalidatePath("/dashboard/activities");
    return { success: true };
  } catch (error) {
    console.error("Error deleting activity:", error);
    return { success: false, error: "Failed to delete activity" };
  }
}
