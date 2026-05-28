import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  valueColor?: string;
  iconColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  valueColor = "text-slate-900",
  iconColor = "text-slate-400"
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className={`mt-2 text-2xl font-semibold ${valueColor}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
    </div>
  );
}
