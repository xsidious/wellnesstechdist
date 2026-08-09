import type { ReactNode } from "react";

const sizePad = {
  sm: "py-10 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-14 md:py-20",
} as const;

/** Rounded, inset page header — matches site header/footer width. */
export function PageHeroShell({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "soft";
}) {
  return (
    <section className="px-3 pb-2 pt-1">
      <div
        className={
          tone === "primary"
            ? "overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-[0_18px_50px_rgba(15,40,60,0.12)]"
            : "overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.04] text-foreground shadow-[0_12px_36px_rgba(15,40,60,0.05)]"
        }
      >
        {children}
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  size = "md",
  tone = "primary",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  size?: keyof typeof sizePad;
  tone?: "primary" | "soft";
}) {
  return (
    <PageHeroShell tone={tone}>
      <div
        className={`container-x ${sizePad[size]} ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {eyebrow && (
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              tone === "primary" ? "text-accent" : "text-accent"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className={`mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl ${
            align === "center" ? "mx-auto" : ""
          } ${tone === "primary" ? "text-primary-foreground" : "text-primary"}`}
        >
          {title}
        </h1>
        {description && (
          <div
            className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-base ${
              align === "center" ? "mx-auto" : ""
            } ${tone === "primary" ? "text-primary-foreground/90" : "text-muted-foreground"}`}
          >
            {description}
          </div>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </PageHeroShell>
  );
}
