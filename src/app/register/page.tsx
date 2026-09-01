"use client";

import { useActionState, useEffect, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Hexagon, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/register";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.073 21.376c-.56.364-1.25.901-2.04 1.135-.778.23-1.33.247-1.98.247-.64 0-1.11-.01-1.67-.15-.477-.128-.92-.354-1.44-.543-.53-.2-1.02-.413-1.52-.413-.5 0-.99.213-1.51.413-.53.2-1.01.428-1.55.559-.48.114-.85.127-1.33.127-.64 0-1.28-.012-2.02-.247-.79-.234-1.48-.771-2.04-1.135C-.53 18.152-1.57 12.015 1.57 8.511c1.55-1.722 3.33-2.66 5.04-2.66 1.31 0 2.27.44 3.05.44.75 0 1.57-.44 2.97-.44 2.12 0 3.84 1.13 4.96 2.51-.43.26-.82.59-1.15.98-.82.96-1.25 2.19-1.23 3.44.02 1.34.52 2.56 1.39 3.51.46.5 1.02.91 1.63 1.19-.34.69-.73 1.34-1.11 1.89zm-4.32-17.51c-.81.99-2.15 1.67-3.4 1.57-.14-1.24.42-2.5 1.25-3.43.83-1 2.21-1.63 3.4-1.49.16 1.25-.44 2.36-1.25 3.35z" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 text-blue-600 mb-2">
            <Hexagon className="w-full h-full fill-current" strokeWidth={1.5} />
          </div>
          <h1 className="text-lg font-bold tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
            SDU STUDENT LIFE HUB
          </h1>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            สร้างบัญชีของคุณ
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-emerald-500 dark:text-emerald-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>สมัครร่งาย ปลอดภัย ใช้งานได้ทันที</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            เพลิดเพลินกับบริการและสิทธิประโยชน์มากมาย
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-center gap-3 text-red-800 dark:text-red-300 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <p>{state.error}</p>
          </div>
        )}

        <form className="space-y-4" action={formAction}>
          {/* Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              suppressHydrationWarning
              className="block w-full pl-11 pr-4 py-3 border border-zinc-200 dark:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              placeholder="ชื่อ - นามสกุล"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              suppressHydrationWarning
              className="block w-full pl-11 pr-4 py-3 border border-zinc-200 dark:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              placeholder="อีเมล"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              suppressHydrationWarning
              className="block w-full pl-11 pr-11 py-3 border border-zinc-200 dark:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              placeholder="รหัสผ่าน"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              suppressHydrationWarning
              className="block w-full pl-11 pr-11 py-3 border border-zinc-200 dark:border-zinc-700 placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              placeholder="ยืนยันรหัสผ่าน"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-zinc-500 dark:text-zinc-400">
                ฉันยอมรับ <Link href="/terms" className="text-blue-600 hover:underline">ข้อกำหนดในการให้บริการ</Link> และ <Link href="/privacy" className="text-blue-600 hover:underline">นโยบายความเป็นส่วนตัว</Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100"
          >
            {isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-950 text-zinc-400">หรือสมัครด้วย</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <SocialButton icon={<GoogleIcon />} label="Google" />
            <SocialButton icon={<FacebookIcon />} label="Facebook" />
            <SocialButton icon={<AppleIcon />} label="Apple" />
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2 text-emerald-500 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
            <p className="text-[10px] font-medium leading-relaxed">
              เราให้ความสำคัญกับความปลอดภัยของข้อมูลคุณ<br />
              ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 py-2.5 px-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
    >
      {icon}
      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{label}</span>
    </button>
  );
}
