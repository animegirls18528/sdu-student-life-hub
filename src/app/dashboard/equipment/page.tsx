import { getEquipments } from "@/app/actions/equipment";
import Link from "next/link";
import EquipmentList from "./components/EquipmentList";

export const metadata = {
  title: "ยืมอุปกรณ์ - SDU Student Life Hub",
};

export default async function EquipmentPage() {
  const { success, equipments, error } = await getEquipments();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">ยืมอุปกรณ์ (Equipment)</h1>
          <p className="text-zinc-500 mt-1">เลือกอุปกรณ์ที่คุณต้องการยืมสำหรับการเรียนหรือทำกิจกรรม</p>
        </div>
        <Link 
          href="/dashboard/equipment/my-bookings"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200"
        >
          ประวัติการยืมของฉัน
        </Link>
      </div>

      {!success && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error || "ไม่สามารถโหลดข้อมูลอุปกรณ์ได้"}
        </div>
      )}

      {success && equipments && (
        <EquipmentList equipments={equipments} />
      )}
    </div>
  );
}
