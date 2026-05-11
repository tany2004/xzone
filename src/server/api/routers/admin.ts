import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const seatTypeLabel: Record<string, string> = {
  PC: "ПК",
  PS: "PS / Xbox",
};

const periodLabel: Record<string, string> = {
  MORNING: "08:00 – 12:00",
  DAY: "12:00 – 17:00",
  EVENING: "17:00 – 08:00",
  PACK_3H: "Пакет 3 часа",
  PACK_5H: "Пакет 5 часов",
  NIGHT_WEEKDAY: "Ночной / будни",
  NIGHT_WEEKEND: "Ночной / выходные",
  HOURLY: "1 час",
};

export const adminRouter = createTRPCRouter({
  // Вход для администратора
  // Добавьте эту мутацию в adminRouter (перед другими процедурами)
login: publicProcedure
  .input(z.object({ 
    login: z.string(), 
    password: z.string() 
  }))
  .mutation(async ({ ctx, input }) => {
    const admin = await ctx.db.admin.findUnique({
      where: { login: input.login },
    });
    
    if (!admin) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(input.password, admin.passwordHash);
    
    if (!isValid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    
    const { signToken } = await import('~/lib/auth');
    const token = await signToken(admin.id);
    
    return { 
      token, 
      admin: { id: admin.id, login: admin.login } 
    };
  }),

// Список броней с фильтрами
getBookings: publicProcedure
  .input(
    z.object({
      clubId: z.string().uuid().optional(),
      date: z.string().optional(),
      status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"]).optional(),
      hideBlacklisted: z.boolean().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    // Получаем телефоны из чёрного списка
    let blacklistedPhones: string[] = [];
    if (input.hideBlacklisted) {
      const blacklist = await ctx.db.blacklist.findMany({
        select: { clientPhone: true },
      });
      blacklistedPhones = blacklist.map((b) => b.clientPhone);
    }

    return ctx.db.booking.findMany({
      where: {
        ...(input.status && { status: input.status }),
        ...(blacklistedPhones.length > 0 && {
          clientPhone: { notIn: blacklistedPhones },
        }),
        seat: {
          hall: {
            ...(input.clubId && { clubId: input.clubId }),
          },
        },
        ...(input.date && {
          startsAt: {
            gte: new Date(input.date),
            lt: new Date(new Date(input.date).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      },
      include: {
        seat: {
          include: {
            hall: {
              include: { club: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Изменить статус брони
  updateBookingStatus: publicProcedure
    .input(
      z.object({
        bookingId: z.string().uuid(),
        status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
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
        throw new TRPCError({ code: "NOT_FOUND", message: "Бронь не найдена" });
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { status: input.status },
      });
    }),

  // Места клуба со статусом
getSeats: publicProcedure
  .input(z.object({ clubId: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const seats = await ctx.db.seat.findMany({
      where: { hall: { clubId: input.clubId } },
      include: { hall: true },
      orderBy: [{ hall: { name: "asc" } }, { label: "asc" }],
    });
    
    return seats.sort((a, b) => {
      const numA = parseInt(a.label, 10);
      const numB = parseInt(b.label, 10);
      return numA - numB;
    });
  }),

  // Переключить блокировку места
  toggleSeatBlock: publicProcedure
    .input(z.object({ seatId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const seat = await ctx.db.seat.findUnique({
        where: { id: input.seatId },
      });
      if (!seat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Место не найдено" });
      }
      return ctx.db.seat.update({
        where: { id: input.seatId },
        data: { isBlocked: !seat.isBlocked },
      });
    }),

// Добавить место в зал
addSeat: protectedProcedure
  .input(z.object({ hallId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const hall = await ctx.db.hall.findUnique({
      where: { id: input.hallId },
    });
    if (!hall) throw new TRPCError({ code: "NOT_FOUND", message: "Зал не найден" });

    // Находим все места в этом зале и определяем следующий номер
    const existingSeats = await ctx.db.seat.findMany({
      where: { hallId: input.hallId },
      select: { label: true },
    });

    const numbers = existingSeats
      .map((s) => parseInt(s.label, 10))
      .filter((n) => !isNaN(n));

    const nextLabel = numbers.length > 0
      ? String(Math.max(...numbers) + 1)
      : "1";

    return ctx.db.seat.create({
      data: {
        hallId: input.hallId,
        label: nextLabel,
        seatType: hall.type,
        isBlocked: false,
      },
    });
  }),

// Удалить место
deleteSeat: protectedProcedure
  .input(z.object({ seatId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const seat = await ctx.db.seat.findUnique({
      where: { id: input.seatId },
      include: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
    });
    if (!seat) throw new TRPCError({ code: "NOT_FOUND", message: "Место не найдено" });

    // Не даём удалить если есть активные брони
    if (seat.bookings.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Нельзя удалить место с активными бронированиями",
      });
    }

    return ctx.db.seat.delete({ where: { id: input.seatId } });
  }),

// Создание нового тарифа
createPricingRule: publicProcedure
  .input(
    z.object({
      clubId: z.string().uuid(),
      seatType: z.enum(["PC", "PS"]),
      period: z.enum([
        "MORNING", "DAY", "EVENING",
        "PACK_3H", "PACK_5H", 
        "NIGHT_WEEKDAY", "NIGHT_WEEKEND",
        "HOURLY"
      ]),
      pricePerHour: z.number().positive(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Проверяем, не существует ли уже такой тариф
    const existing = await ctx.db.pricingRule.findFirst({
      where: {
        clubId: input.clubId,
        seatType: input.seatType,
        period: input.period,
      },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Тариф "${periodLabel[input.period]}" для ${seatTypeLabel[input.seatType]} уже существует`,
      });
    }

    return ctx.db.pricingRule.create({
      data: {
        clubId: input.clubId,
        seatType: input.seatType,
        period: input.period,
        pricePerHour: input.pricePerHour,
      },
    });
  }),

  // Обновление тарифа (включая название периода)
  updatePricingRule: publicProcedure
    .input(
      z.object({
        ruleId: z.string().uuid(),
        pricePerHour: z.number().positive(),
        period: z.enum([
          "MORNING", "DAY", "EVENING",
          "PACK_3H", "PACK_5H", 
          "NIGHT_WEEKDAY", "NIGHT_WEEKEND",
          "HOURLY"
        ]).optional(),
        seatType: z.enum(["PC", "PS"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = { pricePerHour: input.pricePerHour };
      if (input.period) updateData.period = input.period;
      if (input.seatType) updateData.seatType = input.seatType;

      return ctx.db.pricingRule.update({
        where: { id: input.ruleId },
        data: updateData,
      });
    }),

  // Удаление тарифа
  deletePricingRule: publicProcedure
    .input(z.object({ ruleId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pricingRule.delete({
        where: { id: input.ruleId },
      });
    }),

  // Получить все возможные периоды
  getAvailablePeriods: publicProcedure.query(async () => {
    return {
      PC: ["MORNING", "DAY", "EVENING", "PACK_3H", "PACK_5H", "NIGHT_WEEKDAY", "NIGHT_WEEKEND"],
      PS: ["HOURLY", "NIGHT_WEEKDAY", "NIGHT_WEEKEND"],
    };
  }),

  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Активные бронирования (подтвержденные и не завершенные)
    // Используем endsAt вместо endTime
    const activeBookings = await ctx.db.booking.count({
      where: {
        status: "CONFIRMED",
        endsAt: { gt: now }, // Исправлено: endsAt
      },
    });

    // Бронирования на сегодня
    // Используем startsAt вместо startTime
    const todayBookings = await ctx.db.booking.count({
      where: {
        startsAt: { gte: today, lt: tomorrow }, // Исправлено: startsAt
      },
    });

    // Статистика по местам
    const totalSeats = await ctx.db.seat.count();
    const blockedSeats = await ctx.db.seat.count({ where: { isBlocked: true } });

    // Последние 5 бронирований
    const recentBookings = await ctx.db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        seat: {
          include: {
            hall: {
              include: {
                club: true,
              },
            },
          },
        },
      },
    });

    return {
      activeBookings,
      todayBookings,
      totalSeats,
      blockedSeats,
      availableSeats: totalSeats - blockedSeats,
      recentBookings,
    };
  }),
});