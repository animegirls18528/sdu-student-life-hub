"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Monitor, ArrowRight } from "lucide-react";

export default function EquipmentList({ equipments }: { equipments: any[] }) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const statuses = [
    { id: "ALL", label: "ทั้งหมด" },
    { id: "AVAILABLE", label: "ว่าง (Available)" },
    { id: "UNAVAILABLE", label: "ไม่ว่าง (Unavailable)" },
    { id: "MAINTENANCE", label: "ส่งซ่อม (Maintenance)" },
  ];

  const filteredEquipments = equipments.filter(equipment => 
    filterStatus === "ALL" || equipment.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.id}
            onClick={() => setFilterStatus(status.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === status.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {filteredEquipments.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-100">
          ไม่พบอุปกรณ์ในสถานะนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment: any) => (
            <div key={equipment.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg hover:border-zinc-200 transition-all group flex flex-col">
              <div className="relative h-48 w-full bg-zinc-100">
                {equipment.imageUrl ? (
                  <Image 
                    src={equipment.imageUrl} 
                    alt={equipment.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                    <Monitor className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-zinc-900 shadow-sm">
                  {equipment.type === "LAPTOP" ? "แล็ปท็อป" : equipment.type === "PROJECTOR" ? "โปรเจคเตอร์" : equipment.type === "CABLE" ? "สายเคเบิล" : equipment.type}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{equipment.name}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
                  {equipment.description || "ไม่มีรายละเอียด"}
                </p>
                <div className="flex items-center text-sm mb-6">
                  {equipment.status === "AVAILABLE" ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-medium text-xs">พร้อมให้บริการ</span>
                  ) : equipment.status === "MAINTENANCE" ? (
                    <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium text-xs">กำลังส่งซ่อม</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded font-medium text-xs">ไม่ว่าง</span>
                  )}
                </div>
                <Link 
                  href={`/dashboard/equipment/${equipment.id}`}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-center font-medium transition-all flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200"
                >
                  เลือกอุปกรณ์นี้ <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
