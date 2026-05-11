import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend: string;
  color: string;
  iconColor: string;
}

export function StatCard({ title, value, icon: Icon, trend, color, iconColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-6">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-violet-400/60">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-violet-400/40">{trend}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br ${color} ${iconColor}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}