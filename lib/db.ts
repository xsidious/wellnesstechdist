import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function shouldUseNeonAdapter(connectionString: string) {
  if (process.env.PRISMA_USE_NEON === "1") return true;
  if (process.env.PRISMA_USE_NEON === "0") return false;
  // Neon serverless driver is for Vercel / Neon hosts — not local Docker Postgres.
  return Boolean(process.env.VERCEL) && /neon\.tech|pooler\.supabase/i.test(connectionString);
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new PrismaClient();
  }

  if (shouldUseNeonAdapter(connectionString)) {
    neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
