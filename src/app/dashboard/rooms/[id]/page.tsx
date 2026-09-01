"use client";

import { useState, useEffect, use } from "react";
import { getRoomById, bookRoom } from "@/app/actions/rooms";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function RoomBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    async function loadRoom() {
      const res = await getRoomById(id);
      if (res.success) {
        setRoom(res.room);
      } else {
        setError(res.error || "Failed to load room");
      }
      setLoading(false);
    }
    loadRoom();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (startTime >= endTime) {
      setError("เวลาเริ่มจองต้องมาก่อนเวลาสิ้นสุด");
      setSubmitting(false);
      return;
    }

    const res = await bookRoom(id, date, startTime, endTime, purpose);
    if (res.success) {
      router.push("/dashboard/rooms/my-bookings");
    } else {
      setError(res.error || "Failed to book room");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link skeleton */}
        <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />

        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
          {/* Left panel skeleton */}
          <div className="md:w-1/2 p-8 bg-zinc-50 border-r border-zinc-100 space-y-6">
            <div className="h-64 w-full rounded-xl bg-zinc-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-3/4 bg-zinc-200 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-11 w-full bg-zinc-200 rounded-xl animate-pulse" />
              <div className="h-11 w-full bg-zinc-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Right panel skeleton */}
          <div className="md:w-1/2 p-8 space-y-5">
            <div className="h-7 w-1/2 bg-zinc-200 rounded-lg animate-pulse" />
            <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-zinc-100 rounded-xl animate-pulse" />
              <div className="h-12 bg-zinc-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-24 w-full bg-zinc-100 rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-zinc-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }


  if (!room) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-zinc-500">{error || "ไม่พบข้อมูลห้อง"}</p>
        <Link href="/dashboard/rooms" className="text-blue-600 hover:underline">กลับไปหน้ารายการห้อง</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/rooms" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Room Info */}
        <div className="md:w-1/2 p-8 bg-zinc-50 border-r border-zinc-100">
          <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-zinc-200">
             {room.imageUrl ? (
               <Image src={room.imageUrl} alt={room.name} fill className="object-cover" />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                 <MapPin className="w-16 h-16" />
               </div>
             )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{room.name}</h1>
          <p className="text-zinc-500 mb-6">{room.description || "ไม่มีรายละเอียด"}</p>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100">
              <Users className="w-5 h-5 mr-3 text-zinc-400" />
              รองรับได้สูงสุด {room.capacity} คน
            </div>
            <div className="flex items-center text-sm text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100">
               <span className="font-semibold px-2 py-1 bg-zinc-100 rounded text-xs mr-3">
                 {room.type === "MEETING" ? "ห้องประชุม" : room.type === "STUDY" ? "ห้องอ่านหนังสือ" : room.type}
               </span>
               ประเภทห้อง
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">กรอกข้อมูลการจอง</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">วันที่ต้องการจอง</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">เวลาเริ่มต้น</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">เวลาสิ้นสุด</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Duration Summary */}
            {startTime && endTime && startTime < endTime && (() => {
              const [sh, sm] = startTime.split(":").map(Number);
              const [eh, em] = endTime.split(":").map(Number);
              const totalMins = (eh * 60 + em) - (sh * 60 + sm);
              const hours = Math.floor(totalMins / 60);
              const mins = totalMins % 60;
              const label = [
                hours > 0 ? `${hours} ชั่วโมง` : "",
                mins > 0 ? `${mins} นาที` : "",
              ].filter(Boolean).join(" ");
              return (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>ระยะเวลาการจอง: <span className="font-semibold">{label}</span></span>
                </div>
              );
            })()}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">วัตถุประสงค์การใช้งาน</label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="ระบุจุดประสงค์ เช่น ประชุมงานกลุ่มวิชา..."
                className="block w-full p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-200 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? "กำลังดำเนินการ..." : "ยืนยันการจอง"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
