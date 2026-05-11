import { CalendarDays, Clock, Monitor, AlertCircle } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  stats: {
    activeBookings: number;
    todayBookings: number;
    availableSeats: number;
    totalSeats: number;
    blockedSeats: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Активные бронирования"
        value={stats.activeBookings}
        icon={CalendarDays}
        trend={""}
        color="from-blue-500/20 to-blue-600/20"
        iconColor="text-blue-400"
      />
      <StatCard
        title="Бронирования на сегодня"
        value={stats.todayBookings}
        icon={Clock}
        trend={""}
        color="from-cyan-500/20 to-cyan-600/20"
        iconColor="text-cyan-400"
      />
      <StatCard
        title="Доступных мест"
        value={stats.availableSeats}
        icon={Monitor}
        trend={`${stats.totalSeats} всего`}
        color="from-emerald-500/20 to-emerald-600/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        title="Заблокировано мест"
        value={stats.blockedSeats}
        icon={AlertCircle}
        trend={`${Math.round((stats.blockedSeats / stats.totalSeats) * 100)}% от всех`}
        color="from-red-500/20 to-red-600/20"
        iconColor="text-red-400"
      />
    </div>
  );
}