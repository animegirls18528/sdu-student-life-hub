/**
 * RBAC Permission Matrix
 * ─────────────────────
 * Central definition of what each role can do in the system.
 * Used by both proxy.ts (route-level) and server actions (action-level).
 */

export const ROLES = ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

// ── Route-level permissions ───────────────────────────────────────────────
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/dashboard/schedule":       ["STUDENT", "TEACHER"],
  "/dashboard/exams":          ["STUDENT", "TEACHER"],
  "/dashboard/tasks":          ["STUDENT"],
  "/dashboard/community":      ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/attendance":     ["STUDENT", "TEACHER"],
  "/dashboard/rooms":          ["STUDENT", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/equipment":      ["STUDENT", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/activities":     ["STUDENT", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/announcements":  ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/about":          ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/teaching-schedule":["TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/profile":        ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/contact":        ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  "/dashboard/logs":           ["ADMIN", "SUPER_ADMIN"],
  "/dashboard/users":          ["SUPER_ADMIN"],
};

// ── Action-level permissions ──────────────────────────────────────────────
export const ACTION_PERMISSIONS: Record<string, Role[]> = {
  view_schedule:          ["STUDENT", "TEACHER"],
  view_exams:             ["STUDENT", "TEACHER"],
  manage_tasks:           ["STUDENT"],
  check_in:               ["STUDENT"],
  mark_attendance:        ["TEACHER"],
  view_attendance:        ["STUDENT", "TEACHER"],
  book_room:              ["STUDENT"],
  cancel_room_booking:    ["STUDENT"],
  manage_rooms:           ["ADMIN", "SUPER_ADMIN"],
  book_equipment:         ["STUDENT"],
  cancel_equipment:       ["STUDENT"],
  manage_equipment:       ["ADMIN", "SUPER_ADMIN"],
  register_activity:      ["STUDENT"],
  manage_activities:      ["ADMIN", "SUPER_ADMIN"],
  view_announcements:     ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  manage_announcements:   ["ADMIN", "SUPER_ADMIN"],
  manage_teaching_schedule: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  post_community:         ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  manage_community:       ["ADMIN", "SUPER_ADMIN"],
  view_logs:              ["ADMIN", "SUPER_ADMIN"],
  manage_users:           ["SUPER_ADMIN"],
};

export function hasPermission(role: string, action: string): boolean {
  if (role === "SUPER_ADMIN") return true;
  const allowed = ACTION_PERMISSIONS[action];
  if (!allowed) return false;
  return allowed.includes(role as Role);
}

export function canAccessRoute(role: string, pathname: string): boolean {
  if (role === "SUPER_ADMIN") return true;
  
  const normalizedPath = pathname.toLowerCase();
  if (normalizedPath === "/dashboard") return true;

  for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (normalizedPath.startsWith(route.toLowerCase())) {
      return roles.includes(role as Role);
    }
  }

  return false;
}
