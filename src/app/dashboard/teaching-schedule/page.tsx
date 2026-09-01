import { getMyTeachingSchedules } from "@/app/actions/teaching-schedule";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleListClient from "./components/ScheduleListClient";
import { getSession } from "@/lib/auth";

export default async function TeachingSchedulePage() {
  const result = await getMyTeachingSchedules();
  const session = await getSession();
  
  if (!result || !result.success || !session) {
    return (
      <div className="p-8 text-center text-zinc-500">
        คุณไม่มีสิทธิ์เข้าถึงหน้านี้ หรือเกิดข้อผิดพลาด
      </div>
    );
  }

  const schedules = result.schedules || [];
  const isAdmin = session.role === "SUPER_ADMIN" || session.role === "ADMIN";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">จัดการตารางสอน</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">เพิ่มหรือแก้ไขตารางการสอนของคุณได้ที่นี่ ข้อมูลจะไปแสดงที่ตารางของนักศึกษา</p>
        </div>
        <ScheduleForm />
      </div>

      <ScheduleListClient schedules={schedules} isAdmin={isAdmin} />
    </div>
  );
}
