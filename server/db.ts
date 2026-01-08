import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertProduct, users, products, orders, orderItems, chatHistory, adminSettings } from "../drizzle/schema";
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
