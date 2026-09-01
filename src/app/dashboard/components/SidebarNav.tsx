"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, BookOpen, CheckSquare, MessageSquare, MapPin, Monitor, UserCheck, PartyPopper, Phone, User, Users } from "lucide-react";

export default function SidebarNav({ role = "STUDENT" }: { role?: string }) {
  const pathname = usePathname();

  const allNavItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "แผงควบคุม", roles: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/schedule", icon: <Calendar className="w-5 h-5" />, label: "ตารางเรียน", roles: ["STUDENT", "TEACHER"] },
    { href: "/dashboard/teaching-schedule", icon: <Calendar className="w-5 h-5" />, label: "จัดการตารางสอน", roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/exams", icon: <BookOpen className="w-5 h-5" />, label: "ตารางสอบ", roles: ["STUDENT", "TEACHER"] },
    { href: "/dashboard/tasks", icon: <CheckSquare className="w-5 h-5" />, label: "รายการสิ่งที่ต้องทำ", roles: ["STUDENT"] },
    { href: "/dashboard/community", icon: <MessageSquare className="w-5 h-5" />, label: "คอมมูนิตี้", roles: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/attendance", icon: <UserCheck className="w-5 h-5" />, label: "เช็คชื่อเข้าเรียน", roles: ["STUDENT", "TEACHER"] },
    { href: "/dashboard/rooms", icon: <MapPin className="w-5 h-5" />, label: "จองห้อง", roles: ["STUDENT", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/equipment", icon: <Monitor className="w-5 h-5" />, label: "ยืมอุปกรณ์", roles: ["STUDENT", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/activities", icon: <PartyPopper className="w-5 h-5" />, label: "ลงทะเบียนกิจกรรม", roles: ["STUDENT", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/announcements", icon: <MessageSquare className="w-5 h-5" />, label: "ประกาศข่าวสาร", roles: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/about", icon: <User className="w-5 h-5" />, label: "เกี่ยวกับเรา", roles: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/logs", icon: <CheckSquare className="w-5 h-5" />, label: "Log", roles: ["ADMIN", "SUPER_ADMIN"] },
    { href: "/dashboard/users", icon: <Users className="w-5 h-5" />, label: "จัดการผู้ใช้งาน", roles: ["SUPER_ADMIN"] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-700 dark:hover:text-blue-400"
            }`}
          >
            <span className={isActive ? "text-white" : ""}>{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
