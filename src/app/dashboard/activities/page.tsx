import { getActivities } from "@/app/actions/activities";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Plus } from "lucide-react";
import ActivityList from "./components/ActivityList";

export const metadata = {
  title: "ลงทะเบียนกิจกรรม - SDU Student Life Hub",
};

export default async function ActivitiesPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "SUPER_ADMIN";
  const { success, activities, error } = await getActivities();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">กิจกรรม (Activities)</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">ค้นหาและลงทะเบียนเข้าร่วมกิจกรรมต่างๆ ของมหาวิทยาลัย</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link 
              href="/dashboard/activities/new"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm shadow-emerald-200 dark:shadow-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> เพิ่มกิจกรรมใหม่
            </Link>
          )}
          <Link 
            href="/dashboard/activities/my-registrations"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 dark:shadow-none"
          >
            กิจกรรมที่ฉันลงทะเบียน
          </Link>
        </div>
      </div>

      {!success && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
          {error || "ไม่สามารถโหลดข้อมูลกิจกรรมได้"}
        </div>
      )}

      {success && activities && (
        <ActivityList activities={activities} isAdmin={isAdmin} />
      )}
    </div>
  );
}
