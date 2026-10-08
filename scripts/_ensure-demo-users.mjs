import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pin = await bcrypt.hash("246810", 8);

async function ensureOrg(slug, data) {
  return prisma.organization.upsert({
    where: { slug },
    update: {},
    create: { slug, ...data },
  });
}

async function ensureUser(email, data) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { mfaHash: pin, mfaEnabled: true, name: data.name, roles: data.roles },
    });
    return existing;
  }
  return prisma.user.create({
    data: { email, mfaHash: pin, mfaEnabled: true, ...data },
  });
}

const fairfax = await ensureOrg("fairfax", {
  type: "practice",
  legalName: "Fairfax Concierge",
  verificationTier: 2,
  assignedRep: "Alex Morgan",
});
const adminOrg = await ensureOrg("wellness-tech", {
  type: "operator",
  legalName: "Wellness Tech",
  verificationTier: 0,
});

await ensureUser("owner@fairfax.demo", {
  orgId: fairfax.id,
  name: "Dana Ellis",
  roles: JSON.stringify(["owner", "prescriber"]),
});
await ensureUser("admin@wellnesstech.demo", {
  orgId: adminOrg.id,
  name: "Wellness Tech Admin",
  roles: JSON.stringify(["admin"]),
});

console.log(
  JSON.stringify(
    {
      ok: true,
      logins: [
        { email: "admin@wellnesstech.demo", pin: "246810", portal: "/admin" },
        { email: "owner@fairfax.demo", pin: "246810", portal: "/portal" },
      ],
    },
    null,
    2,
  ),
);
await prisma.$disconnect();
