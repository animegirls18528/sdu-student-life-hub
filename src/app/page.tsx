import Link from "next/link";
import { 
  ArrowRight, Hexagon, Calendar, MapPin, Monitor, PartyPopper, 
  ShieldCheck, Zap, Star, MessageSquare, Phone, Mail, 
  Send, LayoutDashboard, Clock, CheckCircle2, Heart, Users, Globe
} from "lucide-react";
import { getSession } from "@/lib/auth";

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

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 text-blue-600">
              <Hexagon className="w-full h-full fill-current" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">SDU Hub</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-blue-600">หน้าแรก</Link>
            <Link href="#services" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">บริการ</Link>
            <Link href="#about" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">เกี่ยวกับเรา</Link>
            <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">บล็อก</Link>
            <Link href="#contact" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">ติดต่อเรา</Link>
          </div>

          <div>
            {session ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2"
              >
                ไปที่แดชบอร์ด <LayoutDashboard className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                <Zap className="w-3 h-3" /> ยกระดับชีวิตนักศึกษา
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-zinc-100 leading-[1.1]">
                ยกระดับชีวิตนักศึกษา <br />
                <span className="text-blue-600">สวนดุสิต</span> ให้ง่ายขึ้น
              </h1>
              <p className="text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                จัดการตารางเรียน จองห้อง ยืมอุปกรณ์ และติดตามกิจกรรมทุกอย่างได้ในที่เดียว 
                ออกแบบมาเพื่อนักศึกษามหาวิทยาลัยสวนดุสิตโดยเฉพาะ
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href={session ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3 group"
                >
                  {session ? "ไปที่แดชบอร์ด" : "เริ่มต้นใช้งานเลย"} 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#about"
                  className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center"
                >
                  ทำความรู้จักเรา
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Users className="w-5 h-5" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-black text-zinc-900 dark:text-zinc-100">นักศึกษา 5,000+ ราย</p>
                  <p className="text-zinc-500">ไว้วางใจใช้งานระบบของเรา</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                      <div className="h-40 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                         <Calendar className="w-12 h-12" />
                      </div>
                      <div className="h-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                         <CheckCircle2 className="w-10 h-10" />
                      </div>
                   </div>
                   <div className="space-y-4 pt-8">
                      <div className="h-32 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                         <MapPin className="w-10 h-10" />
                      </div>
                      <div className="h-40 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
                         <Monitor className="w-12 h-12" />
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">ประสิทธิภาพ</p>
                      <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">+95% เร็วขึ้น</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">บริการแนะนำ</h2>
            <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-100">ทุกบริการที่คุณต้องการในที่เดียว</h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              เราได้รวบรวมฟังก์ชันที่จำเป็นสำหรับการใช้ชีวิตในมหาวิทยาลัยมาไว้ให้คุณแล้ว
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon={<Calendar className="w-8 h-8" />} 
              title="ตารางเรียน" 
              desc="เช็คตารางเรียนรายสัปดาห์และห้องเรียนได้ทันที"
              link="/dashboard/schedule"
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <ServiceCard 
              icon={<MapPin className="w-8 h-8" />} 
              title="จองห้อง" 
              desc="จองห้องประชุมหรือห้องอ่านหนังสือออนไลน์"
              link="/dashboard/rooms"
              color="text-purple-600"
              bg="bg-purple-50"
            />
            <ServiceCard 
              icon={<Monitor className="w-8 h-8" />} 
              title="ยืมอุปกรณ์" 
              desc="ยืมแล็ปท็อปและอุปกรณ์เสริมสำหรับการเรียน"
              link="/dashboard/equipment"
              color="text-orange-600"
              bg="bg-orange-50"
            />
            <ServiceCard 
              icon={<PartyPopper className="w-8 h-8" />} 
              title="ลงทะเบียนกิจกรรม" 
              desc="ติดตามและลงทะเบียนกิจกรรมสะสมชั่วโมง"
              link="/dashboard/activities"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <div className="relative">
               <div className="absolute -inset-4 bg-blue-100/50 dark:bg-blue-900/20 blur-2xl rounded-[3rem]"></div>
               <div className="relative bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 p-12 overflow-hidden">
                  <h3 className="text-3xl font-black mb-8">ทำไมต้องใช้ SDU Hub?</h3>
                  <div className="space-y-8">
                    <BenefitItem 
                      icon={<Zap className="w-6 h-6" />} 
                      title="ใช้งานง่าย" 
                      desc="อินเทอร์เฟซที่สะอาดตา ออกแบบมาเพื่อประสบการณ์การใช้งานที่ดีที่สุด"
                    />
                    <BenefitItem 
                      icon={<ShieldCheck className="w-6 h-6" />} 
                      title="ปลอดภัย" 
                      desc="ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัยด้วยมาตรฐานสูงสุด"
                    />
                    <BenefitItem 
                      icon={<Clock className="w-6 h-6" />} 
                      title="รวดเร็ว" 
                      desc="เข้าถึงข้อมูลและบริการต่างๆ ได้ในไม่กี่วินาที"
                    />
                    <BenefitItem 
                      icon={<Heart className="w-6 h-6" />} 
                      title="คุ้มค่า" 
                      desc="รวมทุกอย่างไว้ในที่เดียว ประหยัดเวลาและพลังงานของคุณ"
                    />
                  </div>
               </div>
            </div>
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                จุดเด่นที่ทำให้เรา <br />
                <span className="text-blue-600">แตกต่างจากคนอื่น</span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                เราเข้าใจความต้องการของนักศึกษา เพราะเราคือทีมพัฒนาที่เป็นนักศึกษาเหมือนกัน 
                ทุกฟังก์ชันจึงถูกสร้างขึ้นเพื่อแก้ปัญหาจริงที่ทุกคนต้องเจอ
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 font-bold text-sm">
                    ✨ อัปเดตข้อมูลแบบ Real-time
                 </div>
                 <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 font-bold text-sm">
                    📱 รองรับทุกอุปกรณ์
                 </div>
                 <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 font-bold text-sm">
                    🔒 ความเป็นส่วนตัวสูง
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Trust Signals */}
      <section id="about" className="py-20 bg-blue-600 text-white overflow-hidden relative scroll-mt-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-lg font-bold mb-12 opacity-80">นักศึกษาไว้วางใจมากกว่า 5,000+ ราย จากทุกคณะ</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
             <div className="flex flex-col items-center gap-2">
                <div className="flex text-yellow-400">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
                </div>
                <p className="font-black text-2xl">4.9 / 5.0</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-70">คะแนนความพึงพอใจ</p>
             </div>
             <div className="w-px h-20 bg-white/20 hidden md:block"></div>
             <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-black tracking-tighter">10,000+</p>
                <p className="text-lg font-bold">การจองต่อเดือน</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-70">ห้องและอุปกรณ์</p>
             </div>
             <div className="w-px h-20 bg-white/20 hidden md:block"></div>
             <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-black tracking-tighter">100%</p>
                <p className="text-lg font-bold">ความปลอดภัย</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-70">การันตีข้อมูล</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-zinc-900 text-zinc-100 pt-24 pb-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 text-blue-500">
                  <Hexagon className="w-full h-full fill-current" strokeWidth={1.5} />
                </div>
                <span className="text-xl font-black tracking-tight uppercase">SDU Hub</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                แพลตฟอร์มที่รวมทุกบริการสำหรับนักศึกษามหาวิทยาลัยสวนดุสิต 
                ช่วยให้ชีวิตในมหาวิทยาลัยเป็นเรื่องง่ายและมีประสิทธิภาพ
              </p>
              <div className="flex gap-4">
                 <SocialIcon icon={<MessageSquare className="w-5 h-5" />} />
                 <SocialIcon icon={<Globe className="w-5 h-5" />} />
              </div>
            </div>

            <div className="space-y-8">
               <h4 className="text-lg font-bold">เกี่ยวกับเรา</h4>
               <ul className="space-y-4">
                 <FooterLink href="#about">ทีมพัฒนา</FooterLink>
                 <FooterLink href="#">วิสัยทัศน์</FooterLink>
                 <FooterLink href="#">ร่วมงานกับเรา</FooterLink>
                 <FooterLink href="#">ข่าวสาร</FooterLink>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-lg font-bold">บริการ</h4>
               <ul className="space-y-4">
                 <FooterLink href="/dashboard/schedule">ตารางเรียน</FooterLink>
                 <FooterLink href="/dashboard/rooms">จองห้อง</FooterLink>
                 <FooterLink href="/dashboard/equipment">ยืมอุปกรณ์</FooterLink>
                 <FooterLink href="/dashboard/activities">กิจกรรม</FooterLink>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-lg font-bold">ติดตามข่าวสาร</h4>
               <p className="text-sm text-zinc-400">สมัครรับข่าวสารและโปรโมชั่นใหม่ๆ ส่งตรงถึงอีเมลคุณ</p>
               <form className="relative">
                 <input 
                  type="email" 
                  placeholder="อีเมลของคุณ" 
                  className="w-full bg-zinc-800 border-none rounded-xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                 />
                 <button className="absolute right-2 top-2 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4 text-white" />
                 </button>
               </form>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-zinc-500">© 2026 SDU Student Life Hub. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-zinc-500 font-bold">
               <Link href="#" className="hover:text-blue-500 transition-colors">นโยบายความเป็นส่วนตัว</Link>
               <Link href="#" className="hover:text-blue-500 transition-colors">ข้อกำหนดการใช้งาน</Link>
               <Link href="#" className="hover:text-blue-500 transition-colors">คุกกี้</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, desc, link, color, bg }: any) {
  return (
    <Link href={link} className="group block bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-none">
      <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-black mb-3 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest gap-2">
         เรียนรู้เพิ่มเติม <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function BenefitItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-lg">{title}</h4>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SocialIcon({ icon }: any) {
  return (
    <Link href="#" className="w-10 h-10 bg-zinc-800 hover:bg-blue-600 text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition-all">
      {icon}
    </Link>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <li>
      <Link href={href} className="text-zinc-400 hover:text-blue-500 font-bold transition-colors">
        {children}
      </Link>
    </li>
  );
}
