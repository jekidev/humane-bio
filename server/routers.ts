import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { chatHistory, newsletterSubscribers } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { getAllProducts, updateProduct, createProduct, getAllOrders, updateOrderStatus, getAllChatHistory, getAdminSetting, setAdminSetting } from "./db";
import { TRPCError } from "@trpc/server";

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

  admin: router({
    // Product management
    getProducts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAllProducts();
    }),

    updateProduct: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        image: z.string().optional(),
        scientificLinks: z.string().optional(),
        active: z.enum(['true', 'false']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        const success = await updateProduct(id, data as any);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    createProduct: protectedProcedure
      .input(z.object({
        name: z.string(),
        category: z.enum(['nootropic', 'peptide']),
        description: z.string().optional(),
        price: z.number(),
        image: z.string().optional(),
        scientificLinks: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const result = await createProduct(input as any);
        if (!result) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    // Order management
    getOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAllOrders();
    }),

    updateOrderStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const success = await updateOrderStatus(input.orderId, input.status);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    // Chat settings
    getChatHistory: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAllChatHistory(100);
    }),

    getLLMSettings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const apiUrl = await getAdminSetting('llm_api_url');
      const prompt = await getAdminSetting('llm_system_prompt');
      return {
        apiUrl: apiUrl || '',
        prompt: prompt || 'You are HumaneBio\'s AI assistant. Help users find the perfect nootropic or peptide stack based on their goals. Provide scientifically-backed recommendations. Be professional, helpful, and safety-conscious.',
      };
    }),

    updateLLMSettings: protectedProcedure
      .input(z.object({
        apiUrl: z.string().optional(),
        prompt: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        if (input.apiUrl) await setAdminSetting('llm_api_url', input.apiUrl);
        if (input.prompt) await setAdminSetting('llm_system_prompt', input.prompt);
        return { success: true };
      }),

    // Contact settings
    getContactSettings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return {
        email: await getAdminSetting('contact_email'),
        discord: await getAdminSetting('contact_discord'),
        telegram: await getAdminSetting('contact_telegram'),
        whatsapp: await getAdminSetting('contact_whatsapp'),
      };
    }),

    updateContactSettings: protectedProcedure
      .input(z.object({
        email: z.string().optional(),
        discord: z.string().optional(),
        telegram: z.string().optional(),
        whatsapp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        if (input.email) await setAdminSetting('contact_email', input.email);
        if (input.discord) await setAdminSetting('contact_discord', input.discord);
        if (input.telegram) await setAdminSetting('contact_telegram', input.telegram);
        if (input.whatsapp) await setAdminSetting('contact_whatsapp', input.whatsapp);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
