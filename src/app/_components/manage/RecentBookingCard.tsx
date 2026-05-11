import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RecentBookingCardProps {
  booking: {
    id: string;
    clientName: string;
    status: string;
    startsAt: string | Date;
    endsAt: string | Date;
    seat?: {
      hall?: {
        club?: {
          name: string;
        };
      };
    };
  };
}

export function RecentBookingCard({ booking }: RecentBookingCardProps) {
  // Приводим статус к верхнему регистру для сопоставления
  const statusUpper = booking.status?.toUpperCase() || "PENDING";
  
  const statusConfig: Record<string, { icon: LucideIcon; color: string; bg: string; label: string }> = {
    PENDING: { icon: Clock, color: "text-amber-400", bg: "from-amber-500/20", label: "Ожидает" },
    CONFIRMED: { icon: CheckCircle, color: "text-emerald-400", bg: "from-emerald-500/20", label: "Подтверждено" },
    REJECTED: { icon: XCircle, color: "text-red-400", bg: "from-red-500/20", label: "Отклонено" },
    CANCELLED: { icon: XCircle, color: "text-red-400", bg: "from-red-500/20", label: "Отменено" },
  };
  
  // Добавляем проверку на undefined с fallback
  const config = statusConfig[statusUpper] || statusConfig.PENDING;
  
  // Убеждаемся, что config существует
  if (!config) {
    return null; // или вернуть заглушку
  }
  
  const IconComponent = config.icon;

  // Форматируем дату из startsAt
  const formatDate = (date: string | Date) => {
    if (!date) return "Дата не указана";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Некорректная дата";
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Вычисляем длительность в часах
  const getDuration = (startsAt: string | Date, endsAt: string | Date) => {
    if (!startsAt || !endsAt) return "";
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
    const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${hours} ч`;
  };

  return (
    <div className="flex items-center justify-between rounded-sm border border-[#1e1540] bg-[#120e24]/30 p-4 transition-all hover:border-violet-500/50">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br ${config.bg}`}>
          <IconComponent size={16} className={config.color} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {booking.clientName} — {booking.seat?.hall?.club?.name || "Клуб не указан"}
          </p>
          <p className="text-xs text-violet-400/60">
            {formatDate(booking.startsAt)} • {getDuration(booking.startsAt, booking.endsAt)}
          </p>
        </div>
      </div>
      <span className={`text-xs ${config.color}`}>{config.label}</span>
    </div>
  );
}