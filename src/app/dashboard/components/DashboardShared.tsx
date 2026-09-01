import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";

export function EnhancedStatCard({ title, value, trend, trendType, icon, iconBg }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:border-blue-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 rounded-2xl ${iconBg} transition-all`}>
          {icon}
        </div>
        <button className="text-zinc-300 hover:text-zinc-900">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div>
        <div className="text-sm text-zinc-400 font-bold mb-1">{title}</div>
        <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">{value}</div>
        <div className="flex items-center gap-1">
          {trendType === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs font-bold ${trendType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium ml-1">เทียบกับเดือนที่แล้ว</span>
        </div>
      </div>
    </div>
  );
}

export function RecentActivityRow({ date, title, type, value, status }: any) {
  return (
    <tr className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all">
      <td className="px-8 py-5 text-sm text-zinc-500">{date}</td>
      <td className="px-8 py-5 text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</td>
      <td className="px-8 py-5 text-sm text-zinc-500">{type}</td>
      <td className="px-8 py-5 text-sm font-bold text-zinc-900 dark:text-zinc-100">{value}</td>
      <td className="px-8 py-5">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
          status === 'สำเร็จ' ? 'bg-emerald-50 text-emerald-600' : 
          status === 'รอดำเนินการ' ? 'bg-orange-50 text-orange-600' : 
          'bg-red-50 text-red-600'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

export function NotificationItem({ icon, text, time }: any) {
  return (
    <div className="flex items-start gap-4 p-2">
      <div className="mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 truncate">{text}</p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export function QuickAction({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/30 transition-all gap-2 group">
      <div className="text-zinc-400 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-zinc-500 group-hover:text-blue-600 uppercase tracking-tight">{label}</span>
    </button>
  );
}
