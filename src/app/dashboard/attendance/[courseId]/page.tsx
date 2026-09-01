"use client";

import { useState, useEffect, use } from "react";
import { getCourseAttendance, checkIn, markStudentAttendance } from "@/app/actions/attendance";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, MapPin, CheckCircle, Loader2, Calendar, Users } from "lucide-react";

export default function CourseAttendancePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [role, setRole] = useState<string>("STUDENT");
  const [attendances, setAttendances] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markingState, setMarkingState] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function loadData() {
    setLoading(true);
    const res = await getCourseAttendance(courseId);
    if (res.success) {
      setCourse(res.course);
      setRole(res.role || "STUDENT");
      setAttendances(res.attendances || []);
      setEnrollments(res.enrollments || []);
    } else {
      setError(res.error || "Failed to load course details");
    }
    setLoading(false);
  }

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError(null);
    const res = await checkIn(courseId);
    if (res.success) {
      // Reload to see new data
      await loadData();
    } else {
      setError(res.error || "Failed to check in");
    }
    setCheckingIn(false);
  };

  const handleMarkAttendance = async (studentId: string, status: string) => {
    setMarkingState(prev => ({ ...prev, [studentId]: true }));
    const res = await markStudentAttendance(courseId, studentId, selectedDate, status);
    if (res.success) {
      // Update local state without reloading everything
      setAttendances(prev => {
        const existing = prev.find(a => a.userId === studentId && a.date === selectedDate);
        if (existing) {
          return prev.map(a => a.id === existing.id ? { ...a, status } : a);
        } else {
          return [...prev, { id: 'temp-'+Date.now(), userId: studentId, courseId, date: selectedDate, status, createdAt: new Date().toISOString() }];
        }
      });
    } else {
      alert(res.error || "Failed to mark attendance");
    }
    setMarkingState(prev => ({ ...prev, [studentId]: false }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">มาเรียน</span>;
      case "LATE":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">สาย</span>;
      case "ABSENT":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">ขาดเรียน</span>;
      case "EXCUSED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">ลา</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">{status}</span>;
    }
  };

  // For Student view
  const todayStr = new Date().toISOString().split('T')[0];
  const studentHasCheckedInToday = role === "STUDENT" ? attendances.some(a => a.date === todayStr) : false;

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-zinc-500">{error || "ไม่พบข้อมูลรายวิชา"}</p>
        <Link href="/dashboard/attendance" className="text-blue-600 hover:underline">กลับไปหน้าเช็คชื่อเข้าเรียน</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/attendance" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm">
                {course.code}
              </span>
              <h1 className="text-2xl font-bold text-zinc-900">{course.name}</h1>
            </div>
            <p className="text-zinc-500 flex items-center">
               <BookOpen className="w-4 h-4 mr-2" /> ผู้สอน: {course.instructor}
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
             {error && (
               <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                 {error}
               </div>
             )}
             
             {role === "STUDENT" && (
               studentHasCheckedInToday ? (
                 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-center font-medium shadow-sm">
                   <CheckCircle className="w-5 h-5 mr-2" />
                   เช็คชื่อวันนี้แล้ว
                 </div>
               ) : (
                 <button
                   onClick={handleCheckIn}
                   disabled={checkingIn}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {checkingIn ? (
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> กำลังบันทึก...</>
                   ) : (
                     <><CheckCircle className="w-5 h-5 mr-2" /> เช็คชื่อเข้าเรียนวันนี้</>
                   )}
                 </button>
               )
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <div className="flex items-center text-zinc-700 font-medium">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 border border-zinc-200 shadow-sm">
               <Clock className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-normal">ตารางเรียน</div>
              {course.schedule}
            </div>
          </div>
          <div className="flex items-center text-zinc-700 font-medium">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 border border-zinc-200 shadow-sm">
               <MapPin className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-normal">ห้องเรียน</div>
              {course.room}
            </div>
          </div>
        </div>

        {role === "STUDENT" ? (
          <>
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
               <Calendar className="w-5 h-5 mr-2 text-zinc-400" />
               ประวัติการเข้าเรียน
            </h2>
            
            {attendances.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-500">
                ยังไม่มีประวัติการเช็คชื่อในรายวิชานี้
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                      <th className="py-3 px-4 font-medium">วันที่</th>
                      <th className="py-3 px-4 font-medium">สถานะ</th>
                      <th className="py-3 px-4 font-medium">เวลาที่บันทึก</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((record) => (
                      <tr key={record.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="py-3 px-4 text-zinc-900 font-medium">
                          {new Date(record.date).toLocaleDateString("th-TH", {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 text-sm">
                          {new Date(record.createdAt).toLocaleTimeString("th-TH", {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} น.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center">
                 <Users className="w-5 h-5 mr-2 text-zinc-400" />
                 รายชื่อนักศึกษา และการเช็คชื่อ
              </h2>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">เลือกวันที่</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {enrollments.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-500">
                ยังไม่มีนักศึกษาลงทะเบียนในรายวิชานี้
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                      <th className="py-3 px-4 font-medium">รหัสนักศึกษา</th>
                      <th className="py-3 px-4 font-medium">ชื่อ-นามสกุล</th>
                      <th className="py-3 px-4 font-medium">สถานะ ({new Date(selectedDate).toLocaleDateString("th-TH", { day: 'numeric', month: 'short' })})</th>
                      <th className="py-3 px-4 font-medium text-center">อัปเดต</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => {
                      const student = enrollment.user;
                      const attendanceRecord = attendances.find(a => a.userId === student.id && a.date === selectedDate);
                      const currentStatus = attendanceRecord ? attendanceRecord.status : null;
                      const isMarking = markingState[student.id];

                      return (
                        <tr key={student.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                          <td className="py-3 px-4 text-zinc-600 font-mono text-sm">
                            {student.studentId || "-"}
                          </td>
                          <td className="py-3 px-4 text-zinc-900 font-medium">
                            {student.name}
                          </td>
                          <td className="py-3 px-4">
                            {currentStatus ? getStatusBadge(currentStatus) : <span className="text-xs text-zinc-400 font-medium px-2 py-1 bg-zinc-100 rounded-lg">ยังไม่เช็คชื่อ</span>}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-1">
                              <button 
                                onClick={() => handleMarkAttendance(student.id, "PRESENT")}
                                disabled={isMarking || currentStatus === "PRESENT"}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${currentStatus === "PRESENT" ? "bg-green-100 text-green-700 opacity-50 cursor-not-allowed" : "bg-zinc-100 hover:bg-green-50 hover:text-green-700 text-zinc-600"}`}
                              >
                                มาเรียน
                              </button>
                              <button 
                                onClick={() => handleMarkAttendance(student.id, "LATE")}
                                disabled={isMarking || currentStatus === "LATE"}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${currentStatus === "LATE" ? "bg-yellow-100 text-yellow-700 opacity-50 cursor-not-allowed" : "bg-zinc-100 hover:bg-yellow-50 hover:text-yellow-700 text-zinc-600"}`}
                              >
                                สาย
                              </button>
                              <button 
                                onClick={() => handleMarkAttendance(student.id, "ABSENT")}
                                disabled={isMarking || currentStatus === "ABSENT"}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${currentStatus === "ABSENT" ? "bg-red-100 text-red-700 opacity-50 cursor-not-allowed" : "bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-600"}`}
                              >
                                ขาด
                              </button>
                              <button 
                                onClick={() => handleMarkAttendance(student.id, "EXCUSED")}
                                disabled={isMarking || currentStatus === "EXCUSED"}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${currentStatus === "EXCUSED" ? "bg-blue-100 text-blue-700 opacity-50 cursor-not-allowed" : "bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 text-zinc-600"}`}
                              >
                                ลา
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
