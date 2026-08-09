import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const CONTENT_KEYS = [
  "home.hero",
  "home.cta",
  "faq.items",
  "contact.info",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

export type HomeHeroBody = {
  headline?: string;
  subcopy?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type HomeCtaBody = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type FaqItemsBody = {
  categories?: {
    id: string;
    title: string;
    items: { q: string; a: string }[];
  }[];
};

export type ContactInfoBody = {
  email?: string;
  phone?: string;
  phoneHref?: string;
  coverage?: string;
  blurb?: string;
  hours?: string;
};

export async function getContentBlock<T>(key: ContentKey, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteContentBlock.findUnique({ where: { key } });
    if (!row?.body || typeof row.body !== "object") return fallback;
    const body = row.body as Record<string, unknown>;
    // Treat empty object as "use fallback"
    if (Object.keys(body).length === 0) return fallback;
    return { ...fallback, ...(body as T) };
  } catch {
    return fallback;
  }
}

export async function upsertContentBlock(
  key: ContentKey,
  body: Prisma.InputJsonValue,
  opts?: { title?: string; updatedBy?: string },
) {
  return prisma.siteContentBlock.upsert({
    where: { key },
    create: {
      key,
      title: opts?.title,
      body,
      updatedBy: opts?.updatedBy,
    },
    update: {
      title: opts?.title,
      body,
      updatedBy: opts?.updatedBy,
    },
  });
}
