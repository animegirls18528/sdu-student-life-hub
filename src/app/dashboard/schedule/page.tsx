import { getTeachingSchedules } from "@/app/actions/teaching-schedule";
import { Clock, MapPin, User } from "lucide-react";

const DAYS_ORDER = [
  { key: "จันทร์", color: "bg-yellow-100 dark:bg-yellow-900/30", textColor: "text-yellow-700 dark:text-yellow-400" },
  { key: "อังคาร", color: "bg-pink-100 dark:bg-pink-900/30", textColor: "text-pink-700 dark:text-pink-400" },
  { key: "พุธ", color: "bg-green-100 dark:bg-green-900/30", textColor: "text-green-700 dark:text-green-400" },
  { key: "พฤหัสบดี", color: "bg-orange-100 dark:bg-orange-900/30", textColor: "text-orange-700 dark:text-orange-400" },
  { key: "ศุกร์", color: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-700 dark:text-blue-400" },
  { key: "เสาร์", color: "bg-purple-100 dark:bg-purple-900/30", textColor: "text-purple-700 dark:text-purple-400" },
  { key: "อาทิตย์", color: "bg-red-100 dark:bg-red-900/30", textColor: "text-red-700 dark:text-red-400" }
];

const START_HOUR = 8;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const SLOT_MINUTES = 30; 
const TOTAL_COLUMNS = (TOTAL_HOURS * 60) / SLOT_MINUTES; // 24 slots

function timeToMinutes(timeStr: string) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export default async function SchedulePage() {
  const schedules = await getTeachingSchedules();
  
  const scheduleData = DAYS_ORDER.map(dayInfo => ({
    ...dayInfo,
    subjects: schedules
      .filter((s: any) => s.dayOfWeek === dayInfo.key)
      .map((s: any) => {
        const startMins = timeToMinutes(s.startTime);
        const endMins = timeToMinutes(s.endTime);
        const durationMins = endMins - startMins;
        
        // Col 1 is day name, Col 2 is 08:00
        const startBlock = 2 + Math.round((startMins - (START_HOUR * 60)) / SLOT_MINUTES);
        const spanBlocks = Math.round(durationMins / SLOT_MINUTES);
        
        return {
          id: s.id,
          time: `${s.startTime} - ${s.endTime}`,
          name: s.courseName,
          room: s.room,
          instructor: s.user?.name || "ไม่ระบุ",
          type: s.type,
          // bounds checking
          gridColumnStart: Math.max(2, Math.min(startBlock, TOTAL_COLUMNS + 1)), 
          gridColumnEnd: Math.max(2, Math.min(startBlock + spanBlocks, TOTAL_COLUMNS + 2))
        };
      })
  }));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">ตารางเรียนรวม</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">รูปแบบตารางเรียนประจำสัปดาห์</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] p-6 pt-8">
            
            {/* Header Row (Times) */}
            <div 
              className="grid border-b-2 border-zinc-300 dark:border-zinc-700 pb-2 relative mb-4"
              style={{ gridTemplateColumns: `100px repeat(${TOTAL_COLUMNS}, minmax(0, 1fr))` }}
            >
              <div className="text-center font-bold text-zinc-500 dark:text-zinc-400 text-sm flex items-end justify-center pb-2">
                วัน / เวลา
              </div>
              
              {/* Vertical lines and labels for every hour */}
              {Array.from({length: TOTAL_HOURS}).map((_, i) => (
                <div 
                  key={i} 
                  className="col-span-2 relative h-full flex items-end"
                >
                  <div className="absolute left-0 bottom-0 h-4 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                  <span className="absolute -left-4 bottom-5 font-bold text-zinc-700 dark:text-zinc-300 text-sm w-8 text-center">
                    {(START_HOUR + i).toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
              
              {/* Very last marker (20:00) */}
              <div className="absolute right-0 bottom-2 h-4 w-px bg-zinc-400 dark:bg-zinc-600"></div>
              <span className="absolute -right-4 bottom-7 font-bold text-zinc-700 dark:text-zinc-300 text-sm w-8 text-center">
                {END_HOUR}:00
              </span>
            </div>

            {/* Days Rows */}
            <div className="space-y-4">
              {scheduleData.map((day) => (
                <div 
                  key={day.key} 
                  className="grid relative min-h-[90px]"
                  style={{ gridTemplateColumns: `100px repeat(${TOTAL_COLUMNS}, minmax(0, 1fr))` }}
                >
                  {/* Background grid lines (every 30 mins) */}
                  {Array.from({length: TOTAL_COLUMNS}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`border-l pointer-events-none h-full z-0 ${
                        i % 2 === 0 
                          ? 'border-zinc-300 dark:border-zinc-700/80' // Hour lines (thicker/darker)
                          : 'border-zinc-100 dark:border-zinc-800/40 border-dashed' // Half-hour lines (dashed)
                      }`}
                      style={{ 
                        gridRow: "1 / -1", 
                        gridColumn: `${2 + i} / span 1`
                      }}
                    ></div>
                  ))}
                  {/* Final right boundary line */}
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700/80 z-0"></div>

                  {/* Day Label */}
                  <div 
                    className={`flex items-center justify-center p-3 rounded-2xl font-bold ${day.color} ${day.textColor} shadow-sm h-full max-h-[90px] sticky left-0 z-20`}
                    style={{ gridColumn: "1", gridRow: "1 / -1" }}
                  >
                    {day.key}
                  </div>

                  {/* Subjects */}
                  {day.subjects.map((sub) => (
                    <div 
                      key={sub.id}
                      className={`
                        rounded-xl p-3 shadow-md hover:shadow-lg transition-transform hover:scale-[1.01] flex flex-col overflow-hidden z-10 border-2 cursor-default
                        ${sub.type === 'บรรยาย' 
                          ? 'bg-blue-600 border-white dark:border-black text-white hover:bg-blue-500' 
                          : 'bg-indigo-600 border-white dark:border-black text-white hover:bg-indigo-500'}
                      `}
                      style={{ 
                        gridColumnStart: sub.gridColumnStart, 
                        gridColumnEnd: sub.gridColumnEnd 
                      }}
                    >
                      <h3 className="font-bold text-sm truncate" title={sub.name}>{sub.name}</h3>
                      <div className="text-xs text-white/90 mt-1 font-medium truncate">
                        {sub.time}
                      </div>
                      <div className="text-xs text-white/80 truncate mt-auto pt-1">
                        {sub.room} • {sub.instructor}
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty state placeholder */}
                  {day.subjects.length === 0 && (
                    <div 
                      className="flex items-center text-zinc-300 dark:text-zinc-600 italic text-sm pl-6 z-10"
                      style={{ gridColumn: "2 / -1", gridRow: "1" }}
                    >
                      - ว่าง -
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-6 items-center justify-end text-sm text-zinc-600 dark:text-zinc-400 px-2 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-black shadow-sm"></div>
          <span>บรรยาย</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-black shadow-sm"></div>
          <span>ปฏิบัติ</span>
        </div>
      </div>
    </div>
  );
}
