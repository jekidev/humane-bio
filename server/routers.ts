import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { chatHistory, newsletterSubscribers } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
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

  chat: router({
    sendMessage: publicProcedure
      .input(z.object({ message: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        const userId = ctx.user?.id;

        if (db && userId) {
          await db.insert(chatHistory).values({
            userId: userId,
            role: 'user',
            content: input.message,
          } as any);
        }

        const systemPrompt = "You are HumaneBio's AI assistant. Help users find the perfect nootropic or peptide stack based on their goals. Provide scientifically-backed recommendations. Be professional, helpful, and safety-conscious.";

        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input.message },
          ],
        });

        const assistantMessage = typeof response.choices[0]?.message?.content === 'string' 
          ? response.choices[0].message.content 
          : 'Unable to generate response';

        if (db && userId) {
          await db.insert(chatHistory).values({
            userId: userId,
            role: 'assistant',
            content: assistantMessage,
          } as any);
        }

        return { content: assistantMessage };
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database unavailable');

        try {
          await db.insert(newsletterSubscribers).values({
            email: input.email,
          });
          return { success: true };
        } catch (error) {
          return { success: true };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
