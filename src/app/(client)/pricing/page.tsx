import { api } from "~/trpc/server";
import { PricingTabsClient } from "~/app/_components/pricing/PricingTabsClient";
import { DrinksSection } from "~/app/_components/pricing/DrinksSection";
import { PrintingSection } from "~/app/_components/pricing/PrintingSection";

export default async function PricingPage() {
  const clubs = await api.club.getAll();
  const pricingRules = await Promise.all(
    clubs.map(async (club) => ({
      club,
      rules: await api.pricing.getByClub({ clubId: club.id }),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Тарифы
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white">Цены</h1>
      <p className="mt-2 text-sm text-violet-200/50">Все тарифы и услуги</p>

      {pricingRules.map(({ club, rules }) => {
        // Преобразуем Decimal в number
        const transformedRules = rules.map(rule => ({
          ...rule,
          pricePerHour: Number(rule.pricePerHour)
        }));

        // Почасовые тарифы только для ПК (MORNING, DAY, EVENING)
        const hourlyRules = transformedRules.filter(rule => 
          ["MORNING", "DAY", "EVENING"].includes(rule.period) && rule.seatType === "PC"
        );
        
        // Пакеты только для ПК (PACK_3H, PACK_5H, NIGHT_WEEKDAY, NIGHT_WEEKEND)
        const packageRules = transformedRules.filter(rule => 
          ["PACK_3H", "PACK_5H", "NIGHT_WEEKDAY", "NIGHT_WEEKEND"].includes(rule.period) && rule.seatType === "PC"
        );
        
        // PS тарифы (HOURLY и ночные пакеты для PS)
        const psRules = transformedRules.filter(rule => rule.seatType === "PS");
        const hasPS = psRules.length > 0;
        
        return (
          <section key={club.id} className="mt-16">
            <h2 className="text-xl font-bold text-white">{club.name}</h2>
            <PricingTabsClient 
              hourlyRules={hourlyRules}
              packageRules={packageRules}
              psRules={psRules}
              hasPS={hasPS}
            />
          </section>
        );
      })}

      <DrinksSection />
      <PrintingSection />
    </div>
  );
}