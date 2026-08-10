"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  Lock,
  ShoppingCart,
  CheckCircle2,
  FileDown,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { catalog, allItems } from "./catalog";
import { PageHeroShell } from "@/components/PageHero";

const registrationSchema = z.object({
  firstName: z.string().trim().min(2, "Required").max(60),
  lastName: z.string().trim().min(2, "Required").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Required").max(30),
  business: z.string().trim().min(2, "Required").max(150),
  practiceType: z.enum(
    ["Medical practitioner", "Wellness clinic", "Esthecian", "Retailer", "Other"],
    { message: "Please select a practice type" },
  ),
  licenseType: z.string().trim().min(2, "Required").max(80),
  state: z.string().trim().min(2, "Required").max(60),
  hasMedicalDirector: z.enum(["yes", "no"], { message: "Please answer Yes or No" }),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
  agree: z.literal("on", { message: "You must agree to the terms" }),
});

const orderSchema = z.object({
  orderedBy: z.string().trim().min(2, "Required").max(120),
  account: z.string().trim().min(2, "Required").max(150),
  orderDate: z.string().trim().min(4, "Required").max(40),
  shipping: z.string().trim().min(5, "Required").max(400),
  po: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

const STORAGE_KEY = "wtbd_exosomes_registration_v1";

type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  business: string;
  practiceType: string;
  licenseType: string;
  state: string;
};

export function ExosomesInteractive() {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [regErrs, setRegErrs] = useState<Record<string, string>>({});
  const [qty, setQty] = useState<Record<string, number>>({});
  const [orderErrs, setOrderErrs] = useState<Record<string, string>>({});
  const [orderStatus, setOrderStatus] = useState<"idle" | "ok">("idle");
  const [activeTab, setActiveTab] = useState<"catalog" | "resources">("catalog");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRegistration(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const lines = useMemo(
    () => allItems.map((it) => ({ ...it, q: qty[it.sku] || 0 })).filter((l) => l.q > 0),
    [qty],
  );
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.q * l.price, 0), [lines]);

  function setItem(sku: string, n: number) {
    setQty((q) => ({ ...q, [sku]: Math.max(0, Math.min(999, n || 0)) }));
  }

  function onRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setRegErrs(fe);
      return;
    }
    setRegErrs({});
    const reg: Registration = {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      business: parsed.data.business,
      practiceType: parsed.data.practiceType,
      licenseType: parsed.data.licenseType,
      state: parsed.data.state,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reg));
    } catch {
      /* ignore */
    }
    setRegistration(reg);
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function clearRegistration() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setRegistration(null);
    setQty({});
    setOrderStatus("idle");
  }

  function onOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = orderSchema.safeParse(data);
    const newErrs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        newErrs[i.path[0] as string] = i.message;
      });
    }
    if (lines.length === 0) newErrs.cart = "Add at least one product to your order.";
    if (Object.keys(newErrs).length) {
      setOrderErrs(newErrs);
      return;
    }
    setOrderErrs({});
    if (registration && parsed.success) {
      const o = parsed.data;
      const linesText = lines
        .map(
          (l) =>
            `  - #${l.no} ${l.q} × ${l.name} (${l.spec}) | Online $${l.online.toFixed(2)} | MSRP $${l.msrp.toFixed(2)} | SPA $${l.price.toFixed(2)} = $${(l.q * l.price).toFixed(2)}`,
        )
        .join("\n");
      const body = [
        `LUMIDOR Order Form — Abio Materials`,
        ``,
        `--- Account ---`,
        `Account / Practice: ${o.account}`,
        `Ordered By: ${o.orderedBy}`,
        `Date: ${o.orderDate}`,
        `PO / Reference #: ${o.po || "(none)"}`,
        ``,
        `--- Registered practice ---`,
        `Name: ${registration.firstName} ${registration.lastName}`,
        `Business: ${registration.business}`,
        `Practice type: ${registration.practiceType}`,
        `License type: ${registration.licenseType}`,
        `State of license: ${registration.state}`,
        `Email: ${registration.email}`,
        `Phone: ${registration.phone}`,
        ``,
        `--- Order (SPA pricing) ---`,
        linesText,
        ``,
        `Estimated SPA subtotal: $${subtotal.toFixed(2)}`,
        ``,
        `--- Shipping ---`,
        o.shipping,
        ``,
        `Referred by: ${o.referredBy || "(none)"}`,
        `Notes: ${o.notes || "(none)"}`,
      ].join("\n");
      const subject = `LUMIDOR order — ${o.account} ($${subtotal.toFixed(2)})`;
      const mailto = `mailto:admin@thewellnesstech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
    setOrderStatus("ok");
    e.currentTarget.reset();
    setQty({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {!registration && (
        <div id="register" className="py-2">
        <PageHeroShell>
          <div className="container-x grid gap-8 py-10 md:grid-cols-12 md:py-12">
            <div className="md:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Step 1 — Practice Registration
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                Register your practice to unlock ordering.
              </h2>
              <p className="mt-3 text-sm text-primary-foreground/90">
                Pricing and ordering are restricted to licensed medical practitioners (MD, DO, NP, PA, RN
                under medical direction), MedSpas and authorized aesthetic retailers. Submit your credentials
                once — SPA pricing, suggested retail and the online order form will open.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-primary-foreground/85">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> One-time form per practice
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> Credentials reviewed before
                  first ship
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> No charges until a rep confirms
                  your order
                </li>
              </ul>
            </div>
            <form
              onSubmit={onRegister}
              className="md:col-span-7 rounded-2xl border border-primary-foreground/25 bg-background p-5 text-foreground md:p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="firstName" label="First name" error={regErrs.firstName} />
                <Field name="lastName" label="Last name" error={regErrs.lastName} />
                <Field name="email" label="Practice email" type="email" error={regErrs.email} />
                <Field name="phone" label="Phone" error={regErrs.phone} />
                <Field name="business" label="Business name" error={regErrs.business} />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    Type of practice
                  </span>
                  <select
                    name="practiceType"
                    defaultValue=""
                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    <option value="" disabled>
                      Select one…
                    </option>
                    <option value="Medical practitioner">Medical practitioner</option>
                    <option value="Wellness clinic">Wellness clinic</option>
                    <option value="Esthecian">Esthecian</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Other">Other</option>
                  </select>
                  {regErrs.practiceType && (
                    <span className="mt-1 block text-xs text-destructive">{regErrs.practiceType}</span>
                  )}
                </label>
                <Field name="licenseType" label="Type of license" error={regErrs.licenseType} />
                <Field name="state" label="State of license" error={regErrs.state} />
                <div className="md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    Do you have a Medical Director on staff (if not an MD/DO yourself)?
                  </span>
                  <div className="mt-2 flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="hasMedicalDirector" value="yes" /> Yes
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="hasMedicalDirector" value="no" /> No
                    </label>
                  </div>
                  {regErrs.hasMedicalDirector && (
                    <span className="mt-1 block text-xs text-destructive">{regErrs.hasMedicalDirector}</span>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Field name="referredBy" label="Referred by (optional)" error={regErrs.referredBy} />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-start gap-2 text-xs text-primary/80">
                    <input type="checkbox" name="agree" className="mt-0.5" />
                    <span>
                      I confirm I am a licensed medical professional or authorized representative of a licensed
                      medical practice, Esthecian, or retailer and these products will be used in compliance with
                      applicable state and federal regulations.
                    </span>
                  </label>
                  {regErrs.agree && <span className="mt-1 block text-xs text-destructive">{regErrs.agree}</span>}
                </div>
              </div>
              <button
                type="submit"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
              >
                Register & unlock order form <ArrowUpRight className="size-4" />
              </button>
            </form>
          </div>
        </PageHeroShell>
        </div>
      )}

      <section className="border-b border-primary/10 bg-background">
        <div className="container-x py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Exosomes in Action</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
            See the science up close.
          </h2>
          <div className="mt-8 overflow-hidden rounded-sm border border-primary/10 bg-card">
            <video
              src="/videos/exosomes-1.mp4"
              controls
              playsInline
              preload="metadata"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-primary/5">
        <div className="container-x py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Protocols & Outcomes</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
            Watch the treatments in motion.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-sm border border-primary/10 bg-card">
              <video
                src="/videos/exosomes-2.mp4"
                controls
                playsInline
                preload="metadata"
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-sm border border-primary/10 bg-card">
              <video
                src="/videos/exosomes-3.mp4"
                controls
                playsInline
                preload="metadata"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {orderStatus === "ok" && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="container-x py-4 text-sm text-primary">
            Thank you — your order request was received. A representative will confirm pricing and shipping
            shortly.
          </div>
        </div>
      )}

      <div className="border-b border-primary/10 bg-background">
        <div className="container-x flex flex-wrap gap-1 py-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("catalog");
              if (!registration) {
                setTimeout(
                  () => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }),
                  50,
                );
              }
            }}
            className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === "catalog"
                ? "bg-primary text-primary-foreground"
                : "border border-primary/15 text-primary hover:border-accent hover:text-accent"
            }`}
          >
            <BookOpen className="size-4" /> View Catalog
            {!registration && <Lock className="size-3" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (registration) {
                setActiveTab("resources");
              } else {
                document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
              registration && activeTab === "resources"
                ? "bg-primary text-primary-foreground"
                : "border border-primary/15 text-primary hover:border-accent hover:text-accent"
            }`}
          >
            <FolderOpen className="size-4" /> Catalogs & Resources
            {!registration && <Lock className="size-3" />}
          </button>
        </div>
      </div>

      {(!registration || activeTab === "catalog") &&
        catalog.map((group, idx) => (
          <section key={group.title} className="border-b border-primary/10">
            <div className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-16">
              <div className="md:col-span-4">
                <div className="sticky top-24">
                  <div className="text-xs uppercase tracking-widest text-accent">
                    {String(idx + 1).padStart(2, "0")} / {String(catalog.length).padStart(2, "0")}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
                    {group.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">{group.blurb}</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <ul className="divide-y divide-primary/10 border-y border-primary/10">
                  {group.items.map((it) => (
                    <li key={it.sku} className="py-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                              No. {it.no}
                            </span>
                            <div className="font-display text-base font-medium text-primary md:text-lg">
                              {it.name}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">{it.spec}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {registration ? (
                            <div className="grid min-w-[11rem] grid-cols-3 gap-2 text-right sm:min-w-[14rem]">
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                  Online
                                </div>
                                <div className="mt-0.5 text-sm text-primary/70">${it.online.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                  MSRP
                                </div>
                                <div className="mt-0.5 text-sm text-primary/70">${it.msrp.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-accent">SPA</div>
                                <div className="mt-0.5 font-display text-lg font-semibold text-primary">
                                  ${it.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="inline-flex items-center gap-1 rounded-sm border border-primary/15 bg-primary/5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                                <Lock className="size-3" /> Price after verification
                              </div>
                            </div>
                          )}
                          {registration ? (
                            <div className="text-center">
                              <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                                Qty
                              </div>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={999}
                                value={qty[it.sku] || ""}
                                onChange={(e) => setItem(it.sku, parseInt(e.target.value, 10))}
                                placeholder="0"
                                aria-label={`Order quantity for ${it.name}`}
                                className="w-20 rounded-sm border border-input bg-background px-3 py-2 text-center text-sm outline-none focus:border-accent"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary/80">{it.info}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

      {registration && activeTab === "catalog" && (
        <section id="order" className="border-b border-primary/10 bg-primary/5">
          <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                <CheckCircle2 className="size-4" /> Verified — LUMIDOR Order Form
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
                Abio Materials — product order sheet
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Registered as{" "}
                <span className="font-medium text-primary">
                  {registration.firstName} {registration.lastName}
                </span>{" "}
                · {registration.business}.{" "}
                <button type="button" onClick={clearRegistration} className="underline hover:text-accent">
                  Not you? Reset
                </button>
              </p>
              <a
                href="/downloads/lumidor-order-form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
              >
                <FileDown className="size-4" /> Download printable LUMIDOR order form
              </a>
              <div className="mt-6 rounded-sm border border-primary/10 bg-background p-5">
                {lines.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="size-4" /> No items selected yet — set Order Qty above.
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-primary/10 text-sm">
                      {lines.map((l) => (
                        <li key={l.sku} className="flex items-start justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <div className="font-medium text-primary">
                              #{l.no} {l.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{l.spec}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-primary">
                              {l.q} × ${l.price.toFixed(2)} SPA
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${(l.q * l.price).toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
                      <span className="text-xs uppercase tracking-widest text-primary/70">
                        Estimated SPA subtotal
                      </span>
                      <span className="font-display text-xl font-semibold text-primary">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {orderErrs.cart && <p className="mt-3 text-xs text-destructive">{orderErrs.cart}</p>}
            </div>

            <form
              onSubmit={onOrder}
              className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-6 md:p-8"
            >
              <div className="mb-5 border-b border-primary/10 pb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">
                  LUMIDOR Order Form
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Account, ordered-by, date, PO and notes — matching the Abio Materials order sheet.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="account"
                  label="Account / Practice"
                  defaultValue={registration.business}
                  error={orderErrs.account}
                />
                <Field
                  name="orderDate"
                  label="Date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  error={orderErrs.orderDate}
                />
                <Field
                  name="orderedBy"
                  label="Ordered By"
                  defaultValue={`${registration.firstName} ${registration.lastName}`}
                  error={orderErrs.orderedBy}
                />
                <Field name="po" label="PO / Reference # (optional)" error={orderErrs.po} />
                <div className="sm:col-span-2">
                  <Field name="shipping" label="Shipping address" textarea rows={3} error={orderErrs.shipping} />
                </div>
                <div className="sm:col-span-2">
                  <Field name="notes" label="Notes (optional)" textarea rows={3} error={orderErrs.notes} />
                </div>
                <div className="sm:col-span-2">
                  <Field name="referredBy" label="Referred by (optional)" error={orderErrs.referredBy} />
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                This form is for verified practice ordering. Submitting is a quote / order request — a
                representative will confirm availability, final SPA pricing and payment before shipping.
              </p>
              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Submit LUMIDOR order <ArrowUpRight className="size-4" />
              </button>
            </form>
          </div>
        </section>
      )}

      {registration && activeTab === "resources" && (
        <section id="resources" className="border-b border-primary/10 bg-background">
          <div className="container-x py-16 md:py-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Verified Resources</span>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
              Catalogs & downloadable brochures
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Product catalogs, clinical leaflets and brochures for the Celexo, Lumidor and AAPE exosome lines —
              unlocked for your verified practice.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  href: "/downloads/lumidor-order-form.pdf",
                  title: "LUMIDOR Order Form",
                  desc: "Printable Abio Materials product order sheet — Online, MSRP and SPA pricing.",
                },
                {
                  href: "/docs/ABIO_LUMIDOR_Catalogue.pdf",
                  title: "ABio Lumidor — Master Catalogue",
                  desc: "Complete product catalog across the Lumidor and Celexo aesthetic lines.",
                },
                {
                  href: "/docs/Celexo_Exo-Cica_Black_Label.pdf",
                  title: "Celexo Exo-Cica & Black Label",
                  desc: "Premium lyophilized exosome boosters — flagship skin & hair formulas.",
                },
                {
                  href: "/docs/Celexo_Exo-Cica_Brochure.pdf",
                  title: "Celexo Exo-Cica — 12p Brochure",
                  desc: "Centella-based calming exosome system for post-procedure recovery.",
                },
                {
                  href: "/docs/Celexo_Hydro_Gel_Product_Material.pdf",
                  title: "Celexo Hydro Gel — Product Material",
                  desc: "Hydro gel format technical sheet and clinical use cases.",
                },
                {
                  href: "/docs/CellExosome_Black_Label_Hair_Leaflet.pdf",
                  title: "Black Label Hair — Clinical Leaflet",
                  desc: "Exosome hair booster leaflet — protocols for androgenic alopecia & density.",
                },
                {
                  href: "/docs/Lumidor_Hair_Brochure.pdf",
                  title: "Lumidor Hair — Brochure",
                  desc: "Full Lumidor hair restoration line — AAPE, exosomes and scalp care.",
                },
              ].map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-sm border border-primary/10 bg-card p-5 transition hover:border-accent"
                  >
                    <FileDown className="mt-1 size-5 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-base font-medium text-primary group-hover:text-accent">
                        {r.title}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                        PDF · Download <ArrowUpRight className="size-3" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <p className="container-x py-8 text-center text-xs text-muted-foreground">
        Wellness Tech Bio Distribution facilitates ordering for licensed medical professionals. Products are not
        intended for resale to consumers. Specifications and pricing subject to change.
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
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          maxLength={1000}
          defaultValue={defaultValue}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      ) : (
        <input
          name={name}
          type={type}
          maxLength={type === "date" ? undefined : 255}
          defaultValue={defaultValue}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
