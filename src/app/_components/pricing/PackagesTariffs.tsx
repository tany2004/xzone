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

interface PackagesTariffsProps {
  rules: PricingRule[];
}

export function PackagesTariffs({ rules }: PackagesTariffsProps) {
  const sortedRules = [...rules].sort((a, b) => a.pricePerHour - b.pricePerHour);
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {sortedRules.map((rule) => {
        const totalPrice = rule.pricePerHour;
        let hours = 0;
        let hourlyRate = 0;
        
        if (rule.period === "PACK_3H") {
          hours = 3;
          hourlyRate = Math.round(totalPrice / 3);
        } else if (rule.period === "PACK_5H") {
          hours = 5;
          hourlyRate = Math.round(totalPrice / 5);
        } else if (rule.period === "NIGHT_WEEKDAY" || rule.period === "NIGHT_WEEKEND") {
          hours = 8;
          hourlyRate = Math.round(totalPrice / 8);
        }
        
        return (
          <div
            key={rule.id}
            className="rounded-sm border border-[#1e1540] bg-[#120e24] p-6 transition-colors hover:border-violet-700/50"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-violet-400/70">
              {periodLabel[rule.period]}
            </p>
            {hours > 0 && (
              <>
                <p className="mt-2 text-sm text-violet-200/40">
                  {hours} ЧАС{hours > 1 ? 'ОВ' : ''}
                </p>
                <p className="mt-1 text-xs text-violet-200/40">
                  ОДИН ЧАС = {hourlyRate} ₽
                </p>
              </>
            )}
            <p className="mt-4 text-4xl font-bold text-white">
              {totalPrice} <span className="text-2xl text-violet-400">₽</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}