import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pricingRouter = createTRPCRouter({
getByClub: publicProcedure
  .input(z.object({ clubId: z.string() }))
  .query(async ({ ctx, input }) => {
    const rules = await ctx.db.pricingRule.findMany({
      where: { clubId: input.clubId },
      orderBy: [{ seatType: "asc" }, { period: "asc" }],
    });

    return rules.map((rule) => ({
      ...rule,
      pricePerHour: Number(rule.pricePerHour),
    }));
  }),

  calculatePrice: publicProcedure
  .input(
    z.object({
      seatId: z.string().uuid(),
      startsAt: z.date(),
      endsAt: z.date(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const seat = await ctx.db.seat.findUnique({
      where: { id: input.seatId },
      include: { hall: true },
    });
    if (!seat) return null;

    const rules = await ctx.db.pricingRule.findMany({
      where: { clubId: seat.hall.clubId, seatType: seat.seatType },
    });
    if (!rules.length) return null;

    const durationMs = input.endsAt.getTime() - input.startsAt.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const roundedHours = Math.round(durationHours * 10) / 10;

    const startHour = input.startsAt.getHours();
    const startMin = input.startsAt.getMinutes();
    const startTotal = startHour * 60 + startMin; // минуты от начала суток

    // Для PS5
    if (seat.seatType === "PS") {
      // Проверяем ночной пакет для PS
      const isNightStart = startTotal >= 21 * 60; // с 21:00
      const endHour = input.endsAt.getHours();
      const endMin = input.endsAt.getMinutes();
      const endTotal = endHour * 60 + endMin;
      const isNightEnd = endTotal <= 7 * 60 + 30; // до 07:30

      // Если попадает в ночной период
      if (isNightStart && isNightEnd) {
        const dayOfWeek = input.startsAt.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
        const period = isWeekend ? "NIGHT_WEEKEND" : "NIGHT_WEEKDAY";
        const rule = rules.find((r) => r.period === period);
        if (rule) {
          return {
            pricePerHour: null,
            durationHours: roundedHours,
            total: Number(rule.pricePerHour),
            period: rule.period,
            isPackage: true,
          };
        }
      }

      // Если не ночной пакет - используем почасовой тариф
      const rule = rules.find((r) => r.period === "HOURLY") ?? rules[0];
      if (!rule) return null;
      
      return {
        pricePerHour: Number(rule.pricePerHour),
        durationHours: roundedHours,
        total: Math.ceil(roundedHours * Number(rule.pricePerHour)),
        period: rule.period,
        isPackage: false,
      };
    }

    // ПК - проверяем ночные пакеты
    const isNightStart = startTotal >= 21 * 60; // с 21:00
    const endHour = input.endsAt.getHours();
    const endMin = input.endsAt.getMinutes();
    const endTotal = endHour * 60 + endMin;
    const isNightEnd = endTotal <= 7 * 60 + 30; // до 07:30

    if (isNightStart && isNightEnd) {
      const dayOfWeek = input.startsAt.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      const period = isWeekend ? "NIGHT_WEEKEND" : "NIGHT_WEEKDAY";
      const rule = rules.find((r) => r.period === period);
      if (rule) {
        return {
          pricePerHour: null,
          durationHours: roundedHours,
          total: Number(rule.pricePerHour),
          period: rule.period,
          isPackage: true,
        };
      }
    }

    // Пакеты 3 и 5 часов (только для ПК)
    if (roundedHours === 3) {
      const rule = rules.find((r) => r.period === "PACK_3H");
      if (rule) {
        return {
          pricePerHour: null,
          durationHours: roundedHours,
          total: Number(rule.pricePerHour),
          period: rule.period,
          isPackage: true,
        };
      }
    }
    if (roundedHours === 5) {
      const rule = rules.find((r) => r.period === "PACK_5H");
      if (rule) {
        return {
          pricePerHour: null,
          durationHours: roundedHours,
          total: Number(rule.pricePerHour),
          period: rule.period,
          isPackage: true,
        };
      }
    }

    // Почасовой для ПК — определяем тариф по времени старта
    let period: "MORNING" | "DAY" | "EVENING";
    if (startTotal >= 8 * 60 && startTotal < 12 * 60) {
      period = "MORNING";
    } else if (startTotal >= 12 * 60 && startTotal < 17 * 60) {
      period = "DAY";
    } else {
      period = "EVENING";
    }

    const rule = rules.find((r) => r.period === period) ?? rules[0];
    if (!rule) return null;
    
    return {
      pricePerHour: Number(rule.pricePerHour),
      durationHours: roundedHours,
      total: Math.ceil(roundedHours * Number(rule.pricePerHour)),
      period: rule.period,
      isPackage: false,
    };
  }),
});