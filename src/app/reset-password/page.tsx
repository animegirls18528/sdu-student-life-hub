"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, AlertCircle, Lock, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { validateResetToken, resetPasswordWithToken } from "@/app/actions/reset-password";

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<1 | 2>(1); // 1: Reset Form, 2: Success Page
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Token validation states
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate the token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setValidationError("ไม่พบลิงก์กู้คืนรหัสผ่าน (Token หายไป)");
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(token);
        if (result.error) {
          setValidationError(result.error);
        } else if (result.email) {
          setUserEmail(result.email);
        }
      } catch (err) {
        setValidationError("เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อตรวจสอบลิงก์");
      } finally {
        setIsValidating(false);
      }
    }

    checkToken();
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPasswordWithToken(token || "", newPassword);
      setIsLoading(false);

      if (result.error) {
        setError(result.error);
      } else {
        setStep(2);
      }
    } catch (err) {
      setIsLoading(false);
      setError("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">กำลังตรวจสอบความถูกต้องของลิงก์...</p>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center text-red-500">
          <AlertCircle className="h-16 w-16" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">ลิงก์ไม่สามารถใช้งานได้</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            {validationError}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/forgot-password"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-zinc-950 bg-white hover:bg-zinc-200 focus:outline-none transition-all shadow-lg shadow-white/5"
          >
            ขอลิงก์รีเซ็ตรหัสผ่านใหม่
          </Link>
          
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {userEmail && (
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-center">
              <span className="text-xs text-zinc-400 block mb-0.5">เปลี่ยนรหัสผ่านสำหรับบัญชี</span>
              <strong className="text-sm text-zinc-200 font-medium">{userEmail}</strong>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 flex items-center gap-3 text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-zinc-300 mb-2">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-zinc-800 placeholder-zinc-550 text-white bg-zinc-950/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all sm:text-sm"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-300 mb-2">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-3 border border-zinc-800 placeholder-zinc-550 text-white bg-zinc-950/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent transition-all sm:text-sm"
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-zinc-950 bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
            >
              {isLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "ตั้งรหัสผ่านใหม่"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="mt-8 space-y-6 text-center">
          <div className="flex justify-center text-green-400 animate-bounce">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-zinc-300">
              รหัสผ่านใหม่ของคุณอัปเดตลงฐานข้อมูลเรียบร้อยแล้ว
            </p>
          </div>
          
          <Link 
            href="/login"
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-zinc-950 bg-white hover:bg-zinc-200 focus:outline-none transition-all shadow-lg shadow-white/10"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-zinc-500 group-hover:text-zinc-750 transition-colors" />
            </span>
            เข้าสู่ระบบด้วยรหัสผ่านใหม่
          </Link>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
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
            ตั้งรหัสผ่านใหม่
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            กรุณากรอกรหัสผ่านใหม่สำหรับความปลอดภัยของบัญชีคุณ
          </p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">กำลังโหลดหน้าจอตั้งรหัสผ่านใหม่...</p>
          </div>
        }>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
