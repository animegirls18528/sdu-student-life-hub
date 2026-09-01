"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight, PartyPopper, Edit } from "lucide-react";

export default function ActivityList({ activities, isAdmin }: { activities: any[], isAdmin: boolean }) {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "VOLUNTEER": return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">จิตอาสา</span>;
      case "SPORT": return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">กีฬา</span>;
      case "ACADEMIC": return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">วิชาการ</span>;
      case "CULTURAL": return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">ศิลปวัฒนธรรม</span>;
      default: return <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs font-semibold">{category}</span>;
    }
  };

  const categories = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "VOLUNTEER", label: "จิตอาสา" },
    { id: "SPORT", label: "กีฬา" },
    { id: "ACADEMIC", label: "วิชาการ" },
    { id: "CULTURAL", label: "ศิลปวัฒนธรรม" },
  ];

  const filteredActivities = activities.filter(activity => 
    filterCategory === "ALL" || activity.category === filterCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterCategory === cat.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          ไม่พบกิจกรรมในหมวดหมู่นี้
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity: any) => {
            const currentRegistrations = activity._count?.registrations || 0;
            const isFull = currentRegistrations >= activity.maxParticipants;

            return (
              <div key={activity.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group flex flex-col">
                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                  {activity.imageUrl ? (
                    <Image 
                      src={activity.imageUrl} 
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                      <PartyPopper className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    {getCategoryBadge(activity.category)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1">{activity.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                    {activity.description || "ไม่มีรายละเอียด"}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" />
                      {new Date(activity.date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })} ({activity.startTime} - {activity.endTime})
                    </div>
                    <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                       <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                         <Users className="w-4 h-4 mr-1 text-zinc-400 dark:text-zinc-500" />
                         รับ {activity.maxParticipants} คน
                       </div>
                       <div className={`font-semibold ${isFull ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                         สมัครแล้ว {currentRegistrations} คน
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/dashboard/activities/${activity.id}`}
                      className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl text-center font-medium transition-all flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 dark:group-hover:shadow-none"
                    >
                      ดูรายละเอียด <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    {isAdmin && (
                      <Link
                        href={`/dashboard/activities/new?id=${activity.id}`}
                        className="w-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-colors"
                        title="แก้ไขกิจกรรม"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
