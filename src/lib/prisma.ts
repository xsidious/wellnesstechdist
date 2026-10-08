import { PrismaClient } from "@prisma/client";

function connectionString() {
  const raw = (process.env["DATABASE_URL"] || "").trim();
  if (!raw.startsWith("postgres")) return "";
  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    url.searchParams.set("schema", "wtdist");
    if (!url.searchParams.has("sslmode")) url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch {
    return "";
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = connectionString();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
