"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createActivity, updateActivity, deleteActivity, getActivityById } from "@/app/actions/activities";

export default function ActivityFormPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const router = useRouter();
  const params = use(searchParams);
  const isEditing = !!params.id;
  const activityId = params.id as string;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "GENERAL",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxParticipants: "50",
    imageUrl: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!isEditing) return;
      
      const res = await getActivityById(activityId);
      if (res.success && res.activity) {
        setFormData({
          title: res.activity.title,
          description: res.activity.description || "",
          category: res.activity.category,
          date: res.activity.date,
          startTime: res.activity.startTime,
          endTime: res.activity.endTime,
          location: res.activity.location,
          maxParticipants: res.activity.maxParticipants.toString(),
          imageUrl: res.activity.imageUrl || "",
        });
      } else {
        setError("ไม่พบข้อมูลกิจกรรม");
      }
      setIsLoading(false);
    }
    
    loadData();
  }, [isEditing, activityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      let res;
      if (isEditing) {
        res = await updateActivity(activityId, formData);
      } else {
        res = await createActivity(formData);
      }

      if (res.success) {
        router.push("/dashboard/activities");
        router.refresh();
      } else {
        setError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้? การกระทำนี้ไม่สามารถยกเลิกได้")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteActivity(activityId);
      if (res.success) {
        router.push("/dashboard/activities");
        router.refresh();
      } else {
        setError(res.error || "เกิดข้อผิดพลาดในการลบ");
        setIsDeleting(false);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/activities"
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isEditing ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">ชื่อกิจกรรม *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="ระบุชื่อกิจกรรม"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">รายละเอียดกิจกรรม</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="ระบุรายละเอียดของกิจกรรม..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">หมวดหมู่ *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="GENERAL">ทั่วไป (General)</option>
                <option value="VOLUNTEER">จิตอาสา (Volunteer)</option>
                <option value="SPORT">กีฬา (Sport)</option>
                <option value="ACADEMIC">วิชาการ (Academic)</option>
                <option value="CULTURAL">ศิลปวัฒนธรรม (Cultural)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">วันที่จัดกิจกรรม *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">เวลาเริ่มต้น *</label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">เวลาสิ้นสุด *</label>
              <input
                type="time"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">สถานที่ *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="เช่น หอประชุมอาคาร 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">จำนวนรับสมัครสูงสุด (คน) *</label>
              <input
                type="number"
                name="maxParticipants"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">URL รูปภาพประกอบ (ไม่บังคับ)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              ลบกิจกรรม
            </button>
          ) : (
            <div></div>
          )}
          
          <div className="flex gap-3">
            <Link
              href="/dashboard/activities"
              className="px-6 py-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors font-medium"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isSaving || isDeleting}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm shadow-blue-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "บันทึกการเปลี่ยนแปลง" : "สร้างกิจกรรม"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
