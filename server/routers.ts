import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { chatHistory, newsletterSubscribers } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { getAllProducts, updateProduct, createProduct, getAllOrders, updateOrderStatus, getAllChatHistory, getAdminSetting, setAdminSetting, getCartItems, addToCart, removeFromCart, clearCart, getProductById, createReview, getProductReviews, getProductAverageRating, updateReviewApproval, deleteReview, getAllPendingReviews } from "./db";
import { createCheckoutSession } from "./stripe";
import { TRPCError } from "@trpc/server";
import { uploadProductImage, validateImageFile } from "./product-upload";

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

        const assistantMessage = response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        if (db && userId) {
          await db.insert(chatHistory).values({
            userId: userId,
            role: 'assistant',
            content: assistantMessage,
          } as any);
        }

        return {
          message: assistantMessage,
        };
      }),

    subscribeNewsletter: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        try {
          await db.insert(newsletterSubscribers).values({ email: input.email });
          return { success: true, message: 'Successfully subscribed to newsletter!' };
        } catch (error: any) {
          if (error?.message?.includes('Duplicate')) {
            return { success: false, message: 'Email already subscribed' };
          }
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return getAllProducts();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),
  }),

  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return getCartItems(ctx.user!.id);
    }),

    addItem: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const success = await addToCart(ctx.user!.id, input.productId, input.quantity);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ cartId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await removeFromCart(input.cartId);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const success = await clearCart(ctx.user!.id);
      if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return { success: true };
    }),

    checkout: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.number(),
        })),
        successUrl: z.string(),
        cancelUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const session = await createCheckoutSession(
            ctx.user!.id,
            ctx.user!.email || '',
            ctx.user!.name || 'Customer',
            input.items,
            input.successUrl,
            input.cancelUrl
          );
          if (!session?.url) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
          return { sessionUrl: session.url };
        } catch (error) {
          console.error('[Checkout] Error:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
      }),
  }),

  admin: router({
    // Product management
    getProducts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAllProducts();
    }),

    createProduct: protectedProcedure
      .input(z.object({
        name: z.string(),
        category: z.enum(['nootropic', 'peptide']),
        description: z.string().optional(),
        price: z.number().min(0),
        image: z.string().optional(),
        scientificLinks: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const result = await createProduct(input as any);
        if (!result) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    uploadProductImage: protectedProcedure
      .input(z.object({
        productId: z.number(),
        fileName: z.string(),
        mimeType: z.string(),
        fileData: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

        try {
          const fileBuffer = Buffer.from(input.fileData, 'base64');
          const isValid = await validateImageFile(fileBuffer, input.mimeType);
          if (!isValid) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid image file' });
          }

          const result = await uploadProductImage(
            input.productId,
            fileBuffer,
            input.fileName,
            input.mimeType
          );

          if (!result) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
          }

          const updateSuccess = await updateProduct(input.productId, { image: result.url });
          if (!updateSuccess) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update product' });
          }

          return {
            success: true,
            url: result.url,
            key: result.key,
          };
        } catch (error) {
          console.error('[Upload] Error:', error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
      }),

    updateProduct: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.enum(['nootropic', 'peptide']).optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        image: z.string().optional(),
        scientificLinks: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...updates } = input;
        const success = await updateProduct(id, updates as any);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    updateProductPrice: protectedProcedure
      .input(z.object({
        productId: z.number(),
        price: z.number().min(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const success = await updateProduct(input.productId, { price: input.price });
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
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

    // Review management
    getPendingReviews: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAllPendingReviews();
    }),

    approveReview: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        approved: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const success = await updateReviewApproval(input.reviewId, input.approved);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),

    deleteReview: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const success = await deleteReview(input.reviewId);
        if (!success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true };
      }),
  }),

  reviews: router({
    submitReview: publicProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().min(1).max(255),
        content: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await createReview({
            productId: input.productId,
            userId: ctx.user?.id || null,
            rating: input.rating,
            title: input.title,
            content: input.content,
            verified: ctx.user?.id ? 'false' : 'false',
            approved: 'false',
          });
          if (!result) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
          return { success: true, message: 'Review submitted for moderation' };
        } catch (error) {
          console.error('[Reviews] Error submitting review:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
      }),

    getProductReviews: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return getProductReviews(input.productId, true);
      }),

    getProductRating: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const avgRating = await getProductAverageRating(input.productId);
        const reviews = await getProductReviews(input.productId, true);
        return {
          averageRating: avgRating,
          totalReviews: reviews.length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
