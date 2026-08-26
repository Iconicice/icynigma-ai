import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { updateUserAvatar } from "./db";
import { z } from "zod";
import { assistantRouter } from "./routers/assistant";

const VALID_AVATAR_KEYS = ["dark-anime-01", "dark-anime-02", "alien-01", "alien-02", "lost-astronaut-01", "lost-astronaut-02", "robot-android-01", "robot-android-02"] as const;

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  assistant: assistantRouter,
  profile: router({
    avatar: protectedProcedure.query(({ ctx }) => ({ avatarKey: ctx.user.avatarKey ?? null })),
    setAvatar: protectedProcedure.input(z.object({ avatarKey: z.enum(VALID_AVATAR_KEYS) })).mutation(async ({ ctx, input }) => {
      return updateUserAvatar(ctx.user.openId, input.avatarKey);
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
