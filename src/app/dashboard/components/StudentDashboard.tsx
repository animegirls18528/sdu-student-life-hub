import { 
  Calendar, BookOpen, CheckSquare, Activity, Users, 
  Filter, FileText, Package, User
} from "lucide-react";
import { AttendanceChart, ActivityDonutChart } from "./DashboardCharts";
import { EnhancedStatCard, RecentActivityRow, NotificationItem, QuickAction } from "./DashboardShared";

export default function StudentDashboard({ session }: { session: any }) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">ภาพรวม</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">สรุปภาพรวมการเรียนและกิจกรรมของคุณ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
            <span>01 มิ.ย. 2569 - 31 มิ.ย. 2569</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-all">
            <Filter className="w-4 h-4" /> กรองข้อมูล
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatCard 
          title="ชั่วโมงกิจกรรมรวม" 
          value="85.5 ชม." 
          trend="+12.5%" 
          trendType="up" 
          icon={<Activity className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <EnhancedStatCard 
          title="คะแนนเฉลี่ย (GPA)" 
          value="3.85" 
          trend="+8.7%" 
          trendType="up" 
          icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <EnhancedStatCard 
          title="การเข้าเรียน" 
          value="94%" 
          trend="+15.3%" 
          trendType="up" 
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <EnhancedStatCard 
          title="งานที่ส่งแล้ว" 
          value="18/20" 
          trend="-2.1%" 
          trendType="down" 
          icon={<CheckSquare className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">สถิติการเรียนและเข้าเรียน</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-zinc-500">เข้าเรียน</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-zinc-500">ผลการเรียน</span>
              </div>
            </div>
          </div>
          <AttendanceChart />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">สัดส่วนกิจกรรม</h2>
          <div className="relative">
            <ActivityDonutChart />
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">รายการล่าสุด</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">ดูทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">วันที่</th>
                <th className="px-8 py-4">รายการ</th>
                <th className="px-8 py-4">ประเภท</th>
                <th className="px-8 py-4">ชั่วโมง/คะแนน</th>
                <th className="px-8 py-4">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              <RecentActivityRow date="31 พ.ค. 2569" title="อบรมทักษะดิจิทัล" type="วิชาการ" value="3.0 ชม." status="สำเร็จ" />
              <RecentActivityRow date="31 พ.ค. 2569" title="จิตอาสาปลูกป่า" type="จิตอาสา" value="5.0 ชม." status="รอดำเนินการ" />
              <RecentActivityRow date="30 พ.ค. 2569" title="สอบ Quiz วิชา Database" type="วิชาการ" value="18/20" status="สำเร็จ" />
              <RecentActivityRow date="30 พ.ค. 2569" title="แข่งกีฬามหาวิทยาลัย" type="กีฬา" value="2.0 ชม." status="ยกเลิก" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3 Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Notifications / To-do */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
            แจ้งเตือน / งานที่ต้องทำ
          </h2>
          <div className="space-y-4">
            <NotificationItem icon={<FileText className="w-4 h-4 text-orange-500" />} text="มีงานรอส่งอีก 12 รายการ" time="10 นาทีที่แล้ว" />
            <NotificationItem icon={<Package className="w-4 h-4 text-yellow-500" />} text="อุปกรณ์ที่ยืมใกล้ครบกำหนด 5 รายการ" time="1 ชั่วโมงที่แล้ว" />
            <NotificationItem icon={<User className="w-4 h-4 text-blue-500" />} text="ประกาศใหม่จากคณะ 8 รายการ" time="2 ชั่วโมงที่แล้ว" />
          </div>
          <button className="w-full mt-6 text-sm font-bold text-blue-600 hover:underline flex items-center justify-center">ดูทั้งหมด</button>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">การจัดการด่วน</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<FileText className="w-6 h-6" />} label="ส่งคำร้อง" />
            <QuickAction icon={<User className="w-6 h-6" />} label="ลงทะเบียน" />
            <QuickAction icon={<Activity className="w-6 h-6" />} label="บันทึกกิจกรรม" />
            <QuickAction icon={<Package className="w-6 h-6" />} label="จองอุปกรณ์" />
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">ข้อมูลบัญชี</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{session?.name || "นักศึกษา"}</p>
              <p className="text-sm text-zinc-500">นักศึกษา</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">คณะ</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">วิทยาศาสตร์</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">วันหมดอายุบัตร</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">31 ธ.ค. 2570</span>
            </div>
          </div>
          <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all">
            จัดการบัญชี
          </button>
        </div>
      </div>
    </div>
  );
}
