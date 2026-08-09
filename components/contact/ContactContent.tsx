"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { ArrowUpRight, Mail, Phone, MapPin, PhoneCall } from "lucide-react";

const callSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255),
  bestTime: z.string().trim().min(1).max(50),
  topic: z.string().trim().min(1).max(200),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

const steps = [
  {
    n: "01",
    title: "Practice Verification",
    desc: "Submit your medical license, DEA registration, and practice documentation. All ordering accounts require active physician credentials.",
  },
  {
    n: "02",
    title: "Account Setup",
    desc: "We onboard your practice with a dedicated account representative, pricing schedule, and access to our full catalog and ordering portal.",
  },
  {
    n: "03",
    title: "Protocol Selection",
    desc: "Choose from 100+ compounded Rx products across GLP-1, peptides, hormone, and longevity categories.",
  },
  {
    n: "04",
    title: "Order & Dispense",
    desc: "Place orders directly with our 503A/503B partner pharmacies — patient-specific or facility-stock.",
  },
  {
    n: "05",
    title: "Clinical Support",
    desc: "Our clinical team assists with dosing protocols, product selection, patient education, and compliance guidance.",
  },
];

export function ContactContent({
  contact,
}: {
  contact?: {
    email?: string;
    phone?: string;
    phoneHref?: string;
    coverage?: string;
    blurb?: string;
    hours?: string;
  };
}) {
  const [callStatus, setCallStatus] = useState<"idle" | "ok">("idle");
  const [callErrs, setCallErrs] = useState<Record<string, string>>({});

  const email = contact?.email || "Admin@thewellnesstech.com";
  const phone = contact?.phone || "877-847-6423";
  const phoneHref = contact?.phoneHref || "tel:8778476423";
  const coverage = contact?.coverage || "Nationwide · 503A & 503B network";
  const hours =
    contact?.hours ||
    "Mon–Fri, 8a–7p ET\nClinical support 24/7 for active accounts.";
  const blurb =
    contact?.blurb ||
    "Verified credentials unlock pricing, COAs, and ordering. Our clinical team responds within one business day.";

  function onCallSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = callSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setCallErrs(fe);
      return;
    }
    setCallErrs({});
    setCallStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x py-24 md:py-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">How to partner</span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">
            Onboard your practice in five steps.
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/90">{blurb}</p>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="mb-14 overflow-hidden rounded-sm border border-primary/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/people-consult.jpg"
            alt="Physician and practice owner in onboarding consultation"
            width={1280}
            height={896}
            loading="lazy"
            className="h-64 w-full object-cover md:h-96"
          />
        </div>
        <ol className="grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-5">
          {steps.map((s) => (
            <li key={s.n} className="bg-background p-6">
              <div className="font-display text-3xl text-accent">{s.n}</div>
              <div className="mt-2 font-display text-base font-semibold text-primary">{s.title}</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x grid gap-16 pb-24 md:grid-cols-12">
        <div className="space-y-8 md:col-span-4">
          <ContactLine icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
          <ContactLine icon={Phone} label="Practitioner line" value={phone} href={phoneHref} />
          <ContactLine icon={MapPin} label="Coverage" value={coverage} />
          <div className="rounded-sm border border-primary/10 bg-primary/5 p-6">
            <div className="text-xs uppercase tracking-widest text-accent">Hours</div>
            <p className="mt-2 whitespace-pre-line text-sm text-primary/80">{hours}</p>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-sm border border-primary/10 bg-card p-8 md:col-span-8 md:p-10">
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold text-primary">Register your practice</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create your Wellness Tech account, look up your NPI, and our team will verify and approve
              prescribing access.
            </p>
            <Link
              href="/register?role=PROVIDER"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
            >
              Register now <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="rounded-sm border border-primary/10 bg-card p-8 md:p-10">
          <div className="flex items-center gap-3">
            <PhoneCall className="size-6 text-accent" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-primary">Request a call</h2>
              <p className="text-sm text-muted-foreground">Speak with a customer service representative.</p>
            </div>
          </div>
          <form onSubmit={onCallSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            <Field name="name" label="Full name" error={callErrs.name} />
            <Field name="phone" label="Phone" error={callErrs.phone} />
            <Field name="email" label="Email" type="email" error={callErrs.email} />
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Best time to call
              </span>
              <select
                name="bestTime"
                defaultValue=""
                className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="" disabled>
                  Select a time
                </option>
                <option>8am – 10am ET</option>
                <option>10am – 12pm ET</option>
                <option>12pm – 2pm ET</option>
                <option>2pm – 4pm ET</option>
                <option>4pm – 6pm ET</option>
              </select>
              {callErrs.bestTime && (
                <span className="mt-1 block text-xs text-destructive">{callErrs.bestTime}</span>
              )}
            </label>
            <div className="md:col-span-2">
              <Field name="topic" label="What would you like to discuss?" textarea error={callErrs.topic} />
            </div>
            <div className="md:col-span-2">
              <Field name="referredBy" label="Referred by (optional)" error={callErrs.referredBy} />
            </div>
            {callStatus === "ok" && (
              <p className="text-sm text-accent md:col-span-2">
                Thanks — a customer service representative will call you at the requested time.
              </p>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft"
              >
                Request a call <PhoneCall className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <Icon className="size-5 text-accent" />
      <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      {href ? (
        <a href={href} className="mt-1 block font-display text-lg text-primary hover:text-accent">
          {value}
        </a>
      ) : (
        <div className="mt-1 font-display text-lg text-primary">{value}</div>
      )}
    </div>
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
          rows={5}
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
