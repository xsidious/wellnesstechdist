import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpRight, GraduationCap, Video, Users, CheckCircle2, Clock } from "lucide-react";
import peopleTraining from "@/assets/people-training.jpg";
import foodNutrition from "@/assets/food-nutrition.jpg";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Practitioner Training — Icoone, Exosomes & Peptides — Wellness Tech Bio Distribution" },
      { name: "description", content: "Fee-based online and live training for licensed practitioners. Master Icoone body & face treatments, exosome aesthetic protocols, and peptide therapeutics." },
      { property: "og:title", content: "Practitioner Training — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "Fee-based CE-style training in Icoone, Exosomes and Peptides for licensed practitioners." },
    ],
  }),
  component: Training,
});

type Course = {
  id: string;
  track: "Icoone" | "Exosomes" | "Peptides" | "Nutrition";
  title: string;
  format: "Online" | "Live";
  hours: string;
  price: number;
  blurb: string;
  highlights: string[];
};

const courses: Course[] = [
  {
    id: "ico-online",
    track: "Icoone",
    title: "Icoone Foundations — Online",
    format: "Online",
    hours: "6 hrs · self-paced",
    price: 619,
    blurb: "Master the fundamentals of Icoone Roboderm® multi-micro-stimulation for face and body treatments.",
    highlights: ["Device mechanics & safety", "Face & body protocols", "Patient consultation scripts", "Certificate of completion"],
  },
  {
    id: "ico-live",
    track: "Icoone",
    title: "Icoone Hands-On Live Workshop",
    format: "Live",
    hours: "1 day · 8 hrs · in-person",
    price: 1869,
    blurb: "Small-group, hands-on workshop with live model practice. Includes certification and starter protocol library.",
    highlights: ["Live model practice", "Cellulite & lymphatic protocols", "Post-surgical recovery cases", "Small group (max 8)"],
  },
  {
    id: "exo-online",
    track: "Exosomes",
    title: "Exosome Aesthetics Foundations — Online",
    format: "Online",
    hours: "4 hrs · self-paced",
    price: 494,
    blurb: "Clinical science of exosomes and AAPE: indications, contraindications and combination with microneedling, RF and laser.",
    highlights: ["Mechanism of action", "Patient selection", "Topical vs in-channel delivery", "Marketing & consent templates"],
  },
  {
    id: "exo-live",
    track: "Exosomes",
    title: "Exosome Injector Live Masterclass",
    format: "Live",
    hours: "1 day · 7 hrs · in-person",
    price: 1619,
    blurb: "Live, hands-on training on exosomes and AAPE injection technique for face, scalp and body.",
    highlights: ["Reconstitution & handling", "Scalp/hair restoration protocol", "Face & neck rejuvenation", "Combination treatment plans"],
  },
  {
    id: "pep-online",
    track: "Peptides",
    title: "Peptide Therapeutics Foundations — Online",
    format: "Online",
    hours: "8 hrs · self-paced",
    price: 744,
    blurb: "GLP-1, BPC-157, CJC/Ipamorelin, NAD+ and more — clinical foundations, dosing, monitoring and compliance.",
    highlights: ["503A vs 503B sourcing", "Weight management protocols", "Recovery & longevity stacks", "Compliance & documentation"],
  },
  {
    id: "pep-live",
    track: "Peptides",
    title: "Peptide Practice Intensive — Live",
    format: "Live",
    hours: "2 days · 14 hrs · in-person",
    price: 3119,
    blurb: "Two-day intensive for physicians and prescribers building or scaling a peptide therapy program.",
    highlights: ["Case-based dosing labs", "Patient workups", "Compounding partner workflow", "Marketing & practice integration"],
  },
  {
    id: "nut-online-basic",
    track: "Nutrition",
    title: "Basics in Nutrition — Online",
    format: "Online",
    hours: "5 hrs · self-paced",
    price: 299,
    blurb: "Foundational nutrition principles for practitioners and consumers. Led by a certified nutritionist.",
    highlights: ["Macronutrient fundamentals", "Reading food labels", "Meal planning basics", "Certificate of completion"],
  },
  {
    id: "nut-online-guide",
    track: "Nutrition",
    title: "Nutritional Guidance — Online",
    format: "Online",
    hours: "6 hrs · self-paced",
    price: 349,
    blurb: "Advanced nutritional guidance tailored for practitioners and consumers seeking to optimize wellness outcomes. Led by a certified nutritionist.",
    highlights: ["Client coaching techniques", "Supplement protocols", "Metabolic health strategies", "Long-term plan development"],
  },
];

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Required").max(30),
  clinic: z.string().trim().min(2, "Required").max(150),
  role: z.string().trim().min(2, "Required").max(80),
  state: z.string().trim().min(2, "Required").max(60),
  experience: z.string().trim().min(1, "Required").max(40),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
  agree: z.literal("on", { message: "You must agree to the terms" }),
});

function Training() {
  const [selected, setSelected] = useState<string[]>([]);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    const newErrs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => { newErrs[i.path[0] as string] = i.message; });
    }
    if (selected.length === 0) newErrs.courses = "Select at least one course.";
    if (Object.keys(newErrs).length) { setErrs(newErrs); return; }
    setErrs({});
    setStatus("ok");
    e.currentTarget.reset();
    setSelected([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const tracks: Course["track"][] = ["Icoone", "Exosomes", "Peptides", "Nutrition"];

  return (
    <SiteLayout>
      <section className="border-b border-primary/10 bg-primary text-primary-foreground">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Practitioner Training</span>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold md:text-6xl">
              Coming Soon
            </h1>
            <p className="mt-6 max-w-2xl text-primary-foreground/90">
              Icoone, Exosomes, Peptides and Nutrition training programs are in development. Enrollments will open for licensed practitioners and wellness professionals. Build clinical confidence, add new revenue lines and meet documentation standards across four high-demand modalities.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-widest text-primary-foreground/85">
              <span className="inline-flex items-center gap-2"><Clock className="size-4 text-accent" /> Launching soon</span>
              <span className="inline-flex items-center gap-2"><Video className="size-4 text-accent" /> Online & self-paced</span>
              <span className="inline-flex items-center gap-2"><Users className="size-4 text-accent" /> Small-group live workshops</span>
              <span className="inline-flex items-center gap-2"><GraduationCap className="size-4 text-accent" /> Certificate of completion</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-sm border border-accent/30">
              <img src={peopleTraining} alt="Medical practitioners in a hands-on training workshop" width={1280} height={896} loading="lazy" className="h-64 w-full object-cover md:h-full" />
            </div>
          </div>
        </div>
      </section>

      {status === "ok" && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="container-x py-4 text-sm text-primary">
            Thank you — your training enrollment request was received. We'll send dates, payment instructions and onboarding details shortly.
          </div>
        </div>
      )}

      {tracks.map((track, idx) => (
        <section key={track} className="border-b border-primary/10">
          <div className="container-x grid gap-10 py-14 md:grid-cols-12 md:py-16">
            <div className="md:col-span-4">
              <div className="sticky top-24">
                <div className="text-xs uppercase tracking-widest text-accent">
                  Track {String(idx + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-2 font-display text-3xl font-semibold text-primary">{track}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {track === "Icoone" && "Non-invasive Roboderm® micro-stimulation for face, body, lymphatic and post-surgical recovery."}
                  {track === "Exosomes" && "Exosome and AAPE protocols for skin rejuvenation, hair restoration and combination aesthetic treatments."}
                  {track === "Peptides" && "Clinical use of GLP-1s, recovery and longevity peptides — sourcing, dosing, compliance and patient management."}
                  {track === "Nutrition" && "General nutrition education designed to integrate into a clinical or wellness practice, plus practical guidance on how to eat when taking GLP-1\u2019s and peptides to obtain and maintain healthy habits. Led by a certified nutritionist."}
                </p>
                {track === "Nutrition" && (
                  <div className="mt-5 overflow-hidden rounded-sm border border-primary/10">
                    <img src={foodNutrition} alt="Healthy meal with fresh vegetables and lean protein" width={1024} height={768} loading="lazy" className="h-56 w-full object-cover bg-background" />
                    <div className="bg-card px-4 py-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">Nutrition Training</span> · Led by a certified nutritionist
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-8 grid gap-5">
              {courses.filter((c) => c.track === track).map((c) => {
                const checked = selected.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`block cursor-pointer rounded-sm border p-5 transition ${checked ? "border-accent bg-accent/5" : "border-primary/10 bg-card hover:border-accent/40"}`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(c.id)}
                        className="mt-1.5"
                        aria-label={`Select ${c.title}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display text-lg font-medium text-primary">{c.title}</div>
                            <div className="mt-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">{c.format}</span>
                              <span className="rounded-full border border-primary/15 px-2 py-0.5 text-primary/70">{c.hours}</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-primary/80">{c.blurb}</p>
                        <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground md:grid-cols-2">
                          {c.highlights.map((h) => (
                            <li key={h} className="flex gap-1.5"><CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section id="signup" className="border-b border-primary/10 bg-primary/5">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Enroll</span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">Training signup</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Select your courses above, complete the form, and our education team will confirm dates and payment. Live workshops are held in small groups — early signup is recommended.
            </p>
            <div className="mt-6 rounded-sm border border-primary/10 bg-background p-5">
              {selected.length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses selected yet — pick one or more above.</p>
              ) : (
                <ul className="divide-y divide-primary/10 text-sm">
                  {courses.filter((c) => selected.includes(c.id)).map((c) => (
                    <li key={c.id} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <div className="font-medium text-primary">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.track} · {c.format} · {c.hours}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errs.courses && <p className="mt-3 text-xs text-destructive">{errs.courses}</p>}
          </div>

          <form onSubmit={onSubmit} className="md:col-span-7 rounded-sm border border-primary/10 bg-card p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="name" label="Full name" error={errs.name} />
              <Field name="email" label="Email" type="email" error={errs.email} />
              <Field name="phone" label="Phone" error={errs.phone} />
              <Field name="clinic" label="Clinic / practice" error={errs.clinic} />
              <Field name="role" label="Role (MD, DO, NP, PA, RN, Aesthetician)" error={errs.role} />
              <Field name="state" label="State of licensure" error={errs.state} />
              <label className="block md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Experience level</span>
                <select name="experience" defaultValue="" className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent">
                  <option value="" disabled>Select experience</option>
                  <option>New to this modality</option>
                  <option>Some prior training</option>
                  <option>Experienced — advanced refresher</option>
                </select>
                {errs.experience && <span className="mt-1 block text-xs text-destructive">{errs.experience}</span>}
              </label>
              <div className="md:col-span-2">
                <Field name="notes" label="Goals or questions (optional)" textarea rows={3} error={errs.notes} />
              </div>
              <div className="md:col-span-2">
                <Field name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
              </div>
              <div className="md:col-span-2">
                <label className="inline-flex items-start gap-2 text-xs text-primary/80">
                  <input type="checkbox" name="agree" className="mt-0.5" />
                  <span>I understand training is fee-based, registration is confirmed only after payment, and refund / reschedule terms will be shared with my confirmation.</span>
                </label>
                {errs.agree && <span className="mt-1 block text-xs text-destructive">{errs.agree}</span>}
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Submit enrollment request <ArrowUpRight className="size-4" />
            </button>
          </form>
        </div>
      </section>

      <p className="container-x py-8 text-center text-xs text-muted-foreground">
        Training is intended for licensed medical and aesthetic professionals. Completion certificates document attendance and content covered; CE credit varies by jurisdiction.
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
