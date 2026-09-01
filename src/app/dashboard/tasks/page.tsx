import { getTasks } from "@/app/actions/tasks";
import TaskList from "./TaskList";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">รายการสิ่งที่ต้องทำ</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">จัดการภาระงานและการบ้านของคุณให้เป็นระบบ</p>
      </div>

      <TaskList initialTasks={tasks} />
    </div>
  );
}
