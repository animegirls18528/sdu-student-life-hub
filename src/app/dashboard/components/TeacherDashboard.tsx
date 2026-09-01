import { 
  Calendar, BookOpen, CheckSquare, Activity, Users, 
  Filter, FileText, Package, User, PenTool, MessageCircle, Presentation
} from "lucide-react";
import { AttendanceChart, ActivityDonutChart } from "./DashboardCharts";
import { EnhancedStatCard, RecentActivityRow, NotificationItem, QuickAction } from "./DashboardShared";

export default function TeacherDashboard({ session }: { session: any }) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">ภาพรวมการสอน</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">สรุปข้อมูลสถิติและภาระงานสอนของคุณ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
            <span>ภาคเรียน 1/2569</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-all">
            <Filter className="w-4 h-4" /> กรองข้อมูล
          </button>
        </div>
      </div>

      {/* 4 Stat Cards for Teacher */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatCard 
          title="นักศึกษาในการดูแล" 
          value="142 คน" 
          trend="+5%" 
          trendType="up" 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <EnhancedStatCard 
          title="วิชาที่สอน" 
          value="3 วิชา" 
          trend="คงที่" 
          trendType="up" 
          icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <EnhancedStatCard 
          title="อัตราการเข้าเรียนเฉลี่ย" 
          value="89%" 
          trend="+2.1%" 
          trendType="up" 
          icon={<Activity className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <EnhancedStatCard 
          title="จำนวนคาบสอนสัปดาห์นี้" 
          value="12 ชม." 
          trend="-2 ชม." 
          trendType="down" 
          icon={<CheckSquare className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">สถิติการเข้าเรียนของนักศึกษาในรายวิชา</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-zinc-500">เข้าเรียน</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-zinc-500">ขาดเรียน</span>
              </div>
            </div>
          </div>
          {/* Reusing existing chart for now, but contextualized differently */}
          <AttendanceChart />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">สัดส่วนเกรดโดยประมาณ</h2>
          <div className="relative">
            <ActivityDonutChart />
          </div>
        </div>
      </div>

      {/* Recent Activities Table for Teacher */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">ตารางสอน / ภาระงานล่าสุด</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">ดูทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">วันที่ / เวลา</th>
                <th className="px-8 py-4">รายวิชา</th>
                <th className="px-8 py-4">ห้องเรียน</th>
                <th className="px-8 py-4">นักศึกษา</th>
                <th className="px-8 py-4">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              <RecentActivityRow date="วันนี้, 09:00 - 12:00" title="การเขียนโปรแกรมเชิงวัตถุ" type="ห้อง 243" value="45 คน" status="สำเร็จ" />
              <RecentActivityRow date="วันนี้, 13:00 - 16:00" title="ฐานข้อมูลขั้นสูง" type="ห้อง 244" value="40 คน" status="รอดำเนินการ" />
              <RecentActivityRow date="พรุ่งนี้, 09:00 - 12:00" title="โครงสร้างข้อมูล" type="ห้อง 243" value="38 คน" status="รอดำเนินการ" />
              <RecentActivityRow date="3 ส.ค., 09:00 - 12:00" title="สัมมนาวิทยาการคอมพิวเตอร์" type="ห้อง Meeting 1" value="20 คน" status="ยกเลิก" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3 Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Notifications / To-do */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
            คำร้อง / การแจ้งเตือน
          </h2>
          <div className="space-y-4">
            <NotificationItem icon={<FileText className="w-4 h-4 text-orange-500" />} text="คำร้องขอลาป่วย 3 รายการ" time="15 นาทีที่แล้ว" />
            <NotificationItem icon={<MessageCircle className="w-4 h-4 text-blue-500" />} text="นักศึกษาส่งงาน 12 คนในวิชา OOP" time="2 ชั่วโมงที่แล้ว" />
            <NotificationItem icon={<Presentation className="w-4 h-4 text-purple-500" />} text="การประชุมภาควิชาประจำเดือน" time="พรุ่งนี้ 13:00 น." />
          </div>
          <button className="w-full mt-6 text-sm font-bold text-blue-600 hover:underline flex items-center justify-center">ดูทั้งหมด</button>
        </div>

        {/* Quick Actions Grid for Teacher */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">การจัดการด่วน</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Users className="w-6 h-6" />} label="เช็คชื่อ" />
            <QuickAction icon={<PenTool className="w-6 h-6" />} label="จัดการคะแนน" />
            <QuickAction icon={<MessageCircle className="w-6 h-6" />} label="ประกาศแจ้งเตือน" />
            <QuickAction icon={<Package className="w-6 h-6" />} label="จองอุปกรณ์สอน" />
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">ข้อมูลบัญชีอาจารย์</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{session?.name || "อาจารย์ผู้สอน"}</p>
              <p className="text-sm text-zinc-500">อาจารย์ประจำภาควิชา</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">คณะ</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">วิทยาศาสตร์</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">ภาควิชา</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">วิทยาการคอมพิวเตอร์</span>
            </div>
          </div>
          <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all">
            แก้ไขโปรไฟล์
          </button>
        </div>
      </div>
    </div>
  );
}
