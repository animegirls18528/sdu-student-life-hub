"use client";

import { useState, useEffect } from "react";
import { getMyActivityRegistrations, cancelActivityRegistration } from "@/app/actions/activities";
import Link from "next/link";
import { Calendar, Clock, MapPin, XCircle, ArrowLeft, Loader2, Info, PartyPopper } from "lucide-react";
import ConfirmModal from "@/app/dashboard/components/ConfirmModal";

export default function MyActivityRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function loadRegistrations() {
    setLoading(true);
    const res = await getMyActivityRegistrations();
    if (res.success && res.registrations) {
      setRegistrations(res.registrations);
    }
    setLoading(false);
  }

  const requestCancel = (activityId: string) => {
    setSelectedActivityId(activityId);
    setModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedActivityId) return;
    setCancellingId(selectedActivityId);
    setModalOpen(false);

    const res = await cancelActivityRegistration(selectedActivityId);
    if (res.success) {
      loadRegistrations();
    }
    setCancellingId(null);
    setSelectedActivityId(null);
  };

  const handleCancelModal = () => {
    setModalOpen(false);
    setSelectedActivityId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REGISTERED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">ลงทะเบียนแล้ว</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">ยกเลิกแล้ว</span>;
      case "ATTENDED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">เข้าร่วมแล้ว</span>;
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
        title="ยืนยันการยกเลิกการลงทะเบียน"
        description="คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการลงทะเบียนกิจกรรมนี้? หากยกเลิกแล้ว สิทธิ์ของคุณจะถูกมอบให้ผู้อื่น"
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
              <Link href="/dashboard/activities" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-zinc-900">กิจกรรมที่ฉันลงทะเบียน</h1>
            </div>
            <p className="text-zinc-500 ml-8">รายการกิจกรรมที่คุณได้เข้าร่วมหรือเคยลงทะเบียนไว้</p>
          </div>
          <Link
            href="/dashboard/activities"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
          >
            ดูกิจกรรมทั้งหมด
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
               <Info className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">ยังไม่มีการลงทะเบียน</h3>
            <p className="text-zinc-500">คุณยังไม่ได้ลงทะเบียนเข้าร่วมกิจกรรมใดๆ ในระบบ</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {registrations.map((reg) => (
              <div key={reg.id} className={`bg-white p-6 rounded-2xl border ${reg.status === 'CANCELLED' ? 'border-red-100 bg-red-50/30 opacity-75' : 'border-zinc-100 hover:border-zinc-200'} flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors shadow-sm`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                      <PartyPopper className={`w-5 h-5 mr-2 ${reg.status === 'CANCELLED' ? 'text-red-400' : 'text-blue-500'}`} />
                      <Link href={`/dashboard/activities/${reg.activityId}`} className="hover:text-blue-600 transition-colors">
                        {reg.activity?.title || "กิจกรรมถูกลบ"}
                      </Link>
                    </h3>
                    <div className="md:hidden">
                      {getStatusBadge(reg.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-zinc-600 mb-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                      {new Date(reg.activity?.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                      {reg.activity?.startTime} - {reg.activity?.endTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                      {reg.activity?.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t border-zinc-100 md:border-t-0 pt-4 md:pt-0 shrink-0">
                  <div className="hidden md:block">
                    {getStatusBadge(reg.status)}
                  </div>

                  {reg.status === "REGISTERED" && (
                    <button
                      onClick={() => requestCancel(reg.activityId)}
                      disabled={cancellingId === reg.activityId}
                      className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancellingId === reg.activityId ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1.5" />
                      )}
                      ยกเลิกการลงทะเบียน
                    </button>
                  )}
                  
                  {reg.status === "CANCELLED" && (
                    <div className="text-xs text-zinc-400">
                      ยกเลิกเมื่อ: {new Date(reg.updatedAt).toLocaleDateString("th-TH")}
                    </div>
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
