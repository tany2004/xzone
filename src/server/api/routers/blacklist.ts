import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const blacklistRouter = createTRPCRouter({
  /** Получить весь чёрный список (с пагинацией) */
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search } = input;
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { clientName: { contains: search, mode: "insensitive" as const } },
              { clientPhone: { contains: search } },
            ],
          }
        : {};

      const [items, total] = await Promise.all([
        ctx.db.blacklist.findMany({
          where,
          skip,
          take: limit,
          orderBy: { addedAt: "desc" },
          include: { admin: { select: { login: true } } },
        }),
        ctx.db.blacklist.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  /** Проверить, есть ли номер в чёрном списке */
  checkPhone: protectedProcedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ ctx, input }) => {
      const entry = await ctx.db.blacklist.findUnique({
        where: { clientPhone: input.phone },
      });
      return { isBlacklisted: !!entry, entry };
    }),

  /** Добавить клиента или увеличить счётчик неявок */
  addOrIncrement: protectedProcedure
    .input(
      z.object({
        clientPhone: z.string().min(7, "Введите корректный номер"),
        clientName: z.string().min(2, "Введите имя клиента"),
        reason: z.string().optional(),
        noShowCount: z.number().min(1).max(99).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adminId = ctx.admin.id;

      const existing = await ctx.db.blacklist.findUnique({
        where: { clientPhone: input.clientPhone },
      });

      if (existing) {
        // Клиент уже в списке — увеличиваем счётчик и обновляем причину
        return ctx.db.blacklist.update({
          where: { clientPhone: input.clientPhone },
          data: {
            noShowCount: { increment: input.noShowCount },
            reason: input.reason ?? existing.reason,
            addedBy: adminId,
          },
        });
      }

      return ctx.db.blacklist.create({
        data: {
          clientPhone: input.clientPhone,
          clientName: input.clientName,
          reason: input.reason,
          noShowCount: input.noShowCount,
          addedBy: adminId,
        },
      });
    }),

  /** Удалить из чёрного списка */
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.blacklist.findUnique({
        where: { id: input.id },
      });
      if (!entry) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.blacklist.delete({ where: { id: input.id } });
    }),

  /** Добавить из существующей брони (по bookingId) */
  addFromBooking: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        reason: z.string().optional(),
        noShowCount: z.number().min(1).max(99).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Бронь не найдена" });

      const adminId = ctx.admin.id;
      const existing = await ctx.db.blacklist.findUnique({
        where: { clientPhone: booking.clientPhone },
      });

      if (existing) {
        return ctx.db.blacklist.update({
          where: { clientPhone: booking.clientPhone },
          data: {
            noShowCount: { increment: input.noShowCount },
            reason: input.reason ?? existing.reason,
            addedBy: adminId,
          },
        });
      }

      return ctx.db.blacklist.create({
        data: {
          clientPhone: booking.clientPhone,
          clientName: booking.clientName,
          reason: input.reason,
          noShowCount: input.noShowCount,
          addedBy: adminId,
        },
      });
    }),
});