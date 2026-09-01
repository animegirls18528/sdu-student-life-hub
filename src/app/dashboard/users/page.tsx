"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "@/app/actions/users";
import { Loader2, Shield, ShieldAlert, User, GraduationCap, Search } from "lucide-react";

type UserData = {
  id: string;
  email: string;
  name: string;
  role: string;
  studentId: string | null;
  createdAt: Date;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    async function loadUsers() {
      const res = await getAllUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      } else {
        setError(res.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
      setIsLoading(false);
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    const res = await updateUserRole(userId, newRole);
    
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(res.error || "เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์");
    }
    setUpdatingId(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold"><ShieldAlert className="w-3 h-3"/> Super Admin</span>;
      case "ADMIN": return <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold"><Shield className="w-3 h-3"/> Admin</span>;
      case "TEACHER": return <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold"><User className="w-3 h-3"/> Teacher</span>;
      case "STUDENT": return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold"><GraduationCap className="w-3 h-3"/> Student</span>;
      default: return <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs font-bold">{role}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredUsers = users
    .filter((user) => filterRole === "ALL" || user.role === filterRole)
    .filter((user) => user.name.toLowerCase().includes(searchName.toLowerCase()) || (user.studentId && user.studentId.includes(searchName)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">จัดการผู้ใช้งาน</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">ดูรายชื่อผู้ใช้ทั้งหมดและจัดการระดับสิทธิ์การเข้าถึงระบบ</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["ALL", "STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterRole === role
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {role === "ALL" ? "ทั้งหมด" : role}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..." 
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm w-full md:w-72 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-zinc-100 transition-all"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-sm border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 font-medium">ชื่อ-นามสกุล</th>
                <th className="p-4 font-medium">อีเมล</th>
                <th className="p-4 font-medium">รหัสนักศึกษา</th>
                <th className="p-4 font-medium">สถานะสิทธิ์ (Role)</th>
                <th className="p-4 font-medium text-right">ปรับเปลี่ยนสิทธิ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">{user.name}</td>
                  <td className="p-4 text-zinc-500">{user.email}</td>
                  <td className="p-4 text-zinc-500">{user.studentId || "-"}</td>
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    ไม่พบข้อมูลผู้ใช้งานที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
