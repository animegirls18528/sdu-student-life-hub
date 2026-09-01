"use client";

import { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "@/app/actions/rooms";
import Link from "next/link";
import { Calendar, Clock, MapPin, XCircle, ArrowLeft, Loader2, Info } from "lucide-react";
import ConfirmModal from "@/app/dashboard/components/ConfirmModal";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    const res = await getMyBookings();
    if (res.success && res.bookings) {
      setBookings(res.bookings);
    }
    setLoading(false);
  }

  const requestCancel = (id: string) => {
    setSelectedBookingId(id);
    setModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    setCancellingId(selectedBookingId);
    setModalOpen(false);

    const res = await cancelBooking(selectedBookingId);
    if (res.success) {
      loadBookings();
    }
    setCancellingId(null);
    setSelectedBookingId(null);
  };

  const handleCancelModal = () => {
    setModalOpen(false);
    setSelectedBookingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">รออนุมัติ</span>;
      case "APPROVED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">อนุมัติแล้ว</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">ไม่อนุมัติ</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-500">ยกเลิกแล้ว</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={modalOpen}
        title="ยืนยันการยกเลิกการจอง"
        description="คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้? การดำเนินการนี้ไม่สามารถเรียกคืนได้"
        confirmLabel="ยืนยันยกเลิก"
        cancelLabel="ไม่ยกเลิก"
        isDestructive={true}
        isLoading={cancellingId !== null}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Link href="/dashboard/rooms" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-zinc-900">ประวัติการจองห้องของฉัน</h1>
            </div>
            <p className="text-zinc-500 ml-8">รายการจองห้องประชุมและพื้นที่ส่วนกลางทั้งหมดของคุณ</p>
          </div>
          <Link 
            href="/dashboard/rooms"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
          >
            จองห้องเพิ่ม
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
               <Info className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">ยังไม่มีประวัติการจอง</h3>
            <p className="text-zinc-500">คุณยังไม่ได้ทำการจองห้องใดๆ ในระบบ</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-2xl border border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-200 transition-colors shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-zinc-400" />
                      {booking.room?.name || "ห้องถูกลบ"}
                    </h3>
                    <div className="md:hidden">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-zinc-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                      {new Date(booking.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>

                  <div className="text-sm text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="font-medium text-zinc-700 mr-2">วัตถุประสงค์:</span>
                    {booking.purpose}
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t border-zinc-100 md:border-t-0 pt-4 md:pt-0">
                  <div className="hidden md:block">
                    {getStatusBadge(booking.status)}
                  </div>

                  {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                    <button
                      onClick={() => requestCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1.5" />
                      )}
                      ยกเลิกการจอง
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
