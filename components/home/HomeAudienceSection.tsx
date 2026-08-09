import { Stethoscope } from "lucide-react";

const audiences = [
  "Medical practices & weight loss clinics",
  "Anti-aging & longevity specialists",
  "Sports medicine & performance physicians",
  "Hormone & functional medicine providers",
  "Aesthetic & regenerative practices",
  "Sales affiliates & territory reps",
  "Independent prescribers & telehealth physicians",
];

export function HomeAudienceSection() {
  return (
    <section className="container-x py-20 md:py-28">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent">Who we serve</span>
      <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-primary md:text-4xl">
        Built for the practices defining modern medicine.
      </h2>

      <div className="mt-10 overflow-hidden rounded-3xl border border-primary/10 shadow-[0_18px_50px_rgba(15,40,60,0.06)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/people-team.jpg"
          alt="Diverse team of medical aesthetic practitioners in a modern clinic"
          width={1280}
          height={896}
          loading="lazy"
          className="h-64 w-full object-cover md:h-96"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map((w) => (
          <div
            key={w}
            className="rounded-2xl border border-primary/10 bg-white/90 p-6 shadow-[0_12px_32px_rgba(15,40,60,0.04)]"
          >
            <Stethoscope className="size-5 text-accent" />
            <div className="mt-3 font-display text-lg font-medium text-primary">{w}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
