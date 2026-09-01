"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getRooms() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, rooms };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { success: false, error: "Failed to fetch rooms" };
  }
}

export async function getRoomById(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });
    if (!room) return { success: false, error: "Room not found" };
    return { success: true, room };
  } catch (error) {
    console.error("Error fetching room:", error);
    return { success: false, error: "Failed to fetch room" };
  }
}

export async function bookRoom(roomId: string, date: string, startTime: string, endTime: string, purpose: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    // Check for conflicts
    const conflictingBookings = await prisma.roomBooking.findMany({
      where: {
        roomId,
        date,
        status: { in: ["PENDING", "APPROVED"] },
        OR: [
          {
            // New booking starts during an existing booking
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            // New booking ends during an existing booking
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            // New booking completely envelops an existing booking
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          }
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return { success: false, error: "This room is already booked for the selected time." };
    }

    const booking = await prisma.roomBooking.create({
      data: {
        roomId,
        userId: session.id,
        date,
        startTime,
        endTime,
        purpose,
        status: "PENDING",
      },
    });

    await createAuditLog(session.id, "BOOK_ROOM", booking.id, {
      roomId, date, startTime, endTime, purpose
    });

    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/rooms/my-bookings");
    return { success: true, booking };
  } catch (error) {
    console.error("Error booking room:", error);
    return { success: false, error: "Failed to book room" };
  }
}

export async function getMyBookings() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const bookings = await prisma.roomBooking.findMany({
      where: { userId: session.id },
      include: { room: true },
      orderBy: [
        { date: "desc" },
        { startTime: "desc" }
      ],
    });
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}

export async function cancelBooking(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const booking = await prisma.roomBooking.findUnique({ where: { id } });
    if (!booking) return { success: false, error: "Booking not found" };
    
    // Check if user is the owner or has manage_rooms permission
    const { hasPermission } = await import('@/lib/rbac');
    if (booking.userId !== session.id && !hasPermission(session.role, "manage_rooms")) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.roomBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await createAuditLog(session.id, "CANCEL_ROOM", id, { roomId: booking.roomId });

    revalidatePath("/dashboard/rooms/my-bookings");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, error: "Failed to cancel booking" };
  }
}
