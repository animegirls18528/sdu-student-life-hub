"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createTeachingSchedule } from "@/app/actions/teaching-schedule";
import { useRouter } from "next/navigation";

export default function ScheduleForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createTeachingSchedule(formData);
    
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
      >
        <Plus className="w-5 h-5" />
        เพิ่มตารางสอน
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">เพิ่มตารางสอน</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">ชื่อวิชา</label>
                <input type="text" name="courseName" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เช่น การเขียนโปรแกรมเว็บ" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">รหัสวิชา (ไม่บังคับ)</label>
                <input type="text" name="courseCode" className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เช่น IT101" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">วัน</label>
                  <select name="dayOfWeek" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="จันทร์">จันทร์</option>
                    <option value="อังคาร">อังคาร</option>
                    <option value="พุธ">พุธ</option>
                    <option value="พฤหัสบดี">พฤหัสบดี</option>
                    <option value="ศุกร์">ศุกร์</option>
                    <option value="เสาร์">เสาร์</option>
                    <option value="อาทิตย์">อาทิตย์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">รูปแบบ</label>
                  <select name="type" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="บรรยาย">บรรยาย</option>
                    <option value="ปฏิบัติ">ปฏิบัติ</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">เวลาเริ่ม</label>
                  <input type="time" name="startTime" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">เวลาเลิก</label>
                  <input type="time" name="endTime" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">ห้องเรียน</label>
                <input type="text" name="room" required className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เช่น ห้อง 401 หรือ ออนไลน์" />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกตารางสอน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
