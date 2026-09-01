"use client";

import { 
  Phone, Mail, MapPin, Clock, MessageCircle, Send, HelpCircle, Hexagon, User, IdCard
} from "lucide-react";

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

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Team Members Section */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-2">เกี่ยวกับเรา</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">สมาชิกทีมพัฒนา SDU Student Life Hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">นายนิธิศ เลิศรัชต์</h3>
                <p className="text-blue-600 font-semibold text-sm">Full-stack Developer</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-500 text-sm font-medium">
                <IdCard className="w-4 h-4" />
                6811011662001
              </div>
              <div className="flex gap-4 pt-2">
                <FacebookIcon />
                <GoogleIcon />
                <AppleIcon />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">นายปภาวิน วิริยวิชาการ</h3>
                <p className="text-blue-600 font-semibold text-sm">UI/UX Designer</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-500 text-sm font-medium">
                <IdCard className="w-4 h-4" />
                6811011662003
              </div>
              <div className="flex gap-4 pt-2">
                <FacebookIcon />
                <GoogleIcon />
                <AppleIcon />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">นายอนุกูล บุญทา</h3>
                <p className="text-blue-600 font-semibold text-sm">Backend Developer</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-500 text-sm font-medium">
                <IdCard className="w-4 h-4" />
                6811011662004
              </div>
              <div className="flex gap-4 pt-2">
                <FacebookIcon />
                <GoogleIcon />
                <AppleIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Contact Info (Moved from Contact Us) */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-12 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-4">ติดต่อทีมงาน</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            เราพร้อมรับฟังและให้คำปรึกษา ทีมงานของเรายินดีช่วยเหลือนักศึกษาทุกคน
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-center">
           <div className="w-32 h-32 text-blue-100 dark:text-blue-900/30">
              <Hexagon className="w-full h-full fill-current" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">ส่งข้อความถึงเรา</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">ชื่อ-นามสกุล *</label>
                <input 
                  type="text" 
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">อีเมล *</label>
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  placeholder="0xx-xxx-xxxx"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">หัวข้อ *</label>
                <select className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none">
                  <option>สอบถามทั่วไป</option>
                  <option>แจ้งปัญหาการใช้งาน</option>
                  <option>ติดต่อเรื่องกิจกรรม</option>
                  <option>อื่นๆ</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">ข้อความของคุณ *</label>
              <textarea 
                placeholder="พิมพ์ข้อความที่ต้องการติดต่อ..."
                rows={5}
                className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
              />
            </div>
            <button type="button" onClick={() => alert('ส่งข้อความเรียบร้อยแล้ว')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3">
              ส่งข้อความ <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">ช่องทางการติดต่อ</h2>
            <div className="space-y-8">
              <ContactInfoItem 
                icon={<Phone className="w-6 h-6" />} 
                title="โทรศัพท์" 
                value="02-123-4567" 
                color="text-purple-600"
                bg="bg-purple-50"
              />
              <ContactInfoItem 
                icon={<Mail className="w-6 h-6" />} 
                title="อีเมล" 
                value="hello@yourcompany.com" 
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <ContactInfoItem 
                icon={<MapPin className="w-6 h-6" />} 
                title="ที่อยู่" 
                value="123 ถ.นครราชสีมา เขตดุสิต กรุงเทพฯ 10300" 
                color="text-emerald-600"
                bg="bg-emerald-50"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                 <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">FAQ</h2>
                <p className="text-sm text-zinc-500">คำถามที่พบบ่อย</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
              ดูทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, value, color, bg }: any) {
  return (
    <div className="flex items-start gap-6 group">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{value}</p>
      </div>
    </div>
  );
}

