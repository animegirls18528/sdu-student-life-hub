"use client";

import { useState } from "react";
import { AlertCircle, Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { requestResetLink } from "@/app/actions/reset-password";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [devMessage, setDevMessage] = useState<string | null>(null);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("กรุณากรอกอีเมล");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDevMessage(null);
    
    try {
      const result = await requestResetLink(email);
      setIsLoading(false);

      if (result.error) {
        setError(result.error);
      } else {
        setStep(2);
        if (result.devMessage) {
          setDevMessage(result.devMessage);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-zinc-800 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-zinc-900 rounded-full filter blur-[120px] opacity-30 animate-pulse"></div>

      <div className="max-w-md w-full space-y-8 bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800/80 shadow-2xl shadow-black relative z-10">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-black/50 border border-zinc-800">
              <span className="text-2xl font-bold text-white tracking-wider">SDU</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">
            {step === 1 ? "ลืมรหัสผ่าน" : "ส่งลิงก์กู้คืนแล้ว"}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            {step === 1 
              ? "กรอกอีเมลนักศึกษาของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่" 
              : "เราได้ส่งคำแนะนำและลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว"}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestLink}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-zinc-300 mb-2">
                อีเมลนักศึกษา
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-zinc-800 placeholder-zinc-550 text-white bg-zinc-950/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all sm:text-sm"
                  placeholder="student@dusit.ac.th"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-zinc-950 bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
              >
                {isLoading ? "กำลังดำเนินการ..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex justify-center text-green-400 animate-bounce">
              <CheckCircle2 className="h-16 w-16" />
            </div>

            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 text-sm text-zinc-300 space-y-3">
              <p className="font-medium text-white">ขั้นตอนต่อไป:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>เปิดกล่องจดหมายของอีเมล <strong className="text-zinc-200">{email}</strong></li>
                <li>คลิกปุ่ม <strong className="text-zinc-200">"ตั้งรหัสผ่านใหม่"</strong> ในอีเมล</li>
                <li>ลิงก์นี้จะมีอายุการใช้งาน 15 นาที เพื่อความปลอดภัย</li>
              </ul>
            </div>

            {devMessage && (
              <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 flex flex-col gap-2 text-amber-250 text-xs font-mono">
                <div className="flex items-center gap-2 font-semibold text-amber-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <p>Developer Mode Fallback</p>
                </div>
                <p>{devMessage}</p>
                <div className="mt-2 pt-2 border-t border-amber-800/30">
                  <Link 
                    href={devMessage.split("ลิงก์นี้เพื่อดำเนินการต่อได้: ")[1] || "#"} 
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 underline font-semibold text-sm transition-colors"
                  >
                    คลิกเพื่อเปิดลิงก์รีเซ็ต (ข้ามขั้นตอนอีเมล) <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link 
                href="/login"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-zinc-800 text-sm font-semibold rounded-xl text-white bg-zinc-900 hover:bg-zinc-850 focus:outline-none transition-all shadow-md"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
