import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Генерация короткого кода брони — например "ABC-4821"
function generateBookingCode(): string {
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

export const bookingRouter = createTRPCRouter({
  // Создать бронь
  create: publicProcedure
    .input(
      z.object({
        seatId: z.string().uuid(),
        clientName: z.string().min(2).max(100),
        clientPhone: z.string().min(10).max(20),
        startsAt: z.date(),
        endsAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Проверяем что место существует и не заблокировано
      const seat = await ctx.db.seat.findUnique({
        where: { id: input.seatId },
      });

      if (!seat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Место не найдено",
        });
      }

      if (seat.isBlocked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Место недоступно для бронирования",
        });
      }

      // Проверяем пересечение с существующими бронями
      const conflict = await ctx.db.booking.findFirst({
        where: {
          seatId: input.seatId,
          status: { in: ["PENDING", "CONFIRMED"] },
          AND: [
            { startsAt: { lt: input.endsAt } },
            { endsAt: { gt: input.startsAt } },
          ],
        },
      });

      if (conflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Место уже занято на это время",
        });
      }

      // Создаём бронь
      const booking = await ctx.db.booking.create({
        data: {
          seatId: input.seatId,
          bookingCode: generateBookingCode(),
          clientName: input.clientName,
          clientPhone: input.clientPhone,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
        },
      });

      return {
        bookingCode: booking.bookingCode,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
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
});