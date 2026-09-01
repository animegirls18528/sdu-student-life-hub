"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, MapPin, ArrowRight } from "lucide-react";

export default function RoomList({ rooms }: { rooms: any[] }) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const types = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "MEETING", label: "ห้องประชุม" },
    { id: "STUDY", label: "ห้องอ่านหนังสือ" },
  ];

  const filteredRooms = rooms.filter(room => 
    filterType === "ALL" || room.type === filterType
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

      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-100">
          ไม่พบห้องในประเภทนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg hover:border-zinc-200 transition-all group flex flex-col">
              <div className="relative h-48 w-full bg-zinc-100">
                {room.imageUrl ? (
                  <Image 
                    src={room.imageUrl} 
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-zinc-900 shadow-sm">
                  {room.type === "MEETING" ? "ห้องประชุม" : room.type === "STUDY" ? "ห้องอ่านหนังสือ" : room.type}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{room.name}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
                  {room.description || "ไม่มีรายละเอียด"}
                </p>
                <div className="flex items-center text-sm text-zinc-600 mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  <span>รองรับได้สูงสุด {room.capacity} คน</span>
                </div>
                <Link 
                  href={`/dashboard/rooms/${room.id}`}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-center font-medium transition-all flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200"
                >
                  เลือกห้องนี้ <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
