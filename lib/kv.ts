import { kv as vercelKv } from "@vercel/kv";

type MemoryStore = Map<string, { value: unknown; expires?: number }>;

const memory: MemoryStore = new Map();

function memoryGet<T>(key: string): T | null {
  const row = memory.get(key);
  if (!row) return null;
  if (row.expires && Date.now() > row.expires) {
    memory.delete(key);
    return null;
  }
  return row.value as T;
}

function memorySet(key: string, value: unknown, exSeconds?: number) {
  memory.set(key, {
    value,
    expires: exSeconds ? Date.now() + exSeconds * 1000 : undefined,
  });
}

const hasKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

/** Serverless KV with in-memory fallback for local/dev without Vercel KV. */
export const kv = {
  async get<T>(key: string): Promise<T | null> {
    if (!hasKv) return memoryGet<T>(key);
    return vercelKv.get<T>(key);
  },
  async set(key: string, value: unknown, opts?: { ex?: number; nx?: boolean }) {
    if (!hasKv) {
      if (opts?.nx && memoryGet(key) != null) return false;
      memorySet(key, value, opts?.ex);
      return true;
    }
    if (opts?.nx) {
      const result =
        opts.ex != null
          ? await vercelKv.set(key, value, { nx: true, ex: opts.ex })
          : await vercelKv.set(key, value, { nx: true });
      return result === "OK";
    }
    if (opts?.ex) await vercelKv.set(key, value, { ex: opts.ex });
    else await vercelKv.set(key, value);
    return true;
  },
  async incr(key: string) {
    if (!hasKv) {
      const n = (memoryGet<number>(key) ?? 0) + 1;
      memorySet(key, n);
      return n;
    }
    return vercelKv.incr(key);
  },
  async del(key: string) {
    if (!hasKv) {
      memory.delete(key);
      return;
    }
    await vercelKv.del(key);
  },
};

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ ok: boolean; remaining: number }> {
  const bucket = `rl:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  const count = await kv.incr(bucket);
  if (count === 1) await kv.set(bucket, count, { ex: windowSeconds });
  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}

/** Soft counter used by older call sites. Prefer acquireVariantLocks for checkout. */
export async function lockInventory(
  variantId: string,
  quantity: number,
  ttlSeconds = 120,
): Promise<boolean> {
  const key = `invlock:${variantId}`;
  const current = (await kv.get<number>(key)) ?? 0;
  await kv.set(key, current + quantity, { ex: ttlSeconds });
  return true;
}

export async function releaseInventoryLock(variantId: string, quantity: number) {
  const key = `invlock:${variantId}`;
  const current = (await kv.get<number>(key)) ?? 0;
  const next = Math.max(0, current - quantity);
  if (next === 0) await kv.del(key);
  else await kv.set(key, next, { ex: 120 });
}

/**
 * Acquire exclusive NX locks for a set of variants (checkout race guard).
 * Releases any acquired locks if one fails.
 */
export async function acquireVariantLocks(
  variantIds: string[],
  ttlSeconds = 120,
): Promise<boolean> {
  const unique = Array.from(new Set(variantIds));
  const locked: string[] = [];

  for (const id of unique) {
    const key = `checkout:lock:${id}`;
    const ok = await kv.set(key, "1", { nx: true, ex: ttlSeconds });
    if (!ok) {
      await releaseVariantLocks(locked);
      return false;
    }
    locked.push(id);
  }
  return true;
}

export async function releaseVariantLocks(variantIds: string[]) {
  const unique = Array.from(new Set(variantIds));
  await Promise.all(unique.map((id) => kv.del(`checkout:lock:${id}`)));
}
