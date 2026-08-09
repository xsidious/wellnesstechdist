import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { COMPOUNDED_CATALOG } from "../lib/catalog/compounded-catalog";

const prisma = new PrismaClient();

/** Shared local/Docker demo password — change in production. */
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "Demo1234!";

async function upsertUser(opts: {
  email: string;
  name: string;
  role: "ADMIN" | "PROVIDER" | "AMBASSADOR" | "CUSTOMER";
  password: string;
}) {
  const passwordHash = await bcrypt.hash(opts.password, 12);
  return prisma.user.upsert({
    where: { email: opts.email.toLowerCase() },
    update: { role: opts.role, passwordHash, name: opts.name },
    create: {
      email: opts.email.toLowerCase(),
      name: opts.name,
      role: opts.role,
      passwordHash,
    },
  });
}

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@wellnesstech.local").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || DEMO_PASSWORD;

  const admin = await upsertUser({
    email: adminEmail,
    name: "Platform Admin",
    role: "ADMIN",
    password: adminPassword,
  });

  const provider = await upsertUser({
    email: "provider@wellnesstech.local",
    name: "Demo Provider",
    role: "PROVIDER",
    password: DEMO_PASSWORD,
  });

  await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: { approved: true, businessName: "Demo Clinic Supply Co" },
    create: {
      userId: provider.id,
      businessName: "Demo Clinic Supply Co",
      approved: true,
    },
  });

  const ambassador = await upsertUser({
    email: "ambassador@wellnesstech.local",
    name: "Demo Ambassador",
    role: "AMBASSADOR",
    password: DEMO_PASSWORD,
  });

  await prisma.ambassadorProfile.upsert({
    where: { userId: ambassador.id },
    update: { code: "DEMOAMB" },
    create: {
      userId: ambassador.id,
      code: "DEMOAMB",
      walletBalance: 0,
    },
  });

  // Platform catalog owner (also PROVIDER) used for formulary product seed
  const platformUser = await upsertUser({
    email: "platform@wellnesstech.local",
    name: "Platform Catalog",
    role: "PROVIDER",
    password: DEMO_PASSWORD,
  });

  let providerId = (
    await prisma.providerProfile.upsert({
      where: { userId: platformUser.id },
      update: { approved: true, businessName: "Wellness Tech Bio Distribution" },
      create: {
        userId: platformUser.id,
        businessName: "Wellness Tech Bio Distribution",
        approved: true,
      },
    })
  ).id;

  await prisma.commissionTier.upsert({
    where: { id: "seed-tier-standard" },
    update: { percentBps: 500, minOrderCents: 0, active: true, name: "Standard" },
    create: {
      id: "seed-tier-standard",
      name: "Standard",
      percentBps: 500,
      minOrderCents: 0,
      active: true,
    },
  });

  await prisma.commissionTier.upsert({
    where: { id: "seed-tier-volume" },
    update: { percentBps: 800, minOrderCents: 50000, active: true, name: "Volume" },
    create: {
      id: "seed-tier-volume",
      name: "Volume",
      percentBps: 800,
      minOrderCents: 50000,
      active: true,
    },
  });

  let created = 0;
  for (const cat of COMPOUNDED_CATALOG) {
    for (const p of cat.products) {
      const slug = `rx-${p.id}`;
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) continue;

      await prisma.product.create({
        data: {
          providerId,
          slug,
          name: p.name,
          description: `${p.use}\n\nStrength: ${p.strength}\n\nContraindications: ${p.contraindications}\n\nSide effects: ${p.sideEffects}`,
          category: cat.id,
          active: true,
          variants: {
            create: {
              sku: `SKU-${p.id.toUpperCase()}`,
              name: "Standard",
              attrs: { size: "Standard" },
              priceCents: 9900,
              stock: 25,
            },
          },
        },
      });
      created += 1;
    }
  }

  console.log("Seed complete.");
  console.log(`  Admin:      ${admin.email} / ${adminPassword}`);
  console.log(`  Provider:   provider@wellnesstech.local / ${DEMO_PASSWORD}`);
  console.log(`  Ambassador: ambassador@wellnesstech.local / ${DEMO_PASSWORD}`);
  console.log(`  productsCreated=${created}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
