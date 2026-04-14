import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pricingRouter = createTRPCRouter({
  getByClub: publicProcedure
    .input(z.object({ clubId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.pricingRule.findMany({
        where: { clubId: input.clubId },
        orderBy: [{ seatType: "asc" }, { period: "asc" }],
      });
    }),
});