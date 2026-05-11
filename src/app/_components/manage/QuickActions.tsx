import { CheckCircle, Monitor, CircleDollarSign, CalendarDays } from "lucide-react";
import { QuickAction } from "./QuickAction";

export function QuickActions() {
  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Быстрые действия</h2>
          <p className="text-sm text-violet-200/50">Часто используемые функции</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          href="/manage/booking?filter=pending"
          label="Подтвердить бронирования"
          icon={CheckCircle}
          color="from-amber-500/20 to-orange-600/20"
        />
        <QuickAction
          href="/manage/seats"
          label="Проверить места"
          icon={Monitor}
          color="from-blue-500/20 to-blue-600/20"
        />
        <QuickAction
          href="/manage/pricing"
          label="Обновить цены"
          icon={CircleDollarSign}
          color="from-emerald-500/20 to-teal-600/20"
        />
        <QuickAction
          href="/manage/booking?filter=today"
          label="Бронирования на сегодня"
          icon={CalendarDays}
          color="from-purple-500/20 to-violet-600/20"
        />
      </div>
    </div>
  );
}