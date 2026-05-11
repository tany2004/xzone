'use client';

import type { PricingRule } from "./PricingTabsClient";

const periodLabel: Record<string, string> = {
  MORNING:       "08:00 – 12:00",
  DAY:           "12:00 – 17:00",
  EVENING:       "17:00 – 08:00",
  PACK_3H:       "Пакет 3 часа",
  PACK_5H:       "Пакет 5 часов",
  NIGHT_WEEKDAY: "Ночной / будни",
  NIGHT_WEEKEND: "Ночной / выходные",
  HOURLY:        "1 час",
};

interface HourlyTariffsProps {
  rules: PricingRule[];
}

export function HourlyTariffs({ rules }: HourlyTariffsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {rules.map((rule) => {
        const hourPrice = rule.pricePerHour;
        return (
          <div
            key={rule.id}
            className="rounded-sm border border-[#1e1540] bg-[#120e24] p-6 transition-colors hover:border-violet-700/50"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-violet-400/70">
              {periodLabel[rule.period]}
            </p>
            <p className="mt-2 text-sm text-violet-200/40">1 ЧАС</p>
            <p className="mt-4 text-4xl font-bold text-white">
              {hourPrice} <span className="text-2xl text-violet-400">₽</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}