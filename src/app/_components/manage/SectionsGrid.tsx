import { CalendarDays, CircleDollarSign, Monitor } from "lucide-react";
import { SectionCard } from "./SectionCard";

const sections = [
  {
    href: "/manage/booking",
    label: "Бронирования",
    description: "Просматривай, подтверждай и отменяй бронирования",
    icon: CalendarDays,
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/manage/pricing",
    label: "Прайс",
    description: "Управление тарифами для каждого клуба",
    icon: CircleDollarSign,
    color: "from-emerald-500/20 to-teal-600/20",
    iconColor: "text-emerald-400",
  },
  {
    href: "/manage/seats",
    label: "Места",
    description: "Блокировка и настройка мест в залах",
    icon: Monitor,
    color: "from-purple-500/20 to-violet-600/20",
    iconColor: "text-purple-400",
  },
];

export function SectionsGrid() {
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Разделы управления</h2>
          <p className="text-sm text-violet-200/50">Полный доступ ко всем функциям</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
      </div>
    </div>
  );
}