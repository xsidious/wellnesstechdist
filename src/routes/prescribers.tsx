import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpRight, ShieldCheck, FileCheck2, Stethoscope, ClipboardList } from "lucide-react";
import peoplePhysician from "@/assets/people-physician.jpg";

export const Route = createFileRoute("/prescribers")({
  head: () => ({
    meta: [
      { title: "Become a Prescriber — Wellness Tech Bio Distribution" },
      { name: "description", content: "Licensed physicians: request prescriber access to Wellness Tech Bio Distribution's 503A & 503B compounded GLP-1, peptides, NAD+ and hormone therapy network." },
      { property: "og:title", content: "Become a Prescriber — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "Start your prescriber onboarding. Verified physicians only." },
    ],
  }),
  component: Prescribers,
});

const PRESCRIBES_URL = "https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x";

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Required").max(30),
  clinic: z.string().trim().min(2, "Required").max(150),
  state: z.string().trim().min(2, "Required").max(60),
  specialty: z.string().trim().min(2, "Required").max(120),
  interest: z.string().trim().min(1, "Select one").max(120),
  hasDeaNpi: z.enum(["yes", "no"], { message: "Select yes or no" }),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  referredBy: z.string().trim().max(150).optional().or(z.literal("")),
});

const highlights = [
  { icon: ShieldCheck, title: "503A & 503B verified", desc: "Order from a vetted network of state- and FDA-registered compounding partners." },
  { icon: FileCheck2, title: "Credentialing handled", desc: "We verify NPI, DEA and state license, then activate prescribing access." },
  { icon: Stethoscope, title: "Clinical protocols", desc: "Dosing guides, contraindications and patient education for every category." },
  { icon: ClipboardList, title: "Direct-to-patient fulfillment", desc: "Patient-specific Rx shipped from the partner pharmacy — no inventory." },
];

function Prescribers() {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrs(fe);
      setBlocked(false);
      return;
    }
    setErrs({});
    if (parsed.data.hasDeaNpi !== "yes") {
      setBlocked(true);
      setSubmitting(false);
      return;
    }
    setBlocked(false);
    setSubmitting(true);
    // Brief delay so the user sees the confirmation state, then redirect to prescribeUSA.com
    window.setTimeout(() => {
      window.location.href = PRESCRIBES_URL;
    }, 900);
  }

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x py-24 md:py-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">For licensed physicians</span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">
            Become a <span className="italic text-accent">prescriber</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/90">
            Tell us about your practice. After you complete and submit this form, verified physicians will be routed to our partner registration portal to finish prescriber onboarding.
          </p>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mb-12 overflow-hidden rounded-sm border border-primary/10">
          <img src={peoplePhysician} alt="Licensed physician in a modern clinical setting" width={1280} height={896} loading="lazy" className="h-64 w-full object-cover md:h-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-sm border border-primary/10 bg-card p-6">
              <h.icon className="size-6 text-accent" />
              <div className="mt-4 font-display text-lg font-semibold text-primary">{h.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-16 pb-24 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-sm border border-primary/10 bg-primary/5 p-6">
            <div className="text-xs uppercase tracking-widest text-accent">What happens next</div>
            <ol className="mt-3 space-y-2 text-sm text-primary/80">
              <li><span className="font-semibold text-primary">1.</span> Submit this intake form.</li>
              <li><span className="font-semibold text-primary">2.</span> Verified physicians are routed to our partner registration portal.</li>
              <li><span className="font-semibold text-primary">3.</span> Our team verifies your credentials within 1 business day.</li>
              <li><span className="font-semibold text-primary">4.</span> Prescribing access is activated and a rep reaches out.</li>
            </ol>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Prescriber accounts are limited to physicians holding an active medical license and DEA registration. Compounded medications are not FDA-approved for the indications listed.
          </p>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-8 rounded-sm border border-primary/10 bg-card p-8 md:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <Field name="name" label="Full name" error={errs.name} />
            <Field name="email" label="Work email" type="email" error={errs.email} />
            <Field name="phone" label="Phone" type="tel" error={errs.phone} />
            <Field name="clinic" label="Clinic / practice" error={errs.clinic} />
            <Field name="state" label="State of licensure" error={errs.state} />
            <Field name="specialty" label="Specialty" error={errs.specialty} />
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Primary interest</span>
              <select name="interest" defaultValue="" className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent">
                <option value="" disabled>Select category</option>
                <option>GLP-1 & Weight Management</option>
                <option>Performance & Recovery Peptides</option>
                <option>Growth Hormone & GHRH</option>
                <option>Anti-Aging & Longevity</option>
                <option>Hormone & Sexual Health</option>
                <option>Cellular Energy & NAD+</option>
                <option>Full catalog</option>
              </select>
              {errs.interest && <span className="mt-1 block text-xs text-destructive">{errs.interest}</span>}
            </label>
            <fieldset className="md:col-span-2">
              <legend className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Do you have a DEA and/or NPI number?
              </legend>
              <div className="mt-2 flex gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-primary">
                  <input type="radio" name="hasDeaNpi" value="yes" className="accent-accent" />
                  Yes
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-primary">
                  <input type="radio" name="hasDeaNpi" value="no" className="accent-accent" />
                  No
                </label>
              </div>
              {errs.hasDeaNpi && <span className="mt-1 block text-xs text-destructive">{errs.hasDeaNpi}</span>}
            </fieldset>
          </div>
          <div className="mt-5">
            <Field name="notes" label="Notes (optional)" textarea error={errs.notes} />
          </div>
          <div className="mt-5">
            <Field name="referredBy" label="Referred by (optional)" error={errs.referredBy} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft disabled:opacity-70"
          >
            {submitting ? "Redirecting to partner portal…" : <>Submit & continue registration <ArrowUpRight className="size-4" /></>}
          </button>
          {blocked && (
            <div className="mt-4 rounded-sm border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              A current DEA or NPI number is required for prescriber access. If you obtain one in the future, please return and resubmit this form.
            </div>
          )}
          {submitting && (
            <p className="mt-3 text-xs text-muted-foreground">
              If you are not redirected,{" "}
              <a href={PRESCRIBES_URL} className="text-accent underline underline-offset-4">click here to continue to the partner portal</a>.
            </p>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, type = "text", textarea, error }: { name: string; label: string; type?: string; textarea?: boolean; error?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
      {textarea ? (
        <textarea name={name} rows={5} maxLength={1000} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
      ) : (
        <input name={name} type={type} maxLength={255} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}