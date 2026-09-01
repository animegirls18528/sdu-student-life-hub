"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/rbac";

export async function getAllUsers() {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_users")) {
      return { success: false, error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        studentId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_users")) {
      return { success: false, error: "Unauthorized" };
    }

    // Prevents SUPER_ADMIN from changing their own role to something else
    if (session.id === userId && newRole !== "SUPER_ADMIN") {
      return { success: false, error: "Cannot downgrade your own Super Admin role" };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        role: newRole,
        tokenVersion: { increment: 1 } // Invalidate session
      },
      select: { id: true, role: true, email: true },
    });

    await createAuditLog(session.id, "CHANGE_ROLE", userId, {
      newRole,
      targetEmail: user.email,
    });

    revalidatePath("/dashboard/users");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
