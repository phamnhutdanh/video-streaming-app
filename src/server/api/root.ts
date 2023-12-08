import { createTRPCRouter } from "~/server/api/trpc";
import { videoRouter } from "./routers/video";
import { userRouter } from "./routers/user";
import { commentRouter } from "./routers/comment";
import { videoEngagementRouter } from "./routers/videoEngagement";
import { playlistRouter } from "./routers/playlist";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  video: videoRouter,
  comment: commentRouter,
  videoEngagement: videoEngagementRouter,
  playlist: playlistRouter,
 
});

// export type definition of API
export type AppRouter = typeof appRouter;