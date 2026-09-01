import { getRooms } from "@/app/actions/rooms";
import Link from "next/link";
import RoomList from "./components/RoomList";

export const metadata = {
  title: "จองห้อง - SDU Student Life Hub",
};

export default async function RoomsPage() {
  const { success, rooms, error } = await getRooms();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">จองห้อง (Room Booking)</h1>
          <p className="text-zinc-500 mt-1">เลือกห้องที่คุณต้องการจองสำหรับการประชุมหรืออ่านหนังสือ</p>
        </div>
        <Link 
          href="/dashboard/rooms/my-bookings"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200"
        >
          ประวัติการจองของฉัน
        </Link>
      </div>

      {!success && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error || "ไม่สามารถโหลดข้อมูลห้องได้"}
        </div>
      )}

      {success && rooms && (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
}
