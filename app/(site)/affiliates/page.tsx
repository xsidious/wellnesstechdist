"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpRight, TrendingUp, Map, Megaphone, Wallet } from "lucide-react";
import { grantAccess } from "@/lib/access";
import { PageHeroShell } from "@/components/PageHero";

const tiers = [
  { name: "Associate", desc: "Independent reps building a clinic book of business." },
  { name: "Senior Affiliate", desc: "Proven sales record, dedicated territory, marketing co-op." },
  { name: "Director", desc: "Team builders with multi-region influence and clinic networks." },
];

const benefits = [
  {
    icon: Wallet,
    title: "Tiered commissions",
    desc: "Industry-leading payout structure with monthly settlement and recurring reorder revenue.",
  },
  {
    icon: Map,
    title: "Territory protection",
    desc: "Defined zones so your network and your effort compound.",
  },
  {
    icon: Megaphone,
    title: "Sales enablement",
    desc: "Marketing decks, sample kits, clinical literature, and physician-facing protocols.",
  },
  {
    icon: TrendingUp,
    title: "Premium catalog",
    desc: "100+ in-demand compounded products: GLP-1s, peptides, NAD+, hormone therapies.",
  },
];

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7).max(30),
  territory: z.string().trim().min(2).max(120),
  experience: z.string().trim().min(10, "Tell us a bit more").max(1000),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

export default function AffiliatesPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errs, setErrs] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setErrs(fe);
      setStatus("err");
      return;
    }
    setErrs({});
    grantAccess("affiliate", parsed.data.name);
    const d = parsed.data;
    const subject = `New Affiliate Application — ${d.name}`;
    const body =
      `New affiliate application submitted via the website:\n\n` +
      `Name: ${d.name}\n` +
      `Email: ${d.email}\n` +
      `Phone: ${d.phone}\n` +
      `Territory: ${d.territory}\n` +
      `Referred by: ${d.referredBy || "—"}\n\n` +
      `Sales background & target clinics:\n${d.experience}\n`;
    const mailto = `mailto:admin@thewellnesstech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <>
      <PageHeroShell>
        <div className="container-x grid gap-10 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Affiliate program
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              Sell the most-requested products in compounded medicine.
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/90 md:text-lg">
              A curated network of independent reps connecting clinics with compounded GLP-1s,
              peptides and NAD+ therapies. We provide the catalog, compliance resources and logistics
              support — you bring the relationships.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground shadow-[0_12px_28px_rgba(0,0,0,0.16)] hover:bg-gold-soft"
              >
                Apply now <ArrowUpRight className="size-4" />
              </a>
              <Link
                href="/register?role=AMBASSADOR"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:border-accent hover:text-accent"
              >
                Register as ambassador
              </Link>
            </div>
            <div className="mt-7 overflow-hidden rounded-2xl border border-accent/30 bg-primary-foreground/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/business-professionals.jpg"
                alt="Wellness Tech Bio Distribution business professionals"
                width={1024}
                height={1024}
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Are you a licensed prescriber?{" "}
              <Link
                href="/register?role=PROVIDER"
                className="text-accent underline underline-offset-4 transition hover:text-accent/80"
              >
                Become a prescriber here
              </Link>
              .
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-accent/30 bg-primary/40 p-6 backdrop-blur md:p-7">
              <div className="text-xs uppercase tracking-widest text-accent">Commission tiers</div>
              <ul className="mt-4 divide-y divide-primary-foreground/10">
                {tiers.map((t) => (
                  <li key={t.name} className="py-3.5">
                    <span className="font-display text-lg font-semibold">{t.name}</span>
                    <p className="mt-1 text-sm text-primary-foreground/85">{t.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PageHeroShell>

      <section className="container-x py-24">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title}>
              <b.icon className="size-6 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="bg-primary/5 py-24">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Application
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
              Apply to join.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We review every application personally. Expect to hear back within 3 business days.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Prefer self-serve onboarding?{" "}
              <Link href="/register?role=AMBASSADOR" className="text-primary underline-offset-4 hover:underline">
                Create an ambassador account
              </Link>
              .
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Questions?{" "}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href="mailto:Admin@thewellnesstech.com"
              >
                Admin@thewellnesstech.com
              </a>{" "}
              · 877-847-6423
            </p>
          </div>
          <form
            onSubmit={onSubmit}
            className="md:col-span-7 space-y-5 rounded-sm border border-primary/10 bg-card p-8"
          >
            <Field name="name" label="Full name" error={errs.name} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="email" label="Email" type="email" error={errs.email} />
              <Field name="phone" label="Phone" type="tel" error={errs.phone} />
            </div>
            <Field name="territory" label="Territory / region" error={errs.territory} />
            <Field
              name="experience"
              label="Sales background & target clinics"
              textarea
              error={errs.experience}
            />
            <Field name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
            {status === "ok" && (
              <p className="text-sm text-accent">Application received. We&apos;ll be in touch shortly.</p>
            )}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Submit application <ArrowUpRight className="size-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  textarea,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          maxLength={1000}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      ) : (
        <input
          name={name}
          type={type}
          maxLength={255}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
