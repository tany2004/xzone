import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { clubRouter } from "~/server/api/routers/club";
import { bookingRouter } from "~/server/api/routers/booking";
import { pricingRouter } from "./routers/pricing";
import { adminRouter } from "~/server/api/routers/admin";
import { blacklistRouter } from "./routers/blacklist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  club: clubRouter,
  booking: bookingRouter,
  pricing: pricingRouter,
  admin: adminRouter,
  blacklist: blacklistRouter,
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
