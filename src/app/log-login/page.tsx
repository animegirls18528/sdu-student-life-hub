"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LogLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setError("");
      setSuccess(true);
      router.push("/dashboard/logs");
    } else {
      setSuccess(false);
      setError("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-[#081028] flex items-center justify-center">
      <div className="bg-[#111D36] rounded-2xl p-10 shadow-2xl border border-[#1e3050] w-full max-w-sm flex flex-col items-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1294A6]/20 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-[#1294A6]" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); setSuccess(false); }}
              autoComplete="off"
              readOnly
              onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
              placeholder="Username"
              className="w-full px-4 py-3 bg-[#081028] border border-[#1E3A8A] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#1294A6] transition-colors text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400">รหัสผ่าน</label>
            {/* Honeypot: หลอก browser autofill */}
            <input type="password" name="fake_password" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} readOnly />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); setSuccess(false); }}
              placeholder="Password"
              autoComplete="new-password"
              readOnly
              onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
              className="w-full px-4 py-3 bg-[#081028] border border-[#1E3A8A] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#1294A6] transition-colors text-sm"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="text-emerald-400 text-sm text-center">✅ เข้าสู่ระบบสำเร็จ</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#1294A6] hover:bg-[#0f7a8a] text-white font-semibold rounded-lg transition-colors text-sm"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
