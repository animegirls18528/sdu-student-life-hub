import { getSession } from "@/lib/auth";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

export default async function DashboardPage() {
  const session = await getSession();

  // For Admin and Super Admin, we can default to Teacher view for now, 
  // or create an AdminDashboard in the future.
  if (session?.role === "TEACHER" || session?.role === "ADMIN" || session?.role === "SUPER_ADMIN") {
    return (
      <div className="max-w-7xl mx-auto">
        <TeacherDashboard session={session} />
      </div>
    );
  }

  // Default fallback is Student
  return (
    <div className="max-w-7xl mx-auto">
      <StudentDashboard session={session} />
    </div>
  );
}
