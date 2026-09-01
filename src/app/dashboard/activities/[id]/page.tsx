"use client";

import { useState, useEffect, use } from "react";
import { getActivityById, registerForActivity, cancelActivityRegistration } from "@/app/actions/activities";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Loader2, PartyPopper } from "lucide-react";
import Image from "next/image";
import ConfirmModal from "@/app/dashboard/components/ConfirmModal";

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [activity, setActivity] = useState<any>(null);
  const [userRegistration, setUserRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    loadActivity();
  }, [id]);

  async function loadActivity() {
    setLoading(true);
    const res = await getActivityById(id);
    if (res.success) {
      setActivity(res.activity);
      setUserRegistration(res.userRegistration);
    } else {
      setError(res.error || "Failed to load activity");
    }
    setLoading(false);
  }

  const handleRegister = async () => {
    setProcessing(true);
    setError(null);
    const res = await registerForActivity(id);
    if (res.success) {
      router.push("/dashboard/activities/my-registrations");
    } else {
      setError(res.error || "Failed to register");
      setProcessing(false);
    }
  };

  const handleConfirmCancel = async () => {
    setProcessing(true);
    setCancelModalOpen(false);
    const res = await cancelActivityRegistration(id);
    if (res.success) {
      await loadActivity(); // Reload to update state
    } else {
      setError(res.error || "Failed to cancel registration");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-zinc-500 dark:text-zinc-400">{error || "ไม่พบข้อมูลกิจกรรม"}</p>
        <Link href="/dashboard/activities" className="text-blue-600 dark:text-blue-400 hover:underline">กลับไปหน้ากิจกรรม</Link>
      </div>
    );
  }

  const currentRegistrations = activity._count?.registrations || 0;
  const isFull = currentRegistrations >= activity.maxParticipants;
  const isRegistered = userRegistration && userRegistration.status === "REGISTERED";

  return (
    <>
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="ยืนยันการยกเลิก"
        description="คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการลงทะเบียนกิจกรรมนี้?"
        confirmLabel="ยืนยันยกเลิก"
        cancelLabel="ปิด"
        isDestructive={true}
        isLoading={processing}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/dashboard/activities" className="inline-flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="relative h-64 md:h-80 w-full bg-zinc-100 dark:bg-zinc-800">
             {activity.imageUrl ? (
               <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover" />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                 <PartyPopper className="w-16 h-16" />
               </div>
             )}
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{activity.title}</h1>
                  <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold mb-4">
                    {activity.category}
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">วันที่จัดกิจกรรม</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(activity.date).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">เวลา</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{activity.startTime} - {activity.endTime} น.</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">สถานที่</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{activity.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">จำนวนที่รับ</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{currentRegistrations} / {activity.maxParticipants} คน</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Box */}
              <div className="md:w-72 shrink-0">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 sticky top-6">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">สถานะการลงทะเบียน</h3>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
                      {error}
                    </div>
                  )}

                  {isRegistered ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/50">
                        <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                        <span className="font-medium text-sm">คุณลงทะเบียนเรียบร้อยแล้ว</span>
                      </div>
                      <button
                        onClick={() => setCancelModalOpen(true)}
                        disabled={processing}
                        className="w-full py-2.5 text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
                      >
                        ยกเลิกการลงทะเบียน
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {isFull ? (
                        <div className="flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
                          <XCircle className="w-5 h-5 mr-2 shrink-0" />
                          <span className="font-medium text-sm">กิจกรรมนี้เต็มแล้ว</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleRegister}
                          disabled={processing}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 active:scale-95 flex justify-center items-center disabled:opacity-50"
                        >
                          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "ลงทะเบียนเข้าร่วม"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
