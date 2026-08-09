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
    <section id="register" className="bg-primary/5 py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="text-base font-semibold uppercase tracking-widest text-accent">
            Register your practice
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
            Get connected to our practitioner network.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about your practice and we&apos;ll follow up with catalog access, pricing, and
            onboarding for exosomes, peptides, GLP-1s, and aesthetic devices. Registration unlocks the
            practitioner resources and download library on this device.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Affiliates:{" "}
            <Link href="/affiliates" className="text-primary underline-offset-4 hover:underline">
              apply here
            </Link>{" "}
            to gain the same access.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-8 md:p-10"
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
            <p className="mt-4 text-sm text-accent">
              Thanks — your registration was received. We&apos;ll be in touch shortly.
            </p>
          )}
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
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
        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
