import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { clubRouter } from "~/server/api/routers/club";
import { bookingRouter } from "~/server/api/routers/booking";
import { contentRouter } from "~/server/api/routers/content";
import { pricingRouter } from "./routers/pricing";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  club: clubRouter,
  booking: bookingRouter,
  content: contentRouter,
  pricing: pricingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
