import { getPosts } from "@/app/actions/community";
import CommunityFeed from "./components/CommunityFeed";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "คอมมูนิตี้ - SDU Student Life Hub",
};

export default async function CommunityPage() {
  const { success, posts, currentUser, error } = await getPosts();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-3xl"></div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
               <MessageSquare className="w-6 h-6" />
            </div>
            คอมมูนิตี้ (SDU Social)
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">พื้นที่สำหรับพูดคุย แลกเปลี่ยนข่าวสาร แชร์ไอเดีย และสอบถามข้อมูลต่างๆ</p>
        </div>

      </div>

      {!success && (
        <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-medium flex items-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
            !
          </div>
          {error || "ไม่สามารถโหลดข้อมูลโพสต์ได้"}
        </div>
      )}

      {success && (
        <CommunityFeed 
          initialPosts={posts || []} 
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
