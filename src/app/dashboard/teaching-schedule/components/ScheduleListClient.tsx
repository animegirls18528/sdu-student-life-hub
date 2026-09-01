"use client";

import { useState } from "react";
import { Clock, MapPin, Trash2, CalendarDays, Search, User } from "lucide-react";
import { deleteTeachingSchedule } from "@/app/actions/teaching-schedule";
import { useRouter } from "next/navigation";

export default function ScheduleListClient({ schedules, isAdmin }: { schedules: any[], isAdmin: boolean }) {
  const [searchName, setSearchName] = useState("");
  const [filterDay, setFilterDay] = useState("ALL");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filtered = schedules.filter(s => {
    const matchName = 
      (s.user?.name || "").toLowerCase().includes(searchName.toLowerCase()) || 
      s.courseName.toLowerCase().includes(searchName.toLowerCase()) ||
      (s.courseCode || "").toLowerCase().includes(searchName.toLowerCase());
    
    const matchDay = filterDay === "ALL" || s.dayOfWeek === filterDay;
    return matchName && matchDay;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบตารางสอนนี้ใช่หรือไม่?")) return;
    
    setIsDeleting(id);
    await deleteTeachingSchedule(id);
    setIsDeleting(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {isAdmin && (
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้สอน, ชื่อวิชา, รหัสวิชา..." 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm w-full bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-zinc-100 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
        <select 
          value={filterDay} 
          onChange={(e) => setFilterDay(e.target.value)}
          className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer sm:w-48"
        >
          <option value="ALL">ทุกวัน</option>
          <option value="จันทร์">จันทร์</option>
          <option value="อังคาร">อังคาร</option>
          <option value="พุธ">พุธ</option>
          <option value="พฤหัสบดี">พฤหัสบดี</option>
          <option value="ศุกร์">ศุกร์</option>
          <option value="เสาร์">เสาร์</option>
          <option value="อาทิตย์">อาทิตย์</option>
        </select>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {filtered.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((schedule) => (
              <div key={schedule.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group">
                <div className="flex flex-col gap-1 w-32 shrink-0">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold">
                    <CalendarDays className="w-5 h-5 text-blue-500" />
                    {schedule.dayOfWeek}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
                    <Clock className="w-4 h-4" />
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">
                    {schedule.courseName}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {schedule.courseCode && (
                      <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                        รหัสวิชา: {schedule.courseCode}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.room}</span>
                    </div>
                    {isAdmin && schedule.user && (
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg">
                        <User className="w-4 h-4" />
                        <span>{schedule.user.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    schedule.type === 'บรรยาย' 
                      ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' 
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {schedule.type}
                  </span>
                  
                  <button 
                    onClick={() => handleDelete(schedule.id)} 
                    disabled={isDeleting === schedule.id}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50" 
                    title="ลบตารางสอน"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <CalendarDays className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">ไม่พบตารางสอน</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              {schedules.length === 0 
                ? "ยังไม่มีตารางสอนใดๆ กดปุ่ม 'เพิ่มตารางสอน' ด้านบนเพื่อเริ่มต้น" 
                : "ไม่พบข้อมูลที่ตรงกับการค้นหาของคุณ"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
