/**
 * Audit Log Helper
 * ────────────────
 * Central utility for recording audit events (bookings, check-ins, etc.)
 */

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type AuditAction =
  | "BOOK_ROOM"
  | "CANCEL_ROOM"
  | "BOOK_EQUIPMENT"
  | "CANCEL_EQUIPMENT"
  | "CHECK_IN"
  | "MARK_ATTENDANCE"
  | "REGISTER_ACTIVITY"
  | "CANCEL_ACTIVITY"
  | "CREATE_POST"
  | "DELETE_POST"
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "CHANGE_ROLE"
  | "CHANGE_PASSWORD";

export async function createAuditLog(
  userId: string,
  action: AuditAction,
  target: string,
  details?: Record<string, any>
) {
  try {
    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    try {
      const headersList = await headers();
      ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
      userAgent = headersList.get("user-agent") || null;
    } catch {
      // headers() may not be available in all contexts
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Audit log failure should never break the main operation
    console.error("Failed to create audit log:", error);
  }
}
