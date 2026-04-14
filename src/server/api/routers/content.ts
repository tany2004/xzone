import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const blocks = await ctx.db.contentBlock.findMany();
    // Превращаем массив в объект { key: value }
    return Object.fromEntries(blocks.map((b) => [b.key, b.value]));
  }),
});