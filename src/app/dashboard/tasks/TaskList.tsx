"use client";

import { useState, useTransition } from "react";
import { CheckSquare, Plus, Trash2, Tag, Edit2 } from "lucide-react";
import { addTask, toggleTask, deleteTask, updateTask } from "@/app/actions/tasks";

interface Task {
  id: string;
  label: string;
  description?: string | null;
  priority: string;
  category: string;
  completed: boolean;
}

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const formData = new FormData();
    formData.append("label", newTask);
    formData.append("description", description);

    if (editingTask) {
      startTransition(async () => {
        await updateTask(editingTask.id, formData);
        setEditingTask(null);
        setNewTask("");
        setDescription("");
        setShowForm(false);
      });
    } else {
      setNewTask("");
      setDescription("");
      setShowForm(false);
      startTransition(async () => {
        await addTask(formData);
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.label);
    setDescription(task.description || "");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setNewTask("");
    setDescription("");
  };

  const handleToggle = (id: string, completed: boolean) => {
    startTransition(async () => {
      await toggleTask(id, !completed);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTask(id);
    });
  };

  return (
    <div className="space-y-8">
      {/* Add Task Form Button or Form */}
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-600 dark:text-zinc-400 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          เพิ่มรายการสิ่งที่ต้องทำใหม่
        </button>
      ) : (
        <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-900 dark:border-zinc-100 shadow-xl space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{editingTask ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</h2>
            <button 
              type="button" 
              onClick={handleCancel}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ยกเลิก
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">ชื่อเรื่อง</label>
              <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="เช่น ส่งงานวิชา Software Engineering..." 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all font-medium text-zinc-900 dark:text-zinc-100"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">รายละเอียดงานนั้นๆ</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all min-h-[120px] resize-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              disabled={isPending || !newTask.trim()}
              className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-white transition-all shadow-lg shadow-zinc-200 dark:shadow-none disabled:opacity-50"
            >
              {isPending ? "กำลังบันทึก..." : editingTask ? "บันทึกการแก้ไข" : "บันทึกรายการ"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {initialTasks.map((task) => (
          <div 
            key={task.id} 
            className={`bg-white dark:bg-zinc-900 rounded-3xl border transition-all p-6 flex items-start gap-6 group ${
              task.completed 
                ? "border-zinc-50 dark:border-zinc-800 opacity-60" 
                : "border-zinc-100 dark:border-zinc-800 shadow-sm hover:border-zinc-900 dark:hover:border-zinc-100"
            }`}
          >
            <button 
              onClick={() => handleToggle(task.id, task.completed)}
              disabled={isPending}
              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all mt-1 shrink-0 ${
                task.completed 
                  ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900" 
                  : "border-zinc-200 dark:border-zinc-700 text-transparent hover:border-zinc-900 dark:hover:border-zinc-100"
              }`}
            >
              <CheckSquare className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <span className={`text-lg font-bold block transition-all ${task.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {task.label}
              </span>
              {task.description && (
                <p className={`mt-1 text-sm leading-relaxed ${task.completed ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{task.category}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  task.priority === 'ด่วน' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
              <button 
                onClick={() => handleEdit(task)}
                disabled={isPending}
                className="p-3 text-zinc-300 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                title="แก้ไข"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(task.id)}
                disabled={isPending}
                className="p-3 text-zinc-300 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                title="ลบ"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {initialTasks.length === 0 && !isPending && (
          <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 italic">
            ยังไม่มีรายการสิ่งที่ต้องทำ เพิ่มรายการใหม่ได้จากช่องด้านบน
          </div>
        )}
      </div>
    </div>
  );
}
