import { Clock, Package, Crown } from "lucide-react";

export const seatTypeLabel: Record<string, string> = {
  PC: "ПК",
  PS: "PS / Xbox",
};

export const periodLabel: Record<string, string> = {
  MORNING: "08:00 – 12:00",
  DAY: "12:00 – 17:00",
  EVENING: "17:00 – 08:00",
  PACK_3H: "Пакет 3 часа",
  PACK_5H: "Пакет 5 часов",
  NIGHT_WEEKDAY: "Ночной / будни",
  NIGHT_WEEKEND: "Ночной / выходные",
  HOURLY: "1 час",
};

export const periodOptions = {
  PC: [
    { value: "MORNING" as const, label: "Утро (08:00-12:00)" },
    { value: "DAY" as const, label: "День (12:00-17:00)" },
    { value: "EVENING" as const, label: "Вечер (17:00-08:00)" },
    { value: "PACK_3H" as const, label: "Пакет 3 часа" },
    { value: "PACK_5H" as const, label: "Пакет 5 часов" },
    { value: "NIGHT_WEEKDAY" as const, label: "Ночной (будни)" },
    { value: "NIGHT_WEEKEND" as const, label: "Ночной (выходные)" },
  ],
  PS: [
    { value: "HOURLY" as const, label: "Почасовой" },
    { value: "NIGHT_WEEKDAY" as const, label: "Ночной (будни)" },
    { value: "NIGHT_WEEKEND" as const, label: "Ночной (выходные)" },
  ],
};

export type PricingPeriodType = 
  | "MORNING" | "DAY" | "EVENING" 
  | "PACK_3H" | "PACK_5H" 
  | "NIGHT_WEEKDAY" | "NIGHT_WEEKEND" 
  | "HOURLY";

// Функция возвращает JSX, поэтому файл должен быть .tsx
export const getPeriodIcon = (period: string) => {
  if (["MORNING", "DAY", "EVENING"].includes(period)) {
    return <Clock className="h-4 w-4" />;
  }
  if (["PACK_3H", "PACK_5H", "NIGHT_WEEKDAY", "NIGHT_WEEKEND"].includes(period)) {
    return <Package className="h-4 w-4" />;
  }
  return <Crown className="h-4 w-4" />;
};