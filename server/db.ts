import { and, desc, eq, ilike, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  AiCampaign,
  AiMetric,
  AiPricingHistory,
  AiValidationItem,
  Cart,
  CartItem,
  Category,
  InsertUser,
  Order,
  OrderItem,
  Product,
  aiCampaigns,
  aiMetrics,
  aiPricingHistory,
  aiValidationQueue,
  cart,
  cartItems,
  categories,
  favorites,
  orderItems,
  orders,
  products,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(opts: {
  categoryId?: number;
  search?: string;
  badge?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(products.isActive, true)];
  if (opts.categoryId) conditions.push(eq(products.categoryId, opts.categoryId));
  if (opts.badge) conditions.push(eq(products.badge, opts.badge as any));
  if (opts.featured) conditions.push(eq(products.isFeatured, true));
  if (opts.search) {
    conditions.push(
      or(
        like(products.name, `%${opts.search}%`),
        like(products.shortDescription, `%${opts.search}%`)
      )!
    );
  }
  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.aiScore), desc(products.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.aiScore))
    .limit(limit);
}

export async function getProductCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.isActive, true));
  return result[0]?.count ?? 0;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function getOrCreateCart(userId?: number, sessionId?: string): Promise<Cart> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  let existing;
  if (userId) {
    const r = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    existing = r[0];
  } else if (sessionId) {
    const r = await db.select().from(cart).where(eq(cart.sessionId, sessionId)).limit(1);
    existing = r[0];
  }
  if (existing) return existing;
  const [inserted] = await db.insert(cart).values({ userId, sessionId }).$returningId();
  const newCart = await db.select().from(cart).where(eq(cart.id, inserted.id)).limit(1);
  return newCart[0];
}

export async function getCartItems(cartId: number): Promise<(CartItem & { product: Product })[]> {
  const db = await getDb();
  if (!db) return [];
  const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  const result: (CartItem & { product: Product })[] = [];
  for (const item of items) {
    const prod = await getProductById(item.productId);
    if (prod) result.push({ ...item, product: prod });
  }
  return result;
}

export async function addToCart(cartId: number, productId: number, quantity: number, price: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))).limit(1);
  if (existing[0]) {
    await db.update(cartItems).set({ quantity: existing[0].quantity + quantity }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ cartId, productId, quantity, priceAtAdd: price });
  }
}

export async function updateCartItemQuantity(itemId: number, quantity: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  }
}

export async function clearCart(cartId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(data: {
  userId?: number;
  orderNumber: string;
  totalAmount: string;
  shippingAddress: any;
  paymentMethod: string;
  items: { productId: number; productName: string; quantity: number; unitPrice: string; totalPrice: string }[];
}): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [inserted] = await db.insert(orders).values({
    userId: data.userId,
    orderNumber: data.orderNumber,
    totalAmount: data.totalAmount,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    status: "confirmed",
    paymentStatus: "paid",
  }).$returningId();
  for (const item of data.items) {
    await db.insert(orderItems).values({ orderId: inserted.id, ...item });
  }
  const newOrder = await db.select().from(orders).where(eq(orders.id, inserted.id)).limit(1);
  return newOrder[0];
}

export async function getUserOrders(userId: number): Promise<(Order & { items: OrderItem[] })[]> {
  const db = await getDb();
  if (!db) return [];
  const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  const result: (Order & { items: OrderItem[] })[] = [];
  for (const order of userOrders) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    result.push({ ...order, items });
  }
  return result;
}

export async function getOrderByNumber(orderNumber: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!result[0]) return undefined;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, result[0].id));
  return { ...result[0], items };
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export async function getUserFavorites(userId: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  const favs = await db.select().from(favorites).where(eq(favorites.userId, userId));
  if (!favs.length) return [];
  const ids = favs.map((f) => f.productId);
  return db.select().from(products).where(inArray(products.id, ids));
}

export async function toggleFavorite(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.productId, productId))).limit(1);
  if (existing[0]) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return false;
  } else {
    await db.insert(favorites).values({ userId, productId });
    return true;
  }
}

// ─── AI Campaigns ────────────────────────────────────────────────────────────

export async function getAiCampaigns(status?: string): Promise<AiCampaign[]> {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(aiCampaigns).where(eq(aiCampaigns.status, status as any)).orderBy(desc(aiCampaigns.createdAt));
  }
  return db.select().from(aiCampaigns).orderBy(desc(aiCampaigns.createdAt));
}

export async function updateCampaignStatus(id: number, status: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(aiCampaigns).set({ status: status as any }).where(eq(aiCampaigns.id, id));
}

// ─── AI Pricing ──────────────────────────────────────────────────────────────

export async function getPricingHistory(productId?: number): Promise<(AiPricingHistory & { productName?: string })[]> {
  const db = await getDb();
  if (!db) return [];
  let history;
  if (productId) {
    history = await db.select().from(aiPricingHistory).where(eq(aiPricingHistory.productId, productId)).orderBy(desc(aiPricingHistory.createdAt)).limit(50);
  } else {
    history = await db.select().from(aiPricingHistory).orderBy(desc(aiPricingHistory.createdAt)).limit(50);
  }
  const result: (AiPricingHistory & { productName?: string })[] = [];
  for (const h of history) {
    const prod = await getProductById(h.productId);
    result.push({ ...h, productName: prod?.name });
  }
  return result;
}

// ─── AI Validation Queue ─────────────────────────────────────────────────────

export async function getValidationQueue(status = "pending"): Promise<AiValidationItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiValidationQueue).where(eq(aiValidationQueue.status, status as any)).orderBy(desc(aiValidationQueue.createdAt));
}

export async function reviewValidationItem(id: number, status: "approved" | "rejected", reviewedBy: number, note?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(aiValidationQueue).set({
    status,
    reviewedBy,
    reviewNote: note,
    reviewedAt: new Date(),
  }).where(eq(aiValidationQueue.id, id));
}

// ─── AI Metrics ──────────────────────────────────────────────────────────────

export async function getLatestMetrics(): Promise<AiMetric | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aiMetrics).orderBy(desc(aiMetrics.createdAt)).limit(1);
  return result[0];
}

export async function getMetricsHistory(days = 30): Promise<AiMetric[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiMetrics).orderBy(desc(aiMetrics.createdAt)).limit(days);
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function getAllOrders(limit = 50): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getOrderStats(): Promise<{ total: number; revenue: string; pending: number }> {
  const db = await getDb();
  if (!db) return { total: 0, revenue: "0", pending: 0 };
  const totalResult = await db.select({ count: sql<number>`count(*)`, revenue: sql<string>`COALESCE(SUM(totalAmount), 0)` }).from(orders);
  const pendingResult = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "pending"));
  return {
    total: totalResult[0]?.count ?? 0,
    revenue: totalResult[0]?.revenue ?? "0",
    pending: pendingResult[0]?.count ?? 0,
  };
}

export async function upsertProduct(data: any): Promise<void> {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(products).set(data).where(eq(products.id, data.id));
  } else {
    await db.insert(products).values(data);
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(desc(products.createdAt));
}
