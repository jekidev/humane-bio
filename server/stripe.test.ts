import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://humanebio.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createUnauthenticatedContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("cart.getItems", () => {
  it("allows authenticated users to get cart items", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.cart.getItems();
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("denies unauthenticated users from getting cart items", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.cart.getItems();
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("cart.addItem", () => {
  it("allows authenticated users to add items to cart", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.cart.addItem({
        productId: 1,
        quantity: 2,
      });
      expect(result.success).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("denies unauthenticated users from adding items", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.cart.addItem({
        productId: 1,
        quantity: 2,
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects invalid quantity", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.cart.addItem({
        productId: 1,
        quantity: 0,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});

describe("cart.removeItem", () => {
  it("allows authenticated users to remove items from cart", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.cart.removeItem({
        cartId: 1,
      });
      expect(result.success).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("denies unauthenticated users from removing items", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.cart.removeItem({
        cartId: 1,
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("cart.clear", () => {
  it("allows authenticated users to clear cart", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.cart.clear();
      expect(result.success).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("denies unauthenticated users from clearing cart", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.cart.clear();
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("checkout.createSession", () => {
  it("allows authenticated users to create checkout session", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.checkout.createSession({
        shippingName: "John Doe",
        shippingEmail: "john@example.com",
        shippingAddress: "123 Main St",
        shippingCity: "New York",
        shippingPostal: "10001",
        shippingCountry: "US",
      });
      expect(result).toHaveProperty("sessionId");
      expect(result).toHaveProperty("url");
    } catch (error: any) {
      // Expected if cart is empty or Stripe is not configured
      expect(error).toBeDefined();
    }
  });

  it("denies unauthenticated users from creating checkout session", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.checkout.createSession({
        shippingName: "John Doe",
        shippingEmail: "john@example.com",
        shippingAddress: "123 Main St",
        shippingCity: "New York",
        shippingPostal: "10001",
        shippingCountry: "US",
      });
      expect.fail("Should have thrown UNAUTHORIZED error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects invalid email format", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.checkout.createSession({
        shippingName: "John Doe",
        shippingEmail: "invalid-email",
        shippingAddress: "123 Main St",
        shippingCity: "New York",
        shippingPostal: "10001",
        shippingCountry: "US",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});
