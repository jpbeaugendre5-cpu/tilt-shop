import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addToCart,
  clearCart,
  createOrder,
  getAllCategories,
  getAllOrders,
  getAllProductsAdmin,
  getAiCampaigns,
  getCartItems,
  getFeaturedProducts,
  getLatestMetrics,
  getMetricsHistory,
  getOrCreateCart,
  getOrderByNumber,
  getOrderStats,
  getPricingHistory,
  getProductBySlug,
  getProductById,
  getProductCount,
  getProducts,
  getUserFavorites,
  getUserOrders,
  getValidationQueue,
  reviewValidationItem,
  toggleFavorite,
  updateCampaignStatus,
  upsertProduct,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux administrateurs" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Categories ────────────────────────────────────────────────────────────
  categories: router({
    list: publicProcedure.query(() => getAllCategories()),
  }),

  // ─── Products ──────────────────────────────────────────────────────────────
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        badge: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(({ input }) => getProducts(input ?? {})),

    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(({ input }) => getFeaturedProducts(input?.limit)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getProductBySlug(input.slug)),

    count: publicProcedure.query(() => getProductCount()),

    recommendations: publicProcedure
      .input(z.object({ productId: z.number().optional(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const all = await getProducts({ limit: 20 });
        const filtered = all.filter((p) => p.id !== input.productId);
        return filtered.sort(() => Math.random() - 0.5).slice(0, input.limit ?? 4);
      }),
  }),

  // ─── Cart ──────────────────────────────────────────────────────────────────
  cart: router({
    get: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .query(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const c = await getOrCreateCart(userId, input.sessionId);
        const items = await getCartItems(c.id);
        const total = items.reduce((sum, item) => sum + parseFloat(item.priceAtAdd) * item.quantity, 0);
        return { cart: c, items, total: total.toFixed(2) };
      }),

    add: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const c = await getOrCreateCart(userId, input.sessionId);
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Produit introuvable" });
        await addToCart(c.id, input.productId, input.quantity, product.price);
        return { success: true, cartId: c.id };
      }),

    updateQuantity: publicProcedure
      .input(z.object({ itemId: z.number(), quantity: z.number() }))
      .mutation(async ({ input }) => {
        const { updateCartItemQuantity } = await import("./db");
        await updateCartItemQuantity(input.itemId, input.quantity);
        return { success: true };
      }),

    clear: publicProcedure
      .input(z.object({ cartId: z.number() }))
      .mutation(async ({ input }) => {
        await clearCart(input.cartId);
        return { success: true };
      }),
  }),

  // ─── Orders ────────────────────────────────────────────────────────────────
  orders: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
        shippingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          phone: z.string(),
          address: z.string(),
          city: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        paymentMethod: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.id;
        const c = await getOrCreateCart(userId, input.sessionId);
        const items = await getCartItems(c.id);
        if (!items.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Panier vide" });
        const total = items.reduce((sum, item) => sum + parseFloat(item.priceAtAdd) * item.quantity, 0);
        const orderNumber = `TILT-${Date.now()}-${nanoid(6).toUpperCase()}`;
        const order = await createOrder({
          userId,
          orderNumber,
          totalAmount: total.toFixed(2),
          shippingAddress: input.shippingAddress,
          paymentMethod: input.paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.priceAtAdd,
            totalPrice: (parseFloat(item.priceAtAdd) * item.quantity).toFixed(2),
          })),
        });
        await clearCart(c.id);
        return { success: true, orderNumber: order.orderNumber };
      }),

    myOrders: protectedProcedure.query(({ ctx }) => getUserOrders(ctx.user.id)),

    byNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(({ input }) => getOrderByNumber(input.orderNumber)),
  }),

  // ─── Favorites ─────────────────────────────────────────────────────────────
  favorites: router({
    list: protectedProcedure.query(({ ctx }) => getUserFavorites(ctx.user.id)),
    toggle: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(({ input, ctx }) => toggleFavorite(ctx.user.id, input.productId)),
  }),

  // ─── AI Chatbot ────────────────────────────────────────────────────────────
  ai: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().max(1000),
        history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
      }))
      .mutation(async ({ input }) => {
        const featuredProducts = await getFeaturedProducts(6);
        const productList = featuredProducts.map((p) => `- ${p.name} (${p.price}€): ${p.shortDescription}`).join("\n");
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Tu es l'assistant shopping IA de TILT.SHOP, une boutique en ligne spécialisée dans les produits innovants et utiles. Ton rôle est d'aider les clients à trouver les meilleurs produits selon leurs besoins.

Voici quelques produits disponibles :
${productList}

Réponds toujours en français, de manière concise, chaleureuse et professionnelle. Si le client cherche un produit, propose-lui des recommandations pertinentes depuis notre catalogue. Mets en avant les avantages innovants de nos produits.`,
            },
            ...(input.history ?? []),
            { role: "user", content: input.message },
          ],
        });
        return { reply: response.choices[0]?.message?.content ?? "Je suis désolé, je ne peux pas répondre pour le moment." };
      }),
  }),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  admin: router({
    dashboard: adminProcedure.query(async () => {
      const [orderStats, productCount, metrics, validationQueue, campaigns] = await Promise.all([
        getOrderStats(),
        getProductCount(),
        getLatestMetrics(),
        getValidationQueue("pending"),
        getAiCampaigns("active"),
      ]);
      return { orderStats, productCount, metrics, pendingValidations: validationQueue.length, activeCampaigns: campaigns.length };
    }),

    metricsHistory: adminProcedure
      .input(z.object({ days: z.number().optional() }))
      .query(({ input }) => getMetricsHistory(input.days)),

    orders: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(({ input }) => getAllOrders(input.limit)),

    products: router({
      list: adminProcedure.query(() => getAllProductsAdmin()),
      upsert: adminProcedure
        .input(z.object({
          id: z.number().optional(),
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          price: z.string(),
          originalPrice: z.string().optional(),
          categoryId: z.number().optional(),
          imageUrl: z.string().optional(),
          stock: z.number().optional(),
          badge: z.enum(["innovation", "tendance", "bestseller", "nouveau", "promo"]).optional(),
          isActive: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
        }))
        .mutation(({ input }) => upsertProduct(input)),
    }),

    campaigns: router({
      list: adminProcedure
        .input(z.object({ status: z.string().optional() }))
        .query(({ input }) => getAiCampaigns(input.status)),
      updateStatus: adminProcedure
        .input(z.object({ id: z.number(), status: z.string() }))
        .mutation(({ input }) => updateCampaignStatus(input.id, input.status)),
      generate: adminProcedure
        .input(z.object({ objective: z.string(), budget: z.number(), targetAudience: z.string() }))
        .mutation(async ({ input }) => {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Tu es un expert en marketing digital et publicité IA pour une boutique e-commerce de produits innovants. Génère des campagnes publicitaires optimisées en JSON." },
              { role: "user", content: `Génère une campagne publicitaire pour : Objectif: ${input.objective}, Budget: ${input.budget}€, Audience: ${input.targetAudience}. Retourne un JSON avec: name, type (display/search/social/email/retargeting), targetAudience (array), estimatedCtr, estimatedRoi, description.` },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "campaign",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    targetAudience: { type: "array", items: { type: "string" } },
                    estimatedCtr: { type: "number" },
                    estimatedRoi: { type: "number" },
                    description: { type: "string" },
                  },
                  required: ["name", "type", "targetAudience", "estimatedCtr", "estimatedRoi", "description"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = response.choices[0]?.message?.content;
          return JSON.parse(typeof content === "string" ? content : "{}");
        }),
    }),

    validation: router({
      queue: adminProcedure
        .input(z.object({ status: z.string().optional() }))
        .query(({ input }) => getValidationQueue(input.status ?? "pending")),
      review: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["approved", "rejected"]),
          note: z.string().optional(),
        }))
        .mutation(({ input, ctx }) => reviewValidationItem(input.id, input.status, ctx.user.id, input.note)),
    }),

    pricing: router({
      history: adminProcedure
        .input(z.object({ productId: z.number().optional() }))
        .query(({ input }) => getPricingHistory(input.productId)),
      analyze: adminProcedure
        .input(z.object({ productId: z.number() }))
        .mutation(async ({ input }) => {
          const product = await getProductById(input.productId);
          if (!product) throw new TRPCError({ code: "NOT_FOUND" });
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Tu es un expert en pricing dynamique pour e-commerce. Analyse le produit et propose un ajustement de prix optimisé." },
              { role: "user", content: `Analyse ce produit et propose un prix optimal: ${product.name}, Prix actuel: ${product.price}€, Stock: ${product.stock}, Score IA: ${product.aiScore}. Retourne un JSON avec: suggestedPrice, confidence, reason, demandFactor, competitorFactor.` },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "pricing",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    suggestedPrice: { type: "number" },
                    confidence: { type: "number" },
                    reason: { type: "string" },
                    demandFactor: { type: "number" },
                    competitorFactor: { type: "number" },
                  },
                  required: ["suggestedPrice", "confidence", "reason", "demandFactor", "competitorFactor"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = response.choices[0]?.message?.content;
          return JSON.parse(typeof content === "string" ? content : "{}");
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
