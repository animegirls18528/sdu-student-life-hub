"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac";

export async function getAnnouncements() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, announcements };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function getAnnouncementById(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    return { success: true, announcement };
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return { success: false, error: "Failed to fetch announcement" };
  }
}

export async function createAnnouncement(data: { title: string; content: string; type: string; author: string }) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_announcements")) {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || "ทั่วไป",
        author: data.author || "Admin",
      },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true, announcement };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: "Failed to create announcement" };
  }
}

export async function updateAnnouncement(id: string, data: { title: string; content: string; type: string; author: string }) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_announcements")) {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        type: data.type || "ทั่วไป",
        author: data.author || "Admin",
      },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true, announcement };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, error: "Failed to update announcement" };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_announcements")) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.announcement.delete({
      where: { id },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: "Failed to delete announcement" };
  }
}
