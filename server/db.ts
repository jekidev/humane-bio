import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, and, avg } from 'drizzle-orm';
import { InsertUser, InsertProduct, users, products, orders, orderItems, chatHistory, adminSettings, cart, reviews } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Products
export async function getProducts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return db.select().from(products).where(eq(products.active, 'true' as any));
  }
  return db.select().from(products).where(eq(products.active, 'true' as any));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Orders
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order.length) return undefined;
  
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...order[0], items };
}

// Chat History
export async function getChatHistory(userId?: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  if (userId) {
    return db.select().from(chatHistory).where(eq(chatHistory.userId, userId)).orderBy(chatHistory.createdAt).limit(limit);
  }
  return db.select().from(chatHistory).orderBy(chatHistory.createdAt).limit(limit);
}

// Admin Settings
export async function getAdminSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminSettings).where(eq(adminSettings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : undefined;
}

export async function setAdminSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(adminSettings).values({ key, value }).onDuplicateKeyUpdate({
      set: { value },
    });
    return true;
  } catch (error) {
    console.error('[Database] Failed to set admin setting:', error);
    return false;
  }
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(products).set(data).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error('[Database] Failed to update product:', error);
    return false;
  }
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    const result = await db.insert(products).values(data);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create product:', error);
    return undefined;
  }
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to update order status:', error);
    return false;
  }
}

export async function getAllChatHistory(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatHistory).orderBy(desc(chatHistory.createdAt)).limit(limit);
}

// Cart functions
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cart).where(eq(cart.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    const existing = await db.select().from(cart).where(
      and(eq(cart.userId, userId), eq(cart.productId, productId))
    ).limit(1);
    
    if (existing.length > 0) {
      await db.update(cart).set({
        quantity: existing[0].quantity + quantity,
        updatedAt: new Date(),
      }).where(eq(cart.id, existing[0].id));
    } else {
      await db.insert(cart).values({ userId, productId, quantity });
    }
    return true;
  } catch (error) {
    console.error('[Database] Failed to add to cart:', error);
    return false;
  }
}

export async function updateCartItem(cartId: number, quantity: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    if (quantity <= 0) {
      await db.delete(cart).where(eq(cart.id, cartId));
    } else {
      await db.update(cart).set({ quantity, updatedAt: new Date() }).where(eq(cart.id, cartId));
    }
    return true;
  } catch (error) {
    console.error('[Database] Failed to update cart item:', error);
    return false;
  }
}

export async function removeFromCart(cartId: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(cart).where(eq(cart.id, cartId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to remove from cart:', error);
    return false;
  }
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(cart).where(eq(cart.userId, userId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to clear cart:', error);
    return false;
  }
}

export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    const result = await db.insert(orders).values(data);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create order:', error);
    return undefined;
  }
}

export async function addOrderItems(orderId: number, items: any[]) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(orderItems).values(
      items.map(item => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      }))
    );
    return true;
  } catch (error) {
    console.error('[Database] Failed to add order items:', error);
    return false;
  }
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to update user Stripe customer ID:', error);
    return false;
  }
}


// Review functions
export async function createReview(data: any) {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    const result = await db.insert(reviews).values(data);
    return result;
  } catch (error) {
    console.error('[Database] Failed to create review:', error);
    return undefined;
  }
}

export async function getProductReviews(productId: number, approvedOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    if (approvedOnly) {
      return db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.approved, 'true'))).orderBy(desc(reviews.createdAt));
    }
    return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('[Database] Failed to get product reviews:', error);
    return [];
  }
}

export async function getProductAverageRating(productId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  try {
    const result = await db.select({ avgRating: avg(reviews.rating) })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.approved, 'true')));
    const avgValue = result[0]?.avgRating ? parseFloat(String(result[0].avgRating)) : 0;
    return avgValue ? Math.round(avgValue * 10) / 10 : 0;
  } catch (error) {
    console.error('[Database] Failed to get average rating:', error);
    return 0;
  }
}

export async function updateReviewApproval(reviewId: number, approved: boolean) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(reviews).set({ approved: approved ? 'true' : 'false' }).where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to update review approval:', error);
    return false;
  }
}

export async function deleteReview(reviewId: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error('[Database] Failed to delete review:', error);
    return false;
  }
}

export async function getAllPendingReviews() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return db.select().from(reviews).where(eq(reviews.approved, 'false')).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('[Database] Failed to get pending reviews:', error);
    return [];
  }
}
