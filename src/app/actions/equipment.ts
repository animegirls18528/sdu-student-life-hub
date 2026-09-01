"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/rbac";

export async function getEquipments() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const equipments = await prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, equipments };
  } catch (error) {
    console.error("Error fetching equipments:", error);
    return { success: false, error: "Failed to fetch equipments" };
  }
}

export async function getEquipmentById(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      return { success: false, error: "Equipment not found" };
    }

    return { success: true, equipment };
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return { success: false, error: "Failed to fetch equipment" };
  }
}

export async function bookEquipment(
  equipmentId: string,
  date: string,
  startTime: string,
  endTime: string,
  purpose: string
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Basic validation
    if (!date || !startTime || !endTime || !purpose) {
      return { success: false, error: "Missing required fields" };
    }

    if (startTime >= endTime) {
      return { success: false, error: "Start time must be before end time" };
    }

    // Optional: Check for conflicts (if equipment can only be booked by one person at a time)
    const existingBooking = await prisma.equipmentBooking.findFirst({
      where: {
        equipmentId,
        date,
        status: { in: ["APPROVED", "PENDING"] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return { success: false, error: "อุปกรณ์นี้มีการจองในช่วงเวลาดังกล่าวแล้ว" };
    }

    const booking = await prisma.equipmentBooking.create({
      data: {
        equipmentId,
        userId: session.id,
        date,
        startTime,
        endTime,
        purpose,
        status: "PENDING",
      },
    });

    await createAuditLog(session.id, "BOOK_EQUIPMENT", booking.id, {
      equipmentId, date, startTime, endTime, purpose
    });

    revalidatePath("/dashboard/equipment");
    revalidatePath("/dashboard/equipment/my-bookings");
    
    return { success: true, booking };
  } catch (error) {
    console.error("Error booking equipment:", error);
    return { success: false, error: "Failed to book equipment" };
  }
}

export async function getMyEquipmentBookings() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bookings = await prisma.equipmentBooking.findMany({
      where: { userId: session.id },
      include: { equipment: true },
      orderBy: [
        { date: "desc" },
        { startTime: "desc" }
      ],
    });

    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching my equipment bookings:", error);
    return { success: false, error: "Failed to fetch my equipment bookings" };
  }
}

export async function createEquipment(data: { name: string; type: string; capacity?: number; description?: string }) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session.role, "manage_equipment")) {
      return { success: false, error: "Unauthorized" };
    }

    const equipment = await prisma.equipment.create({
      data,
    });

    revalidatePath("/dashboard/equipment");

    return { success: true, equipment };
  } catch (error) {
    console.error("Error creating equipment:", error);
    return { success: false, error: "Failed to create equipment" };
  }
}

export async function cancelEquipmentBooking(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const booking = await prisma.equipmentBooking.findUnique({ where: { id } });
    if (!booking) return { success: false, error: "Booking not found" };
    
    // Check if user is the owner or has manage_equipment permission
    if (booking.userId !== session.id && !hasPermission(session.role, "manage_equipment")) {
      return { success: false, error: "Unauthorized" };
    }

    if (booking.status === "CANCELLED" || booking.status === "REJECTED" || booking.status === "RETURNED") {
      return { success: false, error: "Cannot cancel a booking in this status" };
    }

    await prisma.equipmentBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await createAuditLog(session.id, "CANCEL_EQUIPMENT", id, { equipmentId: booking.equipmentId });

    revalidatePath("/dashboard/equipment/my-bookings");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling equipment booking:", error);
    return { success: false, error: "Failed to cancel equipment booking" };
  }
}
