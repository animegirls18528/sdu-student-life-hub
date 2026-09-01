"use client";

import { useState } from "react";
import { Shield, Activity } from "lucide-react";

const AUDIT_ACTION_LABELS: Record<string, string> = {
  BOOK_ROOM: "จองห้อง",
  CANCEL_ROOM: "ยกเลิกจองห้อง",
  BOOK_EQUIPMENT: "ยืมอุปกรณ์",
  CANCEL_EQUIPMENT: "ยกเลิกยืมอุปกรณ์",
  CHECK_IN: "เช็คชื่อเข้าเรียน",
  MARK_ATTENDANCE: "อาจารย์เช็คชื่อ",
  REGISTER_ACTIVITY: "ลงทะเบียนกิจกรรม",
  CANCEL_ACTIVITY: "ยกเลิกกิจกรรม",
  CREATE_POST: "สร้างโพสต์",
  DELETE_POST: "ลบโพสต์",
  LOGIN_SUCCESS: "เข้าสู่ระบบสำเร็จ",
  LOGIN_FAILED: "เข้าสู่ระบบไม่สำเร็จ",
  CHANGE_ROLE: "เปลี่ยน Role",
  CHANGE_PASSWORD: "เปลี่ยนรหัสผ่าน",
};

function getActionBadge(action: string) {
  const label = AUDIT_ACTION_LABELS[action] || action;
  const colors: Record<string, string> = {
    BOOK_ROOM: "bg-blue-100 text-blue-800",
    CANCEL_ROOM: "bg-red-100 text-red-800",
    BOOK_EQUIPMENT: "bg-indigo-100 text-indigo-800",
    CANCEL_EQUIPMENT: "bg-red-100 text-red-800",
    CHECK_IN: "bg-green-100 text-green-800",
    MARK_ATTENDANCE: "bg-emerald-100 text-emerald-800",
    REGISTER_ACTIVITY: "bg-purple-100 text-purple-800",
    CANCEL_ACTIVITY: "bg-orange-100 text-orange-800",
  };
  const color = colors[action] || "bg-zinc-100 text-zinc-800";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>;
}

export default function LogList({ loginLogs, auditLogs }: { loginLogs: any[]; auditLogs: any[] }) {
  const [activeTab, setActiveTab] = useState<"login" | "audit">("login");
  const [loginFilter, setLoginFilter] = useState<string>("ALL");
  const [auditFilter, setAuditFilter] = useState<string>("ALL");

  const loginStatuses = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "SUCCESS", label: "สำเร็จ" },
    { id: "FAILED", label: "ล้มเหลว" },
  ];

  const auditActions = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "BOOK_ROOM", label: "จองห้อง" },
    { id: "BOOK_EQUIPMENT", label: "ยืมอุปกรณ์" },
    { id: "CHECK_IN", label: "เช็คชื่อ" },
    { id: "MARK_ATTENDANCE", label: "อาจารย์เช็คชื่อ" },
    { id: "REGISTER_ACTIVITY", label: "ลงทะเบียน" },
    { id: "CANCEL", label: "ยกเลิก (ทุกประเภท)" },
  ];

  const filteredLoginLogs = loginLogs.filter((log) => {
    if (loginFilter === "ALL") return true;
    if (loginFilter === "SUCCESS") return log.success === true;
    if (loginFilter === "FAILED") return log.success === false;
    return true;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === "ALL") return true;
    if (auditFilter === "CANCEL") return log.action.startsWith("CANCEL");
    return log.action === auditFilter;
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === "login" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-800"}`}
        >
          <Shield className="w-4 h-4" />
          ประวัติเข้าสู่ระบบ ({loginLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === "audit" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-800"}`}
        >
          <Activity className="w-4 h-4" />
          ประวัติการใช้งาน ({auditLogs.length})
        </button>
      </div>

      {/* Login Logs Tab */}
      {activeTab === "login" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {loginStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setLoginFilter(status.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  loginFilter === status.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">บัญชีผู้ใช้</th>
                    <th className="px-6 py-4">วัน เดือน ปี</th>
                    <th className="px-6 py-4">เวลา</th>
                    <th className="px-6 py-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredLoginLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">ไม่พบประวัติ</td>
                    </tr>
                  ) : (
                    filteredLoginLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{log.username}</td>
                        <td className="px-6 py-4 text-zinc-500">{new Intl.DateTimeFormat("th-TH", { year: "numeric", month: "long", day: "numeric" }).format(new Date(log.createdAt))}</td>
                        <td className="px-6 py-4 text-zinc-500">{new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(log.createdAt))} น.</td>
                        <td className="px-6 py-4">
                          {log.success ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">สำเร็จ</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">ล้มเหลว</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {auditActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setAuditFilter(action.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  auditFilter === action.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">การดำเนินการ</th>
                    <th className="px-6 py-4">เป้าหมาย</th>
                    <th className="px-6 py-4">รายละเอียด</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">เวลา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">ไม่พบประวัติการใช้งาน</td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-zinc-600">{log.userId.slice(0, 8)}...</td>
                        <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-600">{log.target.slice(0, 12)}...</td>
                        <td className="px-6 py-4 text-zinc-500 text-xs max-w-[200px] truncate" title={log.details || ""}>
                          {log.details ? (() => { try { const d = JSON.parse(log.details); return Object.entries(d).map(([k,v]) => `${k}: ${v}`).join(', '); } catch { return log.details; } })() : "-"}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">{log.ipAddress || "-"}</td>
                        <td className="px-6 py-4 text-zinc-500 text-xs whitespace-nowrap">
                          {new Intl.DateTimeFormat("th-TH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(log.createdAt))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

