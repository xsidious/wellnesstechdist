import { randomInt, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const KIAN_SLUG = "kian-prive-partner";
const KIAN_EMAIL = "orders@kianprive.partner";

/** Dedicated org + system user that owns orders forwarded from KIAN Privé. */
export async function ensureKianPartnerOrg() {
  let org = await prisma.organization.findUnique({ where: { slug: KIAN_SLUG } });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        type: "practice",
        legalName: "KIAN Privé",
        slug: KIAN_SLUG,
        verificationTier: 2,
        status: "active",
        assignedRep: "KIAN Privé",
      },
    });
  }

  let user = await prisma.user.findUnique({ where: { email: KIAN_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        orgId: org.id,
        email: KIAN_EMAIL,
        name: "KIAN Privé Orders",
        roles: JSON.stringify(["owner", "prescriber", "api_client"]),
        mfaHash: await bcrypt.hash(String(randomInt(100000, 999999)), 8),
        mfaEnabled: true,
      },
    });
  } else if (user.orgId !== org.id) {
    user = await prisma.user.update({ where: { id: user.id }, data: { orgId: org.id } });
  }

  return { org, user };
}

export function partnerSecretOk(header: string | null) {
  const expected = process.env.WT_PARTNER_ORDER_SECRET?.trim();
  if (!expected || !header) return false;
  const left = Buffer.from(header);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
