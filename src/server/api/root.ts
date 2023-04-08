import { createTRPCRouter } from "~/server/api/trpc";
import { mountainsRouter } from "./routers/mountains";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  mountains: mountainsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
