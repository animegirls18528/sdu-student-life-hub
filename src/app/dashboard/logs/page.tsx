import { prisma } from "@/lib/prisma";
import LogList from "./components/LogList";

export default async function LogsPage() {
  const loginLogs = await prisma.loginLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          บันทึกการใช้งานระบบ (System Logs)
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          แสดงประวัติการเข้าสู่ระบบ และการดำเนินการต่างๆ เช่น การจองห้อง ยืมอุปกรณ์ เช็คชื่อ
        </p>
      </div>

      <LogList loginLogs={loginLogs} auditLogs={auditLogs} />
    </div>
  );
}
