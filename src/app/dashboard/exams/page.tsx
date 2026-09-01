import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";

const exams = [
  { date: "15 ต.ค. 2026", time: "09:00 - 12:00", subject: "การพัฒนาเว็บ (กลางภาค)", room: "ห้องประชุมใหญ่ 1", seat: "A-12", status: "กำลังจะมาถึง" },
  { date: "18 ต.ค. 2026", time: "13:00 - 16:00", subject: "ระบบฐานข้อมูล (กลางภาค)", room: "ห้อง 401", seat: "B-05", status: "กำลังจะมาถึง" },
  { date: "20 ต.ค. 2026", time: "09:00 - 11:00", subject: "ภาษาอังกฤษ (กลางภาค)", room: "ห้อง 502", seat: "C-22", status: "กำลังจะมาถึง" },
  { date: "22 ต.ค. 2026", time: "13:00 - 16:00", subject: "วิศวกรรมซอฟต์แวร์ (กลางภาค)", room: "ห้อง 401", seat: "D-01", status: "กำลังจะมาถึง" },
  { date: "25 ต.ค. 2026", time: "09:00 - 12:00", subject: "โครงสร้างข้อมูล (กลางภาค)", room: "ห้องประชุมใหญ่ 2", seat: "E-15", status: "กำลังจะมาถึง" },
];

export default function ExamsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">ตารางสอบ</h1>
        <p className="text-zinc-500 mt-1">ตรวจสอบวัน เวลา และห้องสอบสำหรับการสอบที่กำลังจะมาถึง</p>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900">ข้อควรระวัง</h3>
          <p className="text-sm text-blue-600/80 mt-1 leading-relaxed">
            กรุณาเตรียมบัตรประจำตัวนักศึกษา และมาถึงห้องสอบก่อนเวลาอย่างน้อย 15 นาที หากไม่มีบัตรนักศึกษาจะไม่ได้รับอนุญาตให้เข้าห้องสอบ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {exams.map((exam, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm hover:border-zinc-900 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex items-center gap-4 shrink-0 md:w-48">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">วันที่</div>
                  <div className="font-bold text-zinc-900">{exam.date}</div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-xl text-zinc-900">{exam.subject}</h3>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{exam.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 font-bold">
                    <span className="text-xs text-zinc-400 uppercase">เลขที่นั่ง:</span>
                    <span className="text-sm text-zinc-900">{exam.seat}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className="px-6 py-2 rounded-xl text-sm font-bold bg-zinc-900 text-white shadow-lg shadow-zinc-100">
                  {exam.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
