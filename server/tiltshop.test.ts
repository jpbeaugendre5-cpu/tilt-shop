import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@tilt.shop",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("TILT.SHOP — Auth", () => {
  it("auth.me retourne null pour un utilisateur non connecté", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("auth.me retourne l'utilisateur connecté", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@tilt.shop");
    expect(result?.role).toBe("user");
  });

  it("auth.logout efface le cookie de session", async () => {
    const cleared: string[] = [];
    const ctx: TrpcContext = {
      ...makeCtx(),
      res: {
        clearCookie: (name: string) => cleared.push(name),
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(cleared.length).toBe(1);
  });
});

describe("TILT.SHOP — Catalogue public", () => {
  it("products.featured retourne un tableau (même vide)", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.products.featured({ limit: 8 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("products.list retourne un tableau", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.products.list({ limit: 12 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("categories.list retourne un tableau", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.categories.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("TILT.SHOP — Panier", () => {
  it("cart.get retourne un objet avec items pour une session anonyme", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.cart.get({ sessionId: "test-session-123" });
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe("string");
  });
});

describe("TILT.SHOP — Admin protection", () => {
  it("admin.dashboard est accessible pour un admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.dashboard();
    expect(result).toBeDefined();
    expect(typeof result.pendingValidations).toBe("number");
    expect(typeof result.activeCampaigns).toBe("number");
    expect(typeof result.productCount).toBe("number");
  });

  it("admin.dashboard est refusé pour un utilisateur standard", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.dashboard()).rejects.toThrow();
  });
});

describe("TILT.SHOP — IA Chat", () => {
  it("ai.chat retourne une réponse avec un champ reply", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.ai.chat({
      message: "Quels sont vos meilleurs produits ?",
      history: [],
    });
    expect(result).toBeDefined();
    expect(result.reply).toBeDefined();
  }, 30000);
});
