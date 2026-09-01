"use client";

import { useState } from "react";
import { Bell, Info, Edit } from "lucide-react";
import Link from "next/link";

export default function AnnouncementList({ announcements, isAdmin }: { announcements: any[], isAdmin: boolean }) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const types = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "ทั่วไป", label: "ทั่วไป" },
    { id: "ด่วน", label: "ด่วน" },
  ];

  const filteredAnnouncements = announcements.filter(news => 
    filterType === "ALL" || news.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setFilterType(type.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === type.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-100">
          ไม่พบประกาศในหมวดหมู่นี้
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAnnouncements.map((news: any) => (
            <div key={news.id} className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm hover:border-zinc-900 transition-all group flex gap-8 items-start">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                news.type === 'ด่วน' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white'
              }`}>
                {news.type === 'ด่วน' ? <Bell className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    news.type === 'ด่วน' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}>{news.type}</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {new Date(news.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{news.author}</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-3">{news.title}</h2>
                <p className="text-zinc-500 leading-relaxed max-w-3xl whitespace-pre-wrap">{news.content}</p>
              </div>

              {isAdmin && (
                <Link 
                  href={`/dashboard/announcements/new?id=${news.id}`}
                  className="p-3 rounded-xl text-zinc-400 hover:text-amber-600 hover:bg-amber-50 transition-all self-center"
                  title="แก้ไขประกาศ"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
