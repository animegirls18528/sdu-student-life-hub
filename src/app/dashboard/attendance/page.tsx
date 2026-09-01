import { getMyCourses } from "@/app/actions/attendance";
import Link from "next/link";
import { BookOpen, MapPin, Clock, ArrowRight, UserCheck } from "lucide-react";

export const metadata = {
  title: "เช็คชื่อเข้าเรียน - SDU Student Life Hub",
};

export default async function AttendancePage() {
  const { success, courses, error } = await getMyCourses();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">เช็คชื่อเข้าเรียน (Attendance)</h1>
        <p className="text-zinc-500 mt-1">ตรวจสอบตารางเรียนของคุณและทำการเช็คชื่อเข้าเรียนในแต่ละรายวิชา</p>
      </div>

      {!success && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error || "ไม่สามารถโหลดข้อมูลรายวิชาได้"}
        </div>
      )}

      {success && courses && courses.length === 0 && (
        <div className="text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-100">
          ไม่พบรายวิชาที่คุณลงทะเบียนเรียนในขณะนี้
        </div>
      )}

      {success && courses && courses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col hover:border-zinc-200 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">{course.name}</h3>
                  <p className="text-zinc-500 text-sm">{course.instructor}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-zinc-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-zinc-600">
                  <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                  {course.schedule}
                </div>
                <div className="flex items-center text-sm text-zinc-600">
                  <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                  {course.room}
                </div>
              </div>

              {/* Attendance Progress */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-medium text-zinc-700">สถิติการเข้าเรียน</div>
                  <div className="text-lg font-bold text-zinc-900">{course.stats.attendanceRate}%</div>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${course.stats.attendanceRate >= 80 ? 'bg-green-500' : course.stats.attendanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${course.stats.attendanceRate}%` }}
                  ></div>
                </div>
                <div className="flex text-xs text-zinc-500 justify-between">
                  <span>มาเรียน {course.stats.presentCount} ครั้ง</span>
                  <span>ขาด {course.stats.absentCount} ครั้ง</span>
                  <span>ทั้งหมด {course.stats.totalClasses} ครั้ง</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-100">
                <Link 
                  href={`/dashboard/attendance/${course.id}`}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-center font-medium transition-colors flex items-center justify-center group"
                >
                  <UserCheck className="w-4 h-4 mr-2 group-hover:text-white" /> เช็คชื่อ / ดูประวัติ
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
