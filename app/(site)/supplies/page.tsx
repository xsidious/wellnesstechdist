"use client";

import { useState } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  Package,
  Syringe,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";

const categories = [
  {
    icon: Syringe,
    title: "Injectables Ancillaries",
    desc: "Needles, syringes, cannulas, mixing supplies, sharps containers and reconstitution accessories.",
  },
  {
    icon: Sparkles,
    title: "Aesthetic Devices & Consumables",
    desc: "Microneedling cartridges, RF tips, IPL accessories, masks, gels and post-procedure consumables.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Essentials",
    desc: "Exam table paper, gloves, gowns, drapes, BP cuffs, otoscopes and general medical office supplies.",
  },
  {
    icon: Package,
    title: "Pharmacy & Compounding Support",
    desc: "Vials, pens, transfer needles, alcohol prep pads, cold-chain shipping and storage accessories.",
  },
  {
    icon: ShieldCheck,
    title: "Infection Control & PPE",
    desc: "Surface disinfectants, autoclave pouches, PPE, biohazard supplies and OSHA-compliant essentials.",
  },
  {
    icon: Truck,
    title: "Custom & Bulk Sourcing",
    desc: "Tell us what you need — we source from verified suppliers and offer volume pricing for multi-location practices.",
  },
];

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Required").max(30),
  clinic: z.string().trim().min(2, "Required").max(150),
  state: z.string().trim().min(2, "Required").max(60),
  category: z.string().trim().min(2, "Select a category").max(80),
  volume: z.string().trim().min(1, "Required").max(40),
  details: z.string().trim().min(5, "Tell us what you need").max(1500),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

export default function SuppliesPage() {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "ok">("idle");

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
    setStatus("ok");
    e.currentTarget.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <section className="border-b border-primary/10 bg-primary/5">
        <div className="container-x py-20 md:py-28">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Distribution
          </span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold text-primary md:text-6xl">
            Aesthetic & Medical Supplies
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            One source for the supplies that keep your practice running — from injectables ancillaries
            and aesthetic device consumables to clinical essentials and PPE. Wholesale pricing for
            verified medical and aesthetic practices, with custom sourcing available.
          </p>
        </div>
      </section>

      {status === "ok" && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="container-x py-4 text-sm text-primary">
            Thank you — your supply inquiry was received. A distribution rep will reach out shortly
            with availability and pricing.
          </div>
        </div>
      )}

      <section className="container-x py-16 md:py-20">
        <div className="grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-3">
          {categories.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-background p-6">
              <Icon className="size-6 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="inquiry" className="border-t border-primary/10 bg-primary/5">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Supply Inquiry
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              Tell us what you need.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Describe the supplies, brands, sizes or volumes you&apos;re sourcing. We respond within
              one business day with availability, pricing and lead time. New accounts may be asked to
              verify practice credentials before first shipment.
            </p>
          </div>
          <form
            onSubmit={onSubmit}
            className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-6 md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="name" label="Full name" error={errs.name} />
              <Field name="email" label="Practice email" type="email" error={errs.email} />
              <Field name="phone" label="Phone" error={errs.phone} />
              <Field name="clinic" label="Clinic / practice" error={errs.clinic} />
              <Field name="state" label="State" error={errs.state} />
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Category
                </span>
                <select
                  name="category"
                  defaultValue=""
                  className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option>Injectables Ancillaries</option>
                  <option>Aesthetic Devices & Consumables</option>
                  <option>Clinical Essentials</option>
                  <option>Pharmacy & Compounding Support</option>
                  <option>Infection Control & PPE</option>
                  <option>Custom / Bulk Sourcing</option>
                </select>
                {errs.category && (
                  <span className="mt-1 block text-xs text-destructive">{errs.category}</span>
                )}
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Estimated volume / frequency
                </span>
                <select
                  name="volume"
                  defaultValue=""
                  className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="" disabled>
                    Select volume
                  </option>
                  <option>One-time order</option>
                  <option>Monthly restock</option>
                  <option>Quarterly restock</option>
                  <option>Multi-location / standing order</option>
                </select>
                {errs.volume && (
                  <span className="mt-1 block text-xs text-destructive">{errs.volume}</span>
                )}
              </label>
              <div className="md:col-span-2">
                <Field
                  name="details"
                  label="Items, brands, sizes, quantities"
                  textarea
                  rows={5}
                  error={errs.details}
                />
              </div>
              <div className="md:col-span-2">
                <Field name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Submit supply inquiry <ArrowUpRight className="size-4" />
            </button>
          </form>
        </div>
      </section>

      <p className="container-x py-8 text-center text-xs text-muted-foreground">
        Distribution available to licensed medical and aesthetic practices only. Brand availability
        and pricing subject to change without notice.
      </p>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  textarea,
  rows = 4,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          maxLength={1500}
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
