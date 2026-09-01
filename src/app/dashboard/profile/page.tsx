import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./components/ProfileForm";

export const metadata = {
  title: "จัดการโปรไฟล์ - SDU Student Life Hub",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">จัดการโปรไฟล์</h1>
        <p className="text-zinc-500 mt-1">แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของคุณ</p>
      </div>

      <ProfileForm 
        initialData={{
          name: user.name,
          email: user.email,
          studentId: user.studentId || "",
          role: user.role,
          imageUrl: user.imageUrl || "",
        }} 
      />
    </div>
  );
}
