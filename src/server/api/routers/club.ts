import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const clubRouter = createTRPCRouter({
  // Все клубы — для переключателя на странице бронирования
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.club.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // Залы конкретного клуба
  getHalls: publicProcedure
    .input(z.object({ clubId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.hall.findMany({
        where: { clubId: input.clubId },
        orderBy: { name: "asc" },
      });
    }),

  // Места зала с их статусом на выбранный временной слот
  getSeats: publicProcedure
    .input(
      z.object({
        hallId: z.string().uuid(),
        startsAt: z.date(),
        endsAt: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const seats = await ctx.db.seat.findMany({
        where: { hallId: input.hallId },
        include: {
          bookings: {
            where: {
              status: { in: ["PENDING", "CONFIRMED"] },
              // Проверяем пересечение временных диапазонов
              AND: [
                { startsAt: { lt: input.endsAt } },
                { endsAt: { gt: input.startsAt } },
              ],
            },
          },
        },
        orderBy: { label: "asc" },
      });

      // Возвращаем места с вычисленным статусом
      return seats.map((seat) => ({
        id: seat.id,
        label: seat.label,
        seatType: seat.seatType,
        // Место недоступно если заблокировано или есть активная бронь
        isAvailable: !seat.isBlocked && seat.bookings.length === 0,
        isBlocked: seat.isBlocked,
      }));
    }),

    // Все места клуба с их статусами (для карты)
getSeatsForClub: publicProcedure
  .input(
    z.object({
      clubId: z.string().uuid(),
      startsAt: z.date(),
      endsAt: z.date(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const seats = await ctx.db.seat.findMany({
      where: {
        hall: { clubId: input.clubId },
      },
      include: {
        hall: true,
        bookings: {
          where: {
            status: { in: ["PENDING", "CONFIRMED"] },
            AND: [
              { startsAt: { lt: input.endsAt } },
              { endsAt: { gt: input.startsAt } },
            ],
          },
        },
      },
    });

    return seats.map((seat) => ({
      id: seat.id,
      label: seat.label,
      seatType: seat.seatType,
      hallName: seat.hall.name,
      isAvailable: !seat.isBlocked && seat.bookings.length === 0,
      isBlocked: seat.isBlocked,
    }));
  }),
});