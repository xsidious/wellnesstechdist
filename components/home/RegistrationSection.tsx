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
    <section id="register" className="bg-primary/[0.035] py-20 md:py-28">
      <div className="container-x grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Register your practice
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
            Unlock catalog access and onboarding.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about your practice and we&apos;ll follow up with pricing, formulary access, and
            onboarding for exosomes, peptides, GLP-1s, and aesthetic devices.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Prefer a full account?{" "}
            <Link
              href="/register?role=PROVIDER"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create a provider login
            </Link>{" "}
            or{" "}
            <Link href="/affiliates" className="font-medium text-primary underline-offset-4 hover:underline">
              apply as an affiliate
            </Link>
            .
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="md:col-span-7 rounded-3xl border border-primary/10 bg-white/95 p-7 shadow-[0_18px_50px_rgba(15,40,60,0.06)] md:p-9"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <RField name="name" label="Your name" error={errs.name} />
            <RField name="practice" label="Name of practice" error={errs.practice} />
          </div>
          <div className="mt-5">
            <RField name="address" label="Practice address" error={errs.address} />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <RField name="phone" label="Phone number" type="tel" error={errs.phone} />
            <RField name="referral" label="How did you hear about us?" error={errs.referral} />
          </div>
          <div className="mt-5">
            <RField name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
          </div>
          {status === "ok" && (
            <p className="mt-4 rounded-2xl bg-accent/15 px-4 py-3 text-sm text-accent-foreground">
              Thanks — your registration was received. We&apos;ll be in touch shortly.
            </p>
          )}
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_12px_28px_rgba(20,70,100,0.2)] transition hover:bg-primary/90"
          >
            Register practice <ArrowUpRight className="size-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function RField({
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
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
