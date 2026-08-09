"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Lock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { grantAccess } from "@/lib/access";
import { useTrackEvent } from "@/lib/useTrackEvent";

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  business: z.string().trim().min(2, "Required").max(150),
  phone: z.string().trim().min(7, "Required").max(30),
  email: z.string().trim().email("Invalid email").max(255),
  agree: z.literal("on", { message: "You must confirm" }),
});

export function CatalogAccessGate({ source = "catalog" }: { source?: string }) {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const track = useTrackEvent();

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
      return;
    }
    setErrs({});
    track("catalog_unlock", source, {
      business: parsed.data.business,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    grantAccess("practitioner", parsed.data.name);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-sm border border-primary/10 bg-card p-8 md:p-10">
        <div className="flex items-center gap-3">
          <Lock className="size-5 text-accent" />
          <h2 className="font-display text-2xl font-semibold text-primary">Request catalog access</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          The Compounded Therapies catalog and product list are restricted. Complete the short intake
          form below to unlock access on this device.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name" error={errs.name} />
            <Field name="business" label="Business name" error={errs.business} />
            <Field name="phone" label="Phone" type="tel" error={errs.phone} />
            <Field name="email" label="Email" type="email" error={errs.email} />
          </div>

          <label className="flex items-start gap-2 text-xs text-primary/80">
            <input type="checkbox" name="agree" className="mt-1 accent-accent" />
            <span>
              I confirm the information above is accurate and I will use the catalog and product list
              in compliance with applicable state and federal regulations.
            </span>
          </label>
          {errs.agree && <span className="text-xs text-destructive">{errs.agree}</span>}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
          >
            <ShieldCheck className="size-4" /> Unlock catalog
          </button>
        </form>

        <div className="mt-6 border-t border-primary/10 pt-6 text-center text-xs text-muted-foreground">
          Not registered yet?{" "}
          <Link
            href="/register?role=PROVIDER"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            Become a Prescriber <ArrowUpRight className="size-3" />
          </Link>{" "}
          or{" "}
          <Link href="/affiliates" className="text-accent hover:underline">
            Become an Affiliate
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      <input
        name={name}
        type={type}
        maxLength={255}
        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
