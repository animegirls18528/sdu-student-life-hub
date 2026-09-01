import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Bell, Info, User } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import SidebarNav from "./components/SidebarNav";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackgroundProvider } from "@/components/background-provider";
import { BackgroundCustomizer } from "@/components/background-customizer";

export const metadata: Metadata = {
  title: "Dashboard - SDU Student Life Hub",
  description: "แอปเดียวจบสำหรับชีวิตนักศึกษา",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <BackgroundProvider>
      <div className="flex h-screen text-foreground relative overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-black border-r border-zinc-100 dark:border-zinc-800 hidden md:flex flex-col z-20">
          <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800 gap-2.5 bg-white dark:bg-black">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              SDU Life Hub
            </span>
          </div>
          <SidebarNav role={session.role} />
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
            <div className="flex items-center justify-between">
              <Link href="/dashboard/profile" className="flex items-center space-x-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 p-2 rounded-xl transition-colors cursor-pointer flex-1 mr-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm shadow-blue-200 dark:shadow-none overflow-hidden relative">
                  {session.imageUrl ? (
                    <img src={session.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    session.name?.[0] || "S"
                  )}
                </div>
                <div className="text-xs truncate max-w-[110px]">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{session.name || "นักศึกษา"}</p>
                  <p className="text-zinc-400 dark:text-zinc-500 truncate">
                    {session.email}
                  </p>
                </div>
              </Link>
              <form action={logoutAction}>
                <button 
                  type="submit"
                  suppressHydrationWarning
                  className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-10">
          <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800 relative z-50">
            <div className="flex items-center md:hidden">
               <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">SDU Hub</span>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
              <BackgroundCustomizer />
              <ThemeToggle />
              <Link 
                href="/dashboard/profile"
                className="p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 relative group transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                title="จัดการโปรไฟล์"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center relative">
                  {session.imageUrl ? (
                    <img src={session.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
              </Link>
              <Link 
                href="/dashboard/about"
                className="px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium transition-all border border-zinc-100 dark:border-zinc-800 hidden sm:block"
              >
                 About us
              </Link>
              <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 relative group transition-all">
                 <Bell className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </BackgroundProvider>
  );
}
