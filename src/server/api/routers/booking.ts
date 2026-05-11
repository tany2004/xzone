import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Генерация короткого кода брони — например "ABC-4821"
function generateBookingCode(): string {
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

// Вспомогательная функция для расчета цены (дублирует логику calculatePrice)
async function calculatePriceForBooking({
  seatId,
  startsAt,
  endsAt,
  ctx,
}: {
  seatId: string;
  startsAt: Date;
  endsAt: Date;
  ctx: any;
}) {
  const seat = await ctx.db.seat.findUnique({
    where: { id: seatId },
    include: { hall: true },
  });
  if (!seat) return null;

  const rules = await ctx.db.pricingRule.findMany({
    where: { clubId: seat.hall.clubId, seatType: seat.seatType },
  });
  if (!rules.length) return null;

  const durationMs = endsAt.getTime() - startsAt.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const roundedHours = Math.round(durationHours * 10) / 10;

  const startHour = startsAt.getHours();
  const startMin = startsAt.getMinutes();
  const startTotal = startHour * 60 + startMin;

  // PS5
  if (seat.seatType === "PS") {
    const isNightStart = startTotal >= 21 * 60;
    const endHour = endsAt.getHours();
    const endMin = endsAt.getMinutes();
    const endTotal = endHour * 60 + endMin;
    const isNightEnd = endTotal <= 7 * 60 + 30;

    if (isNightStart && isNightEnd) {
      const dayOfWeek = startsAt.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      const period = isWeekend ? "NIGHT_WEEKEND" : "NIGHT_WEEKDAY";
      const rule = rules.find((r: any) => r.period === period);
      if (rule) {
        return { total: Number(rule.pricePerHour) };
      }
    }

    const rule = rules.find((r: any) => r.period === "HOURLY") ?? rules[0];
    if (!rule) return null;
    
    return { total: Math.ceil(roundedHours * Number(rule.pricePerHour)) };
  }

  // ПК - ночные пакеты
  const isNightStart = startTotal >= 21 * 60;
  const endHour = endsAt.getHours();
  const endMin = endsAt.getMinutes();
  const endTotal = endHour * 60 + endMin;
  const isNightEnd = endTotal <= 7 * 60 + 30;

  if (isNightStart && isNightEnd) {
    const dayOfWeek = startsAt.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const period = isWeekend ? "NIGHT_WEEKEND" : "NIGHT_WEEKDAY";
    const rule = rules.find((r: any) => r.period === period);
    if (rule) {
      return { total: Number(rule.pricePerHour) };
    }
  }

  // Пакеты 3 и 5 часов
  if (roundedHours === 3) {
    const rule = rules.find((r: any) => r.period === "PACK_3H");
    if (rule) {
      return { total: Number(rule.pricePerHour) };
    }
  }
  if (roundedHours === 5) {
    const rule = rules.find((r: any) => r.period === "PACK_5H");
    if (rule) {
      return { total: Number(rule.pricePerHour) };
    }
  }

  // Почасовой
  let period: "MORNING" | "DAY" | "EVENING";
  if (startTotal >= 8 * 60 && startTotal < 12 * 60) {
    period = "MORNING";
  } else if (startTotal >= 12 * 60 && startTotal < 17 * 60) {
    period = "DAY";
  } else {
    period = "EVENING";
  }

  const rule = rules.find((r: any) => r.period === period) ?? rules[0];
  if (!rule) return null;
  
  return { total: Math.ceil(roundedHours * Number(rule.pricePerHour)) };
}

export const bookingRouter = createTRPCRouter({
  // Создать бронь
create: publicProcedure
  .input(
    z.object({
      seatId: z.string().uuid(),
      startsAt: z.date(),
      endsAt: z.date(),
      clientName: z.string().min(1),
      clientPhone: z.string().min(1),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Генерируем уникальный код бронирования
    const bookingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Проверяем, не забронировано ли уже место на это время
    const existingBooking = await ctx.db.booking.findFirst({
      where: {
        seatId: input.seatId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            AND: [
              { startsAt: { lte: input.startsAt } },
              { endsAt: { gt: input.startsAt } },
            ],
          },
          {
            AND: [
              { startsAt: { lt: input.endsAt } },
              { endsAt: { gte: input.endsAt } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Это место уже забронировано на выбранное время",
      });
    }

    // Рассчитываем стоимость бронирования
    const priceInfo = await calculatePriceForBooking({
      seatId: input.seatId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      ctx,
    });

    if (!priceInfo) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось рассчитать стоимость",
      });
    }

    // Создаем бронирование с сохраненной ценой
    const booking = await ctx.db.booking.create({
      data: {
        bookingCode,
        seatId: input.seatId,
        clientName: input.clientName,
        clientPhone: input.clientPhone,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        status: "PENDING",
        totalPrice: priceInfo.total, // Сохраняем цену в БД
      },
    });

    return {
      bookingCode: booking.bookingCode,
      totalPrice: priceInfo.total,
      message: "Бронирование создано успешно",
    };
  }),

  // Найти бронь по коду (для пользователя)
  getByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingCode: input.code },
        include: {
          seat: {
            include: {
              hall: {
                include: { club: true },
              },
            },
          },
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Бронь не найдена",
        });
      }

      return {
        bookingCode: booking.bookingCode,
        status: booking.status,
        clientName: booking.clientName,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
        seat: booking.seat.label,
        hall: booking.seat.hall.name,
        club: booking.seat.hall.club.name,
      };
    }),

  // Отменить бронь по коду (для пользователя)
  cancelByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { bookingCode: input.code },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Бронь не найдена",
        });
      }

      if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Бронь уже отменена",
        });
      }

      await ctx.db.booking.update({
        where: { bookingCode: input.code },
        data: { status: "CANCELLED" },
      });

      return { success: true };
    }),

  checkPhone: publicProcedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ ctx, input }) => {
      const entry = await ctx.db.blacklist.findUnique({
        where: { clientPhone: input.phone },
        select: { id: true }, // минимум данных, без причины и деталей
      });
      return { isBlacklisted: !!entry };
    }),
});