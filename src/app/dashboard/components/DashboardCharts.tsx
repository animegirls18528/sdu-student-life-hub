"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const lineData = [
  { name: 'ม.ค.', grade: 3.2, attendance: 85 },
  { name: 'ก.พ.', grade: 3.5, attendance: 92 },
  { name: 'มี.ค.', grade: 3.3, attendance: 88 },
  { name: 'เม.ย.', grade: 3.8, attendance: 95 },
  { name: 'พ.ค.', grade: 4.0, attendance: 98 },
];

const pieData = [
  { name: 'วิชาการ', value: 45, color: '#3b82f6' },
  { name: 'กิจกรรม', value: 30, color: '#10b981' },
  { name: 'จิตอาสา', value: 15, color: '#8b5cf6' },
  { name: 'อื่นๆ', value: 10, color: '#f59e0b' },
];

export function AttendanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="attendance" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
            name="การเข้าเรียน (%)"
          />
          <Line 
            type="monotone" 
            dataKey="grade" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            name="ผลการเรียน (GPA)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityDonutChart() {
  return (
    <div className="h-[300px] w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">100%</span>
        <span className="text-xs text-zinc-400">ภาพรวม</span>
      </div>
    </div>
  );
}
