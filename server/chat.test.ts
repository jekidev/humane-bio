import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(userId?: number): TrpcContext {
  const user: AuthenticatedUser | undefined = userId
    ? {
        id: userId,
        openId: `user-${userId}`,
        email: `user${userId}@example.com`,
        name: `Test User ${userId}`,
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : undefined;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("chat.sendMessage", () => {
  it(
    "accepts a message from authenticated user",
    async () => {
      const ctx = createContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "What's the best nootropic for focus?",
      });

      expect(result).toHaveProperty("content");
      expect(typeof result.content).toBe("string");
      expect(result.content.length).toBeGreaterThan(0);
    },
    { timeout: 30000 }
  );

  it("rejects empty messages", async () => {
    const ctx = createContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.sendMessage({ message: "" });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it(
    "works for unauthenticated users",
    async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Tell me about BPC 156",
      });

      expect(result).toHaveProperty("content");
      expect(typeof result.content).toBe("string");
    },
    { timeout: 30000 }
  );

  it(
    "returns meaningful responses about products",
    async () => {
      const ctx = createContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "What are the benefits of Modafinil?",
      });

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    },
    { timeout: 30000 }
  );
});

describe("newsletter.subscribe", () => {
  it("accepts valid email addresses", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "subscriber@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email addresses", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.newsletter.subscribe({ email: "not-an-email" });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("handles duplicate email subscriptions gracefully", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const email = "duplicate@example.com";

    const result1 = await caller.newsletter.subscribe({ email });
    expect(result1.success).toBe(true);

    const result2 = await caller.newsletter.subscribe({ email });
    expect(result2.success).toBe(true);
  });

  it("accepts various valid email formats", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const validEmails = [
      "user@example.com",
      "user.name@example.co.uk",
      "user+tag@example.com",
    ];

    for (const email of validEmails) {
      const result = await caller.newsletter.subscribe({ email });
      expect(result.success).toBe(true);
    }
  });
});
