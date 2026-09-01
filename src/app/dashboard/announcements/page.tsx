import { Plus } from "lucide-react";
import Link from "next/link";
import { getAnnouncements } from "@/app/actions/announcements";
import { getSession } from "@/lib/auth";
import AnnouncementList from "./components/AnnouncementList";

export const metadata = {
  title: "ประกาศข่าวสาร - SDU Student Life Hub",
};

export default async function AnnouncementsPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "SUPER_ADMIN";
  
  const { success, announcements, error } = await getAnnouncements();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">ประกาศข่าวสาร</h1>
          <p className="text-zinc-500 mt-1">ติดตามข่าวสารสำคัญและกิจกรรมต่างๆ จากทางมหาวิทยาลัย</p>
        </div>
        
        {isAdmin && (
          <Link 
            href="/dashboard/announcements/new"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm shadow-emerald-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> เพิ่มประกาศใหม่
          </Link>
        )}
      </div>

      {!success && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error || "ไม่สามารถโหลดข้อมูลประกาศได้"}
        </div>
      )}

      {success && announcements && (
        <AnnouncementList announcements={announcements} isAdmin={isAdmin} />
      )}
    </div>
  );
}
