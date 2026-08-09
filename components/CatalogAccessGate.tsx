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

export function CatalogAccessGate({
  source = "catalog",
  embedded = false,
}: {
  source?: string;
  /** Compact layout when nested inside another panel */
  embedded?: boolean;
}) {
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

  const shell = embedded
    ? "w-full"
    : "mx-auto w-full max-w-xl rounded-3xl border border-primary/10 bg-white p-5 shadow-[0_16px_40px_rgba(15,40,60,0.06)] sm:p-6";

  return (
    <div className={shell}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
          <Lock className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-primary">Request catalog access</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Restricted practitioner materials — unlock access on this device with a short intake.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="name" label="Full name" error={errs.name} />
          <Field name="business" label="Business name" error={errs.business} />
          <Field name="phone" label="Phone" type="tel" error={errs.phone} />
          <Field name="email" label="Email" type="email" error={errs.email} />
        </div>

        <label className="flex items-start gap-2 rounded-xl bg-primary/[0.03] px-3 py-2.5 text-[11px] leading-snug text-primary/80">
          <input type="checkbox" name="agree" className="mt-0.5 accent-accent" />
          <span>
            I confirm this information is accurate and I will use the catalog in compliance with
            applicable regulations.
          </span>
        </label>
        {errs.agree && <span className="text-xs text-destructive">{errs.agree}</span>}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition hover:bg-primary/90"
        >
          <ShieldCheck className="size-3.5" /> Unlock catalog
        </button>
      </form>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Not registered?{" "}
        <Link
          href="/register?role=PROVIDER"
          className="inline-flex items-center gap-0.5 font-medium text-accent hover:underline"
        >
          Become a Prescriber <ArrowUpRight className="size-3" />
        </Link>{" "}
        or{" "}
        <Link href="/affiliates" className="font-medium text-accent hover:underline">
          Affiliate
        </Link>
      </p>
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
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        maxLength={255}
        className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/40"
      />
      {error && <span className="mt-0.5 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
