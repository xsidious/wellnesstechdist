import Link from "next/link";
import { ShieldCheck, FileCheck2, Stethoscope, ClipboardList } from "lucide-react";
import { SignupForm } from "@/components/register/SignupForm";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        eyebrow="For licensed physicians"
        title={
          <>
            Become a <span className="italic text-accent">prescriber</span>.
          </>
        }
        description="Create your Wellness Tech Distribution account below. Use NPI Registry search to autofill credentials — our team reviews and approves verified practices before ordering access is enabled."
      />

      <section className="container-x py-12 md:py-16">
        <div className="mb-10 overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.04]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/people-physician.jpg"
            alt="Licensed physician in a modern clinical setting"
            width={1280}
            height={896}
            loading="lazy"
            className="h-80 w-full object-cover object-[50%_12%] md:h-[28rem]"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-primary/10 bg-white p-5 shadow-[0_12px_32px_rgba(15,40,60,0.04)]"
            >
              <h.icon className="size-5 text-accent" />
              <div className="mt-3 font-display text-lg font-semibold text-primary">{h.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="register" className="container-x grid gap-8 pb-16 md:grid-cols-12 md:gap-10">
        <div className="space-y-4 md:col-span-4">
          <div className="rounded-3xl border border-primary/10 bg-primary/[0.03] p-5">
            <div className="text-xs uppercase tracking-widest text-accent">What happens next</div>
            <ol className="mt-3 space-y-2 text-sm text-primary/80">
              <li>
                <span className="font-semibold text-primary">1.</span> Complete the multi-step signup
                and look up your NPI.
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
          <SignupForm role="PROVIDER" error={sp.error} embedded />
        </div>
      </section>
    </>
  );
}
