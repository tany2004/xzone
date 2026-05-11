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

interface PSTariffsProps {
  rules: PricingRule[];
}

export function PSTariffs({ rules }: PSTariffsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {rules.map((rule) => {
        const price = rule.pricePerHour;
        const isHourly = rule.period === "HOURLY";
        
        return (
          <div
            key={rule.id}
            className="rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#1a1435] p-6 transition-colors hover:border-violet-700/50"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-violet-400/70">
              PS Area · {periodLabel[rule.period]}
            </p>
            <p className="mt-2 text-sm text-violet-200/40">
              {isHourly ? "1 ЧАС" : "НОЧНОЙ ПАКЕТ"}
            </p>
            <p className="mt-4 text-4xl font-bold text-white">
              {price} <span className="text-2xl text-violet-400">₽</span>
            </p>
            {!isHourly && (
              <p className="mt-1 text-xs text-teal-400/60">
                Экономия 200₽
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}