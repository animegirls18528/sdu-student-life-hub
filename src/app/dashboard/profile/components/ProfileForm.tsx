"use client";

import { useState } from "react";
import { User, Lock, Save, Loader2, AlertCircle, CheckCircle2, Camera } from "lucide-react";
import { updateProfile, changePassword, uploadProfilePicture } from "@/app/actions/profile";
import Image from "next/image";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    studentId: string;
    role: string;
    imageUrl?: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [profileData, setProfileData] = useState({ 
    name: initialData.name, 
    studentId: initialData.studentId 
  });
  
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [avatarUrl, setAvatarUrl] = useState(initialData.imageUrl || "");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage({ type: "error", text: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadProfilePicture(formData);
    
    if (res.success && res.imageUrl) {
      setAvatarUrl(res.imageUrl);
      setProfileMessage({ type: "success", text: "อัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว" });
    } else {
      setProfileMessage({ type: "error", text: res.error || "เกิดข้อผิดพลาดในการอัปโหลด" });
    }
    
    setIsUploadingAvatar(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: "", text: "" });

    const res = await updateProfile(profileData);
    
    if (res.success) {
      setProfileMessage({ type: "success", text: "อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว" });
    } else {
      setProfileMessage({ type: "error", text: res.error || "เกิดข้อผิดพลาด" });
    }
    
    setIsUpdatingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านใหม่ไม่ตรงกัน" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    const res = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    
    if (res.success) {
      setPasswordMessage({ type: "success", text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setPasswordMessage({ type: "error", text: res.error || "เกิดข้อผิดพลาด" });
    }
    
    setIsChangingPassword(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Profile Info Form */}
      <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">ข้อมูลส่วนตัว</h2>
        </div>

        {profileMessage.text && (
          <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 ${
            profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {profileMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm">{profileMessage.text}</p>
          </div>
        )}

        {/* Avatar Upload */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border-4 border-white shadow-md relative">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
                  {initialData.name.charAt(0)}
                </div>
              )}
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-600 cursor-pointer hover:bg-zinc-50 hover:text-blue-600 transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
            </label>
          </div>
          <p className="text-xs text-zinc-500">รองรับ JPG, PNG (สูงสุด 5MB)</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
            <input 
              type="email" 
              value={initialData.email}
              disabled
              className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl outline-none transition-all"
            />
          </div>

          {initialData.role === "STUDENT" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">รหัสนักศึกษา</label>
              <input 
                type="text" 
                value={profileData.studentId}
                onChange={(e) => setProfileData({...profileData, studentId: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl outline-none transition-all"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">เปลี่ยนรหัสผ่าน</h2>
        </div>

        {passwordMessage.text && (
          <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 ${
            passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm">{passwordMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">รหัสผ่านปัจจุบัน</label>
            <input 
              type="password" 
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">รหัสผ่านใหม่</label>
            <input 
              type="password" 
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">ยืนยันรหัสผ่านใหม่</label>
            <input 
              type="password" 
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              อัปเดตรหัสผ่าน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
