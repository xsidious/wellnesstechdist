import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, FlaskConical, Stethoscope, FileDown, Users, Link2, PackageCheck, ClipboardCheck, Lock, BadgeDollarSign, Cpu } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CatalogEmbed } from "@/components/CatalogEmbed";
import { useState } from "react";
import { z } from "zod";
import { useAccess, grantAccess } from "@/lib/access";
import { CatalogAccessGate } from "@/components/CatalogAccessGate";
import hero from "@/assets/hero.jpg";
import peopleTeam from "@/assets/people-team.jpg";
import peopleConsult from "@/assets/people-consult.jpg";
import abioExosomesProduct from "@/assets/abio-exosomes-product.jpg";
import cellExosomeBlack from "@/assets/cellexosome-black-label.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wellness Tech Bio Distribution — Compounded Rx Resource for Practitioners" },
      { name: "description", content: "503A & 503B compounded GLP-1s, peptides, NAD+ and hormone therapies for licensed physicians, clinics, and accredited sales affiliates." },
      { property: "og:title", content: "Wellness Tech Bio Distribution" },
      { property: "og:description", content: "100+ compounded Rx products. Physician-supervised. Practitioner-only." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-55">
          <img src={hero} alt="" width={1600} height={1200} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" />
        </div>
        <div className="container-x relative grid gap-12 py-28 md:grid-cols-12 md:py-40">
          <div className="md:col-span-8">
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
              Precision <span className="italic text-accent">peptides</span>, exosomes & aesthetic equipment for physicians, MedSpa, Aesthetic practitioners and Clinics.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
              Wellness Tech Bio Distribution is a trusted resource for pharmaceutical-grade compounded peptide therapies, GLP-1 products, high quality cosmetic grade Korean exosomes, clinical aesthetic equipment, and medical-grade beauty and wellness equipment and education — connecting licensed physicians and medical practices with verified 503A/503B compounding partners and device manufacturers to deliver individualized, evidence-informed, results-focused medicine. Wellness Tech specializes in teaching practitioners how to best utilize their equipment and products through comprehensive educational programs designed to maximize clinical outcomes and increase return on investment.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#catalog" className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft">
                Browse Compounded Therapies <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link to="/affiliates" className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/50 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition hover:bg-primary-foreground/10">
                Become an Affiliate
              </Link>
              <a href="https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-sm border border-accent/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent transition hover:bg-accent/10">
                Become a Prescriber <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
        <div className="relative border-t border-primary-foreground/25">
          <div className="container-x grid grid-cols-2 gap-8 py-8 text-sm md:grid-cols-4">
            {[
              { k: "100+", v: "Compounded Rx products" },
              { k: "503A/B", v: "Certified compounding" },
              { k: "Rx Only", v: "Physician supervised" },
              { k: "24/7", v: "Clinical support" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl text-accent">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/80">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="container-x py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Therapeutic verticals</span>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-primary md:text-5xl">Compounded Rx & high quality cosmetic grade Korean exosomes. One standard of quality.</h2>
          </div>
        </div>
        <div className="mt-14">
          <CatalogEmbed />
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 overflow-hidden rounded-sm border border-primary/10 bg-black">
            <img src={cellExosomeBlack} alt="CellExosome Black Label — Korean stem cell exosome skin booster" width={1200} height={1800} loading="lazy" className="h-72 w-full object-contain md:h-[28rem]" />
          </div>
          <div className="md:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">New — Now available</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">high quality cosmetic grade Korean exosomes for regenerative aesthetics.</h2>
            <p className="mt-5 text-muted-foreground">
              Lyophilized exosome boosters, stem-cell serums and AAPE systems from leading Korean biotech labs — now distributed alongside our compounded Rx catalog. Two clinical lines for distinct indications:
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><span className="mt-1 inline-block size-2 rounded-full bg-accent" /><span><strong className="text-primary">SX Series</strong> — <span className="text-muted-foreground">Human-derived exosomes. Stem-cell rejuvenation for mature or photo-aged skin.</span></span></li>
              <li className="flex gap-3"><span className="mt-1 inline-block size-2 rounded-full bg-accent" /><span><strong className="text-primary">PX Series</strong> — <span className="text-muted-foreground">Plant-derived exosomes. Daily aesthetic refinement — pore, oil balance and calming.</span></span></li>
              <li className="flex gap-3"><span className="mt-1 inline-block size-2 rounded-full bg-accent" /><span><strong className="text-primary">Black Label & Hair</strong> — <span className="text-muted-foreground">Microneedling, scalp and post-procedure protocols.</span></span></li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/exosomes" className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                Explore exosomes <ArrowUpRight className="size-4" />
              </Link>
              <Link to="/exosomes" className="inline-flex items-center gap-2 rounded-sm border border-primary/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary hover:border-accent hover:text-accent">
                Register to order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-24 md:py-32">
        <div className="container-x">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Who we serve</span>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-primary md:text-5xl">Built for the practices defining modern medicine.</h2>
          <div className="mt-10 overflow-hidden rounded-sm border border-primary/10">
            <img src={peopleTeam} alt="Diverse team of medical aesthetic practitioners in a modern clinic" width={1280} height={896} loading="lazy" className="h-64 w-full object-cover md:h-96" />
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Medical practices & weight loss clinics",
              "Anti-aging & longevity specialists",
              "Sports medicine & performance physicians",
              "Hormone & functional medicine providers",
              "Aesthetic & regenerative practices",
              "Sales affiliates & territory reps",
              "Independent prescribers & telehealth physicians",
            ].map((w) => (
              <div key={w} className="bg-background p-8">
                <Stethoscope className="size-5 text-accent" />
                <div className="mt-4 font-display text-lg font-medium text-primary">{w}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">How it works</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">A direct line to verified compounding partners.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Wellness Tech Bio Distribution is not a distributor — we are a clinical resource that connects licensed physicians and medical practices with rigorously vetted 503A and 503B compounding partners.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-sm border border-primary/10">
          <img src={peopleConsult} alt="Physician consulting with a patient across a clean modern office desk" width={1280} height={896} loading="lazy" className="h-64 w-full object-cover md:h-96" />
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {[
            { icon: Users, step: "01", title: "Connect", desc: "Licensed physicians and practices register with Wellness Tech Bio Distribution and submit their prescribing credentials." },
            { icon: Link2, step: "02", title: "Match", desc: "We match your practice with verified 503A patient-specific or 503B outsourcing compounding partners." },
            { icon: ClipboardCheck, step: "03", title: "Prescribe", desc: "You write the Rx. Our partner pharmacies compound to spec under your clinical direction — never off-the-shelf." },
            { icon: PackageCheck, step: "04", title: "Fulfill", desc: "Medication is shipped directly to your practice or patient. We track logistics and support continuity of care." },
          ].map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <s.icon className="size-6 text-accent" />
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent">{s.step}</div>
              <h3 className="mt-2 font-display text-xl font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="inline-block rounded-sm border border-primary/10 bg-primary/5 px-6 py-3 text-sm text-muted-foreground">
            All partners are verified for USP compliance, FDA 503A/503B registration, and state board licensure.
          </p>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Why choose us</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">What makes us different.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Quality", desc: "USP-grade compounds, batch-tested and certified. Every product meets rigorous pharmaceutical standards before it reaches your practice." },
            { icon: BadgeDollarSign, title: "Price", desc: "Competitive wholesale pricing with volume discounts. We negotiate directly with partners to pass savings on to your practice." },
            { icon: Cpu, title: "Advanced Technology", desc: "Cutting-edge compounding technology, next-generation peptide synthesis, and the latest in high quality cosmetic grade Korean exosomes and aesthetic innovations." },
          ].map((d) => (
            <div key={d.title} className="rounded-sm border border-primary/10 bg-card p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <d.icon className="size-7 text-accent" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-primary">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 py-24 md:py-32">
        <div className="container-x">
          <span className="text-base font-semibold uppercase tracking-widest text-accent">Who we serve</span>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-primary md:text-5xl">Built for the practices defining modern medicine.</h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Medical practices & weight loss clinics",
              "Anti-aging & longevity specialists",
              "Sports medicine & performance physicians",
              "Hormone & functional medicine providers",
              "Aesthetic & regenerative practices",
              "Sales affiliates & territory reps",
              "Independent prescribers & telehealth physicians",
            ].map((w) => (
              <div key={w} className="bg-background p-8">
                <Stethoscope className="size-5 text-accent" />
                <div className="mt-4 font-display text-lg font-medium text-primary">{w}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DownloadsSection />

      <ResourcesSection />

      <RegistrationSection />
    </SiteLayout>
  );
}

const downloads = [
  { name: "Precision Peptide Therapy — Marketing Catalog", file: "/docs/WellnessTechBio_Marketing_Presentation.pdf" },
  { name: "Compounded Wellness Protocols — Sales Sheet", file: "/docs/Compounded_Wellness_Sales_Sheet.pdf" },
  { name: "503A & 503B Contraindication Reference", file: "/docs/503A_503B_With_Contraindications.pdf" },
];

function DownloadsSection() {
  const access = useAccess();
  const unlocked = !!access;
  return (
    <section className="bg-primary py-24 text-primary-foreground md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="text-base font-semibold uppercase tracking-widest text-accent">Resources</span>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Download our practitioner materials.</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/85">Full catalog, compounded wellness protocols, and 503A/503B contraindication reference — available to verified registered practitioners and affiliates.</p>
          {unlocked && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
              Access granted — {access?.role}
            </p>
          )}
        </div>
        <div className="md:col-span-5 space-y-3">
          {unlocked ? (
            downloads.map((d) => (
              <a
                key={d.file}
                href={d.file}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-sm border border-accent/30 bg-primary/40 p-5 transition hover:border-accent hover:bg-primary/60"
              >
                <div className="flex items-center gap-3">
                  <FileDown className="size-5 text-accent" />
                  <span className="text-sm font-medium">{d.name}</span>
                </div>
                <ArrowUpRight className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))
          ) : (
            <LockedPanel />
          )}
        </div>
      </div>
    </section>
  );
}

function LockedPanel() {
  return (
    <div className="rounded-sm border border-accent/30 bg-primary/40 p-6">
      <div className="flex items-center gap-2 text-accent">
        <Lock className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Verified access required</span>
      </div>
      <p className="mt-3 text-sm text-primary-foreground/90">
        Catalogs, downloads and marketing tools are restricted to verified practitioners and affiliates. Complete the request form below to unlock.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-primary-foreground/90">
        {downloads.map((d) => (
          <li key={d.file} className="flex items-center gap-2 opacity-70">
            <Lock className="size-3.5 text-accent" /> {d.name}
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-sm bg-background p-1">
        <CatalogAccessGate source="home_downloads" />
      </div>
    </div>
  );
}

const resources = [
  { title: "Compounded Peptides", desc: "503A & 503B compounded peptide therapies — BPC-157, TB-500, GHK-Cu, CJC-1295, and signature blends.", to: "/products" },
  { title: "GLP-1 Therapies", desc: "Semaglutide, Tirzepatide, and Retatrutide — injectable and sublingual formulations for weight management.", to: "/products" },
  { title: "High quality Cosmetic Grade Korean Exosomes", desc: "Premium high quality cosmetic grade Korean exosome therapies for medical aesthetics — SX, PX, Spicule, hair, and skin booster lines.", to: "/exosomes" },
  { title: "Aesthetic & Medical Devices", desc: "Distribution of clinical aesthetic devices, injectables ancillaries, and medical supplies for modern practices.", to: "/supplies" },
];

function ResourcesSection() {
  const access = useAccess();
  const unlocked = !!access;
  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-base font-semibold uppercase tracking-widest text-accent">Practitioner resources</span>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-primary md:text-5xl">A single source for the modalities defining today's practice.</h2>
          {!unlocked && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/70">
              <Lock className="size-3" /> Verified practitioners & affiliates only
            </p>
          )}
        </div>
      </div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-2">
        {resources.map((r, i) =>
          unlocked ? (
            <Link key={r.title} to={r.to} className="group bg-background p-8 transition hover:bg-primary/5">
              <ResourceCardContent index={i} title={r.title} desc={r.desc} locked={false} />
            </Link>
          ) : (
            <a key={r.title} href="#register" className="group bg-background p-8 transition hover:bg-primary/5">
              <ResourceCardContent index={i} title={r.title} desc={r.desc} locked />
            </a>
          ),
        )}
      </div>
      {!unlocked && (
        <p className="mt-6 text-sm text-muted-foreground">
          Register your practice below or{" "}
          <Link to="/affiliates" className="text-primary underline-offset-4 hover:underline">
            apply as an affiliate
          </Link>{" "}
          to unlock these pages.
        </p>
      )}
    </section>
  );
}

function ResourceCardContent({ index, title, desc, locked }: { index: number; title: string; desc: string; locked: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-accent">0{index + 1}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
        {locked && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary/60">
            <Lock className="size-3" /> Locked — register to access
          </span>
        )}
      </div>
      {locked ? (
        <Lock className="mt-1 size-5 shrink-0 text-primary/40" />
      ) : (
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      )}
    </div>
  );
}

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  practice: z.string().trim().min(2, "Practice name is required").max(150),
  address: z.string().trim().min(5, "Address is required").max(250),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  referral: z.string().trim().min(2, "Please tell us how you heard about us").max(200),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

function RegistrationSection() {
  const [status, setStatus] = useState<"idle" | "ok">("idle");
  const [errs, setErrs] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
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
          <span className="text-base font-semibold uppercase tracking-widest text-accent">Register your practice</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">Get connected to our practitioner network.</h2>
          <p className="mt-4 text-muted-foreground">Tell us about your practice and we'll follow up with catalog access, pricing, and onboarding for exosomes, peptides, GLP-1s, and aesthetic devices. Registration unlocks the practitioner resources and download library on this device.</p>
          <p className="mt-3 text-sm text-muted-foreground">Affiliates:{" "}
            <Link to="/affiliates" className="text-primary underline-offset-4 hover:underline">apply here</Link>{" "}
            to gain the same access.
          </p>
        </div>
        <form onSubmit={onSubmit} className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-8 md:p-10">
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
          {status === "ok" && <p className="mt-4 text-sm text-accent">Thanks — your registration was received. We'll be in touch shortly.</p>}
          <button type="submit" className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
            Register practice <ArrowUpRight className="size-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function RField({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      <input name={name} type={type} maxLength={255} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
