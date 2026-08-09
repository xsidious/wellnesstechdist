import Link from "next/link";
import { ShieldCheck, FileCheck2, Stethoscope, ClipboardList } from "lucide-react";
import { SignupForm } from "@/components/register/SignupForm";

const highlights = [
  {
    icon: ShieldCheck,
    title: "503A & 503B verified",
    desc: "Order from a vetted network of state- and FDA-registered compounding partners.",
  },
  {
    icon: FileCheck2,
    title: "Credentialing handled",
    desc: "We verify NPI (and DEA when provided), then activate prescribing access.",
  },
  {
    icon: Stethoscope,
    title: "Clinical protocols",
    desc: "Dosing guides, contraindications and patient education for every category.",
  },
  {
    icon: ClipboardList,
    title: "Direct-to-patient fulfillment",
    desc: "Patient-specific Rx shipped from the partner pharmacy — no inventory.",
  },
];

type SearchParams = Promise<{ error?: string }>;

export default async function PrescribersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x py-24 md:py-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            For licensed physicians
          </span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">
            Become a <span className="italic text-accent">prescriber</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/90">
            Create your Wellness Tech Distribution account below. Use NPI Registry search to autofill
            credentials — our team reviews and approves verified practices before ordering access is
            enabled.
          </p>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mb-12 overflow-hidden rounded-sm border border-primary/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/people-physician.jpg"
            alt="Licensed physician in a modern clinical setting"
            width={1280}
            height={896}
            loading="lazy"
            className="h-64 w-full object-cover md:h-96"
          />
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

      <section id="register" className="container-x grid gap-16 pb-24 md:grid-cols-12">
        <div className="space-y-6 md:col-span-4">
          <div className="rounded-sm border border-primary/10 bg-primary/5 p-6">
            <div className="text-xs uppercase tracking-widest text-accent">What happens next</div>
            <ol className="mt-3 space-y-2 text-sm text-primary/80">
              <li>
                <span className="font-semibold text-primary">1.</span> Complete the signup form and
                look up your NPI.
              </li>
              <li>
                <span className="font-semibold text-primary">2.</span> Your account is created as
                pending approval.
              </li>
              <li>
                <span className="font-semibold text-primary">3.</span> Our team verifies NPI and
                practice details (typically within 1 business day).
              </li>
              <li>
                <span className="font-semibold text-primary">4.</span> Once approved, you can sign in
                and order from the marketplace.
              </li>
            </ol>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Prescriber accounts are limited to licensed medical professionals. Compounded medications
            are not FDA-approved for the indications listed. Already registered?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
            .
          </p>
        </div>

        <div className="md:col-span-8">
          <SignupForm role="PROVIDER" error={sp.error} />
        </div>
      </section>
    </>
  );
}
