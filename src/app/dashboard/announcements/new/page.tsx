"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementById } from "@/app/actions/announcements";

export default function AnnouncementFormPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const router = useRouter();
  const params = use(searchParams);
  const isEditing = !!params.id;
  const announcementId = params.id as string;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "ทั่วไป",
    author: "Admin",
  });

  useEffect(() => {
    async function loadData() {
      if (!isEditing) return;
      
      const res = await getAnnouncementById(announcementId);
      if (res.success && res.announcement) {
        setFormData({
          title: res.announcement.title,
          content: res.announcement.content,
          type: res.announcement.type,
          author: res.announcement.author,
        });
      } else {
        setError("ไม่พบข้อมูลประกาศ");
      }
      setIsLoading(false);
    }
    
    loadData();
  }, [isEditing, announcementId]);

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
        res = await updateAnnouncement(announcementId, formData);
      } else {
        res = await createAnnouncement(formData);
      }

      if (res.success) {
        router.push("/dashboard/announcements");
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
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้? การกระทำนี้ไม่สามารถยกเลิกได้")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteAnnouncement(announcementId);
      if (res.success) {
        router.push("/dashboard/announcements");
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
          href="/dashboard/announcements"
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isEditing ? "แก้ไขประกาศ" : "สร้างประกาศใหม่"}
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
            <label className="block text-sm font-medium text-zinc-700 mb-1">หัวข้อประกาศ *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="ระบุหัวข้อประกาศ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">รายละเอียดเนื้อหา *</label>
            <textarea
              name="content"
              required
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="ระบุรายละเอียดเนื้อหาประกาศ..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">ประเภทประกาศ *</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="ทั่วไป">ทั่วไป (General)</option>
                <option value="ด่วน">ด่วน (Urgent)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">นามผู้ประกาศ *</label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="เช่น สำนักวิทยบริการ, Admin"
              />
            </div>
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
              ลบประกาศ
            </button>
          ) : (
            <div></div>
          )}
          
          <div className="flex gap-3">
            <Link
              href="/dashboard/announcements"
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
              {isEditing ? "บันทึกการเปลี่ยนแปลง" : "สร้างประกาศ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
