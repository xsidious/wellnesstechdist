const metrics = [
  { k: "100+", v: "Compounded Rx SKUs" },
  { k: "503A/B", v: "Verified partners" },
  { k: "Rx only", v: "Physician supervised" },
  { k: "B2B", v: "Practice-first platform" },
];

const trustLine = [
  "USP-aligned compounding partners",
  "NPI credentialing",
  "Role-based practice access",
  "Clinician education",
  "Wholesale ordering",
  "Affiliate attribution",
];

export function HomeProofStrip() {
  return (
    <section className="border-y border-primary/10 bg-white/70 backdrop-blur-sm">
      <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-8 md:py-10">
        {metrics.map((m) => (
          <div key={m.v} className="text-center md:text-left">
            <div className="font-display text-2xl font-semibold text-primary md:text-3xl">{m.k}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {m.v}
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden border-t border-primary/10 py-3">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/45">
          {[...trustLine, ...trustLine].map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-10">
              <span>{t}</span>
              <span className="size-1 rounded-full bg-accent/80" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
