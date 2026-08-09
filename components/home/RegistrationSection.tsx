"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { ArrowUpRight } from "lucide-react";
import { grantAccess } from "@/lib/access";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  practice: z.string().trim().min(2, "Practice name is required").max(150),
  address: z.string().trim().min(5, "Address is required").max(250),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  referral: z.string().trim().min(2, "Please tell us how you heard about us").max(200),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

export function RegistrationSection() {
  const [status, setStatus] = useState<"idle" | "ok">("idle");
  const [errs, setErrs] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setErrs(fe);
      return;
    }
    setErrs({});
    grantAccess("practitioner", parsed.data.name);
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <section id="register" className="px-3 py-6 md:py-8">
      <div className="container-x">
        <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-[0_18px_50px_rgba(15,40,60,0.06)]">
          <div className="border-b border-primary/10 bg-primary/[0.03] px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Register your practice
                </span>
                <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
                  Get connected to our practitioner network.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Tell us about your practice and we&apos;ll follow up with catalog access, pricing, and
                  onboarding for exosomes, peptides, GLP-1s, and aesthetic devices. Registration unlocks
                  the practitioner resources and download library on this device.
                </p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground md:max-w-[220px] md:text-right">
                Prefer a full account?{" "}
                <Link
                  href="/register?role=PROVIDER"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Provider login
                </Link>{" "}
                ·{" "}
                <Link
                  href="/affiliates"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Affiliate
                </Link>
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-5 py-5 md:px-7 md:py-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <RField name="name" label="Your name" error={errs.name} />
              <RField name="practice" label="Name of practice" error={errs.practice} />
              <RField name="phone" label="Phone number" type="tel" error={errs.phone} />
              <RField
                name="address"
                label="Practice address"
                error={errs.address}
                className="sm:col-span-2 lg:col-span-3"
              />
              <RField name="referral" label="How did you hear about us?" error={errs.referral} />
              <RField name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_10px_24px_rgba(20,70,100,0.18)] transition hover:bg-primary/90"
                >
                  Register practice <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>
            {status === "ok" && (
              <p className="mt-4 rounded-xl bg-accent/15 px-4 py-2.5 text-sm text-accent-foreground">
                Thanks — your registration was received. We&apos;ll be in touch shortly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function RField({
  name,
  label,
  type = "text",
  error,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
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
