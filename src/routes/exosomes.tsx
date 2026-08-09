import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ArrowUpRight, Lock, ShoppingCart, CheckCircle2, FileDown, BookOpen, FolderOpen } from "lucide-react";
import abioExosomesHero from "@/assets/abio-exosomes-hero.jpg";

export const Route = createFileRoute("/exosomes")({
  head: () => ({
    meta: [
      { title: "Exosomes for Medical Aesthetics — Wellness Tech Bio Distribution" },
      { name: "description", content: "Professional exosome, stem-cell and AAPE aesthetic systems. Register your practice to unlock the online order form." },
      { property: "og:title", content: "Exosomes for Medical Aesthetics — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "Verified-practice ordering for exosome aesthetic systems." },
    ],
  }),
  component: Exosomes,
});

type Product = { sku: string; name: string; spec: string; price: number; msrp: number; info: string };
type Group = { title: string; blurb: string; items: Product[] };

const catalog: Group[] = [
  {
    title: "SX Series — Stem Rejuvenation",
    blurb: "Human-derived exosomes. A 5-step stem-cell rejuvenation regimen designed to brighten, firm and restore elasticity in mature or photo-aged skin.",
    items: [
      { sku: "SX-01", name: "SX STEM Solution Ampoules", spec: "6 ml × 12 vials", price: 85, msrp: 170, info: "Concentrated stem-cell conditioned media ampoules used in-clinic post-microneedling, RF or laser to accelerate recovery and boost collagen signaling." },
      { sku: "SX-02", name: "SX Rejuv Toner", spec: "200 ml", price: 30, msrp: 60, info: "Hydrating prep toner that balances skin pH and primes the barrier to absorb the SX serum and cream." },
      { sku: "SX-03", name: "SX Rejuv Serum", spec: "50 ml", price: 50, msrp: 100, info: "Lightweight stem-cell extract serum targeting fine lines, dullness and uneven tone for at-home daily use." },
      { sku: "SX-04", name: "SX Rejuv Cream", spec: "50 ml", price: 57.5, msrp: 115, info: "Rich moisturizer that seals in actives, supports the lipid barrier and improves overnight skin density." },
    ],
  },
  {
    title: "PX Series — Refine & Restore",
    blurb: "Plant-derived exosomes. A six-product refining system for daily aesthetic protocols — pore refinement, oil balance and gentle calming.",
    items: [
      { sku: "PX-01", name: "PX Solution Ampoules", spec: "6 ml × 12 vials", price: 70, msrp: 140, info: "In-clinic ampoules with refining peptides — pairs with microneedling for pore size, texture and post-acne marks." },
      { sku: "PX-02", name: "PX Refine Toner", spec: "200 ml", price: 23, msrp: 46, info: "Mild astringent toner that tightens pores and removes residual impurities after cleansing." },
      { sku: "PX-03", name: "PX Refine Serum", spec: "50 ml", price: 35, msrp: 70, info: "Pore-refining serum with niacinamide-style actives to balance sebum and even tone." },
      { sku: "PX-04", name: "PX Refine Cream", spec: "50 ml", price: 35, msrp: 70, info: "Non-comedogenic moisturizer for combination and oily skin types — lightweight, hydrating, matte finish." },
      { sku: "PX-05", name: "PX BIO Water Soothing MIST", spec: "100 ml", price: 24, msrp: 48, info: "Calming bio-water mist used to soothe reactive skin during or after in-clinic treatments." },
    ],
  },
  {
    title: "Spicule Series — Microchannel Activation",
    blurb: "Botanical spicules create micro-channels in the stratum corneum, allowing actives to penetrate without needles.",
    items: [
      { sku: "SP-01", name: "Refine SHOT SKIN BOOSTER 30000", spec: "3 ml", price: 30, msrp: 60, info: "High-density spicule shot for in-clinic exfoliation and skin renewal — strong turnover, single-session results." },
      { sku: "SP-02", name: "Refine SHOT SKIN BOOSTER 2000", spec: "50 ml", price: 20, msrp: 40, info: "Lower-density maintenance spicule formula for facials and gentler skin renewal protocols." },
      { sku: "SP-03", name: "EXO Activation SX Spicule Cream", spec: "30 ml", price: 40, msrp: 80, info: "Spicule + exosome activation cream for rejuvenation protocols — drives SX actives deeper into the dermis." },
      { sku: "SP-04", name: "EXO Activation CICA Spicule Cream", spec: "30 ml", price: 36, msrp: 72, info: "Centella-based calming spicule cream for sensitized, post-procedure or rosacea-prone skin." },
      { sku: "SP-05", name: "EXO Activation LACTO Spicule Cream", spec: "30 ml", price: 36, msrp: 72, info: "Lactobacillus-fermented spicule cream for barrier repair and microbiome support." },
    ],
  },
  {
    title: "Creams",
    blurb: "Post-procedure, lifting and recovery creams featuring exosome technology.",
    items: [
      { sku: "CR-01", name: "Soothing BOOSTER Cream", spec: "100 ml", price: 30, msrp: 60, info: "Calming, anti-inflammatory cream used immediately post-treatment to reduce erythema and discomfort." },
      { sku: "CR-02", name: "Lifting EXO Cream", spec: "100 ml", price: 57, msrp: 114, info: "Exosome-enriched firming cream that improves elasticity, jawline definition and skin density with daily use." },
      { sku: "CR-03", name: "CellExosome After Care Cream", spec: "50 ml", price: 25, msrp: 50, info: "Take-home recovery cream for patients following microneedling, peels, RF or laser — promotes barrier recovery." },
    ],
  },
  {
    title: "Cleansers",
    blurb: "Gentle prep cleansers used to start every facial or device-based protocol.",
    items: [
      { sku: "CL-01", name: "PX Refine Cleansing GEL", spec: "250 ml", price: 20, msrp: 45, info: "Sulfate-free gel cleanser for face — removes makeup, sebum and impurities without stripping the barrier." },
      { sku: "CL-02", name: "PX Refine BODY Cleanser", spec: "400 ml", price: 20, msrp: 45, info: "Body cleanser formulated for sensitive and post-procedure body skin (booty, back, décolleté treatments)." },
    ],
  },
  {
    title: "Hair",
    blurb: "AAPE and exosome scalp & hair restoration line for trichology and aesthetic medicine.",
    items: [
      { sku: "HR-01", name: "Celexo AAPE Hair Scaler", spec: "200 ml", price: 30, msrp: 60, info: "Scalp scaler that exfoliates buildup and prepares the scalp for AAPE and exosome treatments." },
      { sku: "HR-02", name: "SX Rejuv EXO Shampoo", spec: "500 ml", price: 38, msrp: 76, info: "Daily exosome shampoo supporting follicle health and a balanced scalp microbiome." },
      { sku: "HR-03", name: "EXO STEM Hair TONIC", spec: "100 ml", price: 30, msrp: 60, info: "Leave-on stem-cell tonic for thinning hair — used between in-clinic treatments to extend results." },
      { sku: "HR-04", name: "SX Rejuv EXO Treatment", spec: "500 ml", price: 38, msrp: 76, info: "Weekly exosome masque that strengthens the hair shaft and improves density over time." },
    ],
  },
  {
    title: "Skin Booster — Professional",
    blurb: "Lyophilized exosome and AAPE skin and hair boosters for in-clinic professional use only.",
    items: [
      { sku: "SB-01", name: "Celexo Black Label Skin", spec: "Powder 30 mg + Solvent 4 ml", price: 90, msrp: 180, info: "Premium lyophilized exosome skin booster — flagship formula for anti-aging, glow and post-laser recovery." },
      { sku: "SB-02", name: "Black Label Hair", spec: "Powder 30 mg + Solvent 4 ml", price: 80, msrp: 160, info: "Premium exosome hair booster for androgenic alopecia, post-PRP combination protocols and hair density." },
      { sku: "SB-03", name: "Celexo S", spec: "Powder 200 mg + Solvent 6 ml", price: 70, msrp: 140, info: "High-volume exosome booster designed for larger treatment areas — neck, décolleté, hands and body." },
      { sku: "SB-04", name: "Celexo HG", spec: "2 Syringes", price: 150, msrp: 300, info: "Pre-mixed syringe format of the HG booster — ready to use, ideal for fast in-clinic protocols." },
      { sku: "SB-05", name: "Celexo (10 vial)", spec: "3 ml × 10 vials", price: 350, msrp: 700, info: "Multi-patient pack — 10-vial value pack of the core Celexo exosome booster for high-volume clinics." },
      { sku: "SB-06", name: "Celexo (2 vial)", spec: "3 ml × 2 vials", price: 80, msrp: 160, info: "Trial / single-patient pack of the Celexo exosome booster." },
      { sku: "SB-07", name: "AAPE Skin", spec: "Powder 290 mg + Solvent 6 ml (6 sets)", price: 300, msrp: 600, info: "Six-set pack of AAPE (Advanced Adipose-derived stem cell Protein Extract) for skin rejuvenation programs." },
      { sku: "SB-08", name: "AAPE Hair", spec: "Powder 290 mg + Solvent 6 ml (6 sets)", price: 300, msrp: 600, info: "Six-set pack of AAPE for scalp and hair restoration treatment series." },
    ],
  },
  {
    title: "Mask",
    blurb: "In-clinic energizing treatment mask.",
    items: [
      { sku: "MK-01", name: "Energetic Galvanic Gold Mask", spec: "6 Masks + 6 Batteries", price: 50, msrp: 100, info: "Self-powered galvanic gold mask that drives serums deeper, brightens and visibly lifts — perfect treatment finisher." },
    ],
  },
];

const allItems: Product[] = catalog.flatMap((g) => g.items);

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
  shipping: z.string().trim().min(5, "Required").max(400),
  po: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

const STORAGE_KEY = "wtbd_exosomes_registration_v1";

type Registration = {
  firstName: string; lastName: string; email: string; phone: string;
  business: string; practiceType: string; licenseType: string; state: string;
};

function Exosomes() {
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
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reg)); } catch { /* ignore */ }
    setRegistration(reg);
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function clearRegistration() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
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
      parsed.error.issues.forEach((i) => { newErrs[i.path[0] as string] = i.message; });
    }
    if (lines.length === 0) newErrs.cart = "Add at least one product to your order.";
    if (Object.keys(newErrs).length) { setOrderErrs(newErrs); return; }
    setOrderErrs({});
    if (registration && parsed.success) {
      const o = parsed.data;
      const linesText = lines
        .map((l) => `  - ${l.q} × ${l.name} (SKU ${l.sku}, ${l.spec}) @ $${l.price.toFixed(2)} = $${(l.q * l.price).toFixed(2)}`)
        .join("\n");
      const body = [
        `New Exosomes order request`,
        ``,
        `--- Practice ---`,
        `Name: ${registration.firstName} ${registration.lastName}`,
        `Business: ${registration.business}`,
        `Practice type: ${registration.practiceType}`,
        `License type: ${registration.licenseType}`,
        `State of license: ${registration.state}`,
        `Email: ${registration.email}`,
        `Phone: ${registration.phone}`,
        ``,
        `--- Order ---`,
        linesText,
        ``,
        `Estimated subtotal: $${subtotal.toFixed(2)}`,
        ``,
        `--- Shipping ---`,
        o.shipping,
        ``,
        `PO #: ${o.po || "(none)"}`,
        `Referred by: ${o.referredBy || "(none)"}`,
        `Notes: ${o.notes || "(none)"}`,
      ].join("\n");
      const subject = `Exosomes order — ${registration.business} ($${subtotal.toFixed(2)})`;
      const mailto = `mailto:admin@thewellnesstech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    }
    setOrderStatus("ok");
    e.currentTarget.reset();
    setQty({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteLayout>
      <section className="border-b border-primary/10 bg-primary/5">
        <div className="container-x py-20 md:py-28">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Aesthetics Line</span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold text-primary md:text-6xl">
            Exosomes for Medical Aesthetics
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Professional exosomes, stem-cell and AAPE systems for in-clinic protocols and at-home patient regimens. Pricing and ordering are reserved for verified medical practitioners, MedSpas and authorized retailers — complete a one-time registration below to unlock the full catalog with SPA and MSRP pricing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-accent">Practice verification required</span>
            <span className="rounded-full border border-primary/15 px-3 py-1 text-primary/70">For licensed professionals</span>
          </div>
        </div>
      </section>


      <section className="border-b border-primary/10 bg-background">
        <div className="container-x py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">About the Manufacturer</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
            ABio Labs — Pioneering Korean exosome biotechnology.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-start">
            <div>
              <h3 className="font-display text-xl font-medium text-primary">A legacy of regenerative science</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary/80">
                ABio Labs was founded in South Korea by a team of stem-cell biologists and dermatology researchers with a shared mission: to translate cutting-edge exosome science into safe, effective aesthetic solutions. Since its inception, ABio has focused exclusively on extracellular vesicle research — becoming one of the earliest Korean laboratories to commercialize lyophilized exosome formulations for professional aesthetic use.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-primary/80">
                The company operates out of KFDA-registered, ISO-certified, cGMP (Current Good Manufacturing Practice) facilities in Korea, where every batch undergoes rigorous quality control — from stem-cell isolation and conditioned-media harvesting to tangential-flow filtration, nanoparticle-tracking analysis (NTA), and full Certificate of Analysis (COA) documentation. cGMP compliance ensures consistent identity, strength, quality and purity of every vial produced.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-2 self-start">
              <img
                src="/images/cgmp-badge.png"
                alt="cGMP Certified — Current Good Manufacturing Practice"
                width={200}
                height={200}
                loading="lazy"
                className="h-40 w-40 object-contain md:h-48 md:w-48"
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">cGMP Certified</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium text-primary">Expertise &amp; innovation</h3>
              <ul className="mt-3 space-y-3 text-sm text-primary/80">
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 rounded-full bg-accent shrink-0" />
                  <span><strong>Stem-cell sourcing mastery:</strong> ABio maintains proprietary protocols for isolating high-purity exosomes from human adipose-derived mesenchymal stem cells (AD-MSCs) as well as plant stem-cell cultures — giving rise to the distinct SX (human-derived) and PX (plant-derived) product series.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 rounded-full bg-accent shrink-0" />
                  <span><strong>Lyophilization leadership:</strong> ABio pioneered the freeze-dried exosome powder format that preserves vesicle integrity at room temperature — eliminating cold-chain logistics while maximizing potency at the point of reconstitution.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 rounded-full bg-accent shrink-0" />
                  <span><strong>Clinical validation:</strong> ABio formulations are used in thousands of aesthetic clinics across Asia and are now expanding into the U.S. market through partnerships with licensed medical distributors — backed by a growing body of clinical outcome data in skin rejuvenation, post-procedure recovery, and hair restoration.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 rounded-full bg-accent shrink-0" />
                  <span><strong>Regulatory rigor:</strong> All ABio products are manufactured under KFDA cGMP standards with full sterility, endotoxin, and particle-count testing — ensuring every vial meets the strictest safety benchmarks for professional in-clinic use.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 rounded-sm border border-primary/10 bg-primary/5 p-5">
            <p className="text-sm leading-relaxed text-primary/80">
              <strong>Why we partner with ABio:</strong> Wellness Tech Bio Distribution selected ABio Labs as our supplier of the Highest Quality Korean Cosmetic Grade Hair and Skincare because of their unwavering commitment to scientific integrity, transparent manufacturing, and practitioner support. Their SX and PX series — along with the premium Celexo Black Label and AAPE lines — give U.S. aesthetic practices access to the same exosome technology that has defined the Korean regenerative-aesthetics market for over a decade.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Why High quality Cosmetic Grade Korean Exosomes</span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              The global standard in regenerative aesthetics.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary/80">
              South Korea is the world leader in exosomes science for medical aesthetics. Korean biotech laboratories pioneered the lyophilized (freeze-dried) exosomes format that is now the gold standard for in-clinic skin and hair rejuvenation — backed by a decade of clinical research, KFDA-grade manufacturing, and the most published aesthetic outcomes data of any region.
            </p>
            <div className="mt-6 overflow-hidden rounded-sm border border-primary/10">
              <img src={abioExosomesHero} alt="ABio Korean exosome skin booster product line" width={1280} height={896} loading="lazy" className="h-64 w-full object-cover md:h-80" />
            </div>
          </div>
          <div className="md:col-span-7">
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Source</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Plant & stem-cell derived</h3>
                <p className="mt-2 text-sm text-muted-foreground">high quality cosmetic grade Korean exosomes are isolated from rose stem cells, edelweiss, salmon DNA, and human adipose-derived MSCs — purified to billions of vesicles per dose with cytokine, growth-factor and microRNA payloads.</p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Manufacturing</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">KFDA cGMP facilities</h3>
                <p className="mt-2 text-sm text-muted-foreground">Produced in KFDA-registered ISO-certified clean rooms with tangential flow filtration, sterility & endotoxin testing, NTA particle counting and full COA per lot.</p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Format</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Lyophilized stability</h3>
                <p className="mt-2 text-sm text-muted-foreground">Freeze-dried powder + sterile solvent preserves vesicle integrity at room temperature — reconstituted chairside for maximum potency at the point of treatment.</p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Clinical use</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Post-procedure & standalone</h3>
                <p className="mt-2 text-sm text-muted-foreground">Used worldwide after microneedling, RF, fractional laser and PRP for accelerated healing, brightening, pore refinement, scalp restoration and anti-aging dermal density.</p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5 sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Regulatory note</div>
                <p className="mt-2 text-sm text-muted-foreground">In the U.S., exosomes are not FDA-approved injectables. Our high quality cosmetic grade Korean exosomes are supplied for topical application following microchannel-creating procedures (microneedling, RF microneedling, fractional laser) at the discretion of a licensed medical professional. Practice verification is required before purchase.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {!registration && (
        <section id="register" className="border-b border-primary/10 bg-primary text-primary-foreground">
          <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Step 1 — Practice Registration</span>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Register your practice to unlock ordering.</h2>
              <p className="mt-3 text-sm text-primary-foreground/90">
                Pricing and ordering are restricted to licensed medical practitioners (MD, DO, NP, PA, RN under medical direction), MedSpas and authorized aesthetic retailers. Submit your credentials once — SPA pricing, suggested retail and the online order form will open.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-primary-foreground/85">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-accent shrink-0" /> One-time form per practice</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-accent shrink-0" /> Credentials reviewed before first ship</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-accent shrink-0" /> No charges until a rep confirms your order</li>
              </ul>
            </div>
            <form onSubmit={onRegister} className="md:col-span-7 rounded-sm border border-primary-foreground/25 bg-background p-6 text-foreground md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field name="firstName" label="First name" error={regErrs.firstName} />
                <Field name="lastName" label="Last name" error={regErrs.lastName} />
                <Field name="email" label="Practice email" type="email" error={regErrs.email} />
                <Field name="phone" label="Phone" error={regErrs.phone} />
                <Field name="business" label="Business name" error={regErrs.business} />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Type of practice</span>
                  <select
                    name="practiceType"
                    defaultValue=""
                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    <option value="" disabled>Select one…</option>
                    <option value="Medical practitioner">Medical practitioner</option>
                    <option value="Wellness clinic">Wellness clinic</option>
                    <option value="Esthecian">Esthecian</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Other">Other</option>
                  </select>
                  {regErrs.practiceType && <span className="mt-1 block text-xs text-destructive">{regErrs.practiceType}</span>}
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
                  {regErrs.hasMedicalDirector && <span className="mt-1 block text-xs text-destructive">{regErrs.hasMedicalDirector}</span>}
                </div>
                <div className="md:col-span-2">
                  <Field name="referredBy" label="Referred by (optional)" error={regErrs.referredBy} />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-start gap-2 text-xs text-primary/80">
                    <input type="checkbox" name="agree" className="mt-0.5" />
                    <span>I confirm I am a licensed medical professional or authorized representative of a licensed medical practice, Esthecian, or retailer and these products will be used in compliance with applicable state and federal regulations.</span>
                  </label>
                  {regErrs.agree && <span className="mt-1 block text-xs text-destructive">{regErrs.agree}</span>}
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Register & unlock order form <ArrowUpRight className="size-4" />
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="border-b border-primary/10 bg-background">
        <div className="container-x py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Exosomes in Action</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
            See the science up close.
          </h2>
          <div className="mt-8 overflow-hidden rounded-sm border border-primary/10 bg-card">
            <video
              src="/videos/exosomes-1.mov"
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
              <video src="/videos/exosomes-2.mp4" controls playsInline preload="metadata" className="h-auto w-full" />
            </div>
            <div className="overflow-hidden rounded-sm border border-primary/10 bg-card">
              <video src="/videos/exosomes-3.mp4" controls playsInline preload="metadata" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      {orderStatus === "ok" && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="container-x py-4 text-sm text-primary">
            Thank you — your order request was received. A representative will confirm pricing and shipping shortly.
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
                setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 50);
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

      {(!registration || activeTab === "catalog") && catalog.map((group, idx) => (
        <section key={group.title} className="border-b border-primary/10">
          <div className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-16">
            <div className="md:col-span-4">
              <div className="sticky top-24">
                <div className="text-xs uppercase tracking-widest text-accent">
                  {String(idx + 1).padStart(2, "0")} / {String(catalog.length).padStart(2, "0")}
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">{group.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{group.blurb}</p>
              </div>
            </div>
            <div className="md:col-span-8">
              <ul className="divide-y divide-primary/10 border-y border-primary/10">
                {group.items.map((it) => (
                  <li key={it.sku} className="py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-base font-medium text-primary md:text-lg">{it.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{it.spec}</div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-primary/50">SKU {it.sku}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {registration ? (
                          <div className="text-right">
                            <div className="font-display text-lg font-semibold text-primary">${it.price.toFixed(2)}</div>
                            <div className="text-[10px] uppercase tracking-widest text-accent">SPA / your cost</div>
                            <div className="mt-1 text-sm text-primary/70">MSRP ${it.msrp.toFixed(2)}</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Suggested resale</div>
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 rounded-sm border border-primary/15 bg-primary/5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                              <Lock className="size-3" /> Price after verification
                            </div>
                          </div>
                        )}
                        {registration ? (
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={999}
                            value={qty[it.sku] || ""}
                            onChange={(e) => setItem(it.sku, parseInt(e.target.value, 10))}
                            placeholder="0"
                            aria-label={`Quantity for ${it.name}`}
                            className="w-20 rounded-sm border border-input bg-background px-3 py-2 text-center text-sm outline-none focus:border-accent"
                          />
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
                <CheckCircle2 className="size-4" /> Verified — Step 2 Online Order
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">Your order summary</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Registered as <span className="font-medium text-primary">{registration.firstName} {registration.lastName}</span> · {registration.business}.{" "}
                <button type="button" onClick={clearRegistration} className="underline hover:text-accent">Not you? Reset</button>
              </p>
              <div className="mt-6 rounded-sm border border-primary/10 bg-background p-5">
                {lines.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="size-4" /> No items selected yet — set quantities above.
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-primary/10 text-sm">
                      {lines.map((l) => (
                        <li key={l.sku} className="flex items-start justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <div className="font-medium text-primary">{l.name}</div>
                            <div className="text-xs text-muted-foreground">{l.spec} · SKU {l.sku}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-primary">{l.q} × ${l.price.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">${(l.q * l.price).toFixed(2)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3">
                      <span className="text-xs uppercase tracking-widest text-primary/70">Estimated subtotal</span>
                      <span className="font-display text-xl font-semibold text-primary">${subtotal.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
              {orderErrs.cart && <p className="mt-3 text-xs text-destructive">{orderErrs.cart}</p>}
            </div>

            <form onSubmit={onOrder} className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-6 md:p-8">
              <div className="grid gap-5">
                <Field name="shipping" label="Shipping address" textarea rows={3} error={orderErrs.shipping} />
                <Field name="po" label="PO # (optional)" error={orderErrs.po} />
                <Field name="notes" label="Order notes (optional)" textarea rows={3} error={orderErrs.notes} />
                <Field name="referredBy" label="Referred by (optional)" error={orderErrs.referredBy} />
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Submitting this form is a quote / order request. A representative will confirm availability, final pricing and payment instructions before any product ships.
              </p>
              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Submit order request <ArrowUpRight className="size-4" />
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
              Product catalogs, clinical leaflets and brochures for the Celexo, Lumidor and AAPE exosome lines — unlocked for your verified practice.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                { href: "/docs/ABIO_LUMIDOR_Catalogue.pdf", title: "ABio Lumidor — Master Catalogue", desc: "Complete product catalog across the Lumidor and Celexo aesthetic lines." },
                { href: "/docs/Celexo_Exo-Cica_Black_Label.pdf", title: "Celexo Exo-Cica & Black Label", desc: "Premium lyophilized exosome boosters — flagship skin & hair formulas." },
                { href: "/docs/Celexo_Exo-Cica_Brochure.pdf", title: "Celexo Exo-Cica — 12p Brochure", desc: "Centella-based calming exosome system for post-procedure recovery." },
                { href: "/docs/Celexo_Hydro_Gel_Product_Material.pdf", title: "Celexo Hydro Gel — Product Material", desc: "Hydro gel format technical sheet and clinical use cases." },
                { href: "/docs/CellExosome_Black_Label_Hair_Leaflet.pdf", title: "Black Label Hair — Clinical Leaflet", desc: "Exosome hair booster leaflet — protocols for androgenic alopecia & density." },
                { href: "/docs/Lumidor_Hair_Brochure.pdf", title: "Lumidor Hair — Brochure", desc: "Full Lumidor hair restoration line — AAPE, exosomes and scalp care." },
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
                      <div className="font-display text-base font-medium text-primary group-hover:text-accent">{r.title}</div>
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
        Wellness Tech Bio Distribution facilitates ordering for licensed medical professionals. Products are not intended for resale to consumers. Specifications and pricing subject to change.
      </p>

    </SiteLayout>
  );
}

function Field({
  name, label, type = "text", textarea, rows = 4, error,
}: { name: string; label: string; type?: string; textarea?: boolean; rows?: number; error?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      {textarea ? (
        <textarea name={name} rows={rows} maxLength={1000}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
      ) : (
        <input name={name} type={type} maxLength={255}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
