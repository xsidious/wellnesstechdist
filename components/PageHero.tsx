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

function PageHeroCopy({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  tone = "primary",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "primary" | "soft";
}) {
  return (
    <>
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
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  media,
  align = "left",
  size = "md",
  tone = "primary",
  visual = "default",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  media?: ReactNode;
  align?: "left" | "center";
  size?: keyof typeof sizePad;
  tone?: "primary" | "soft";
  visual?: "default" | "ambient";
}) {
  return (
    <PageHeroShell tone={tone}>
      <div className="relative">
        {visual === "ambient" && tone === "primary" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.jpg"
              alt=""
              width={1600}
              height={1200}
              className="absolute inset-0 size-full object-cover opacity-[0.14]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/75" />
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 size-56 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,oklch(0.78_0.14_85/0.16),transparent_42%)]" />
          </div>
        )}

        <div
          className={`container-x relative ${sizePad[size]} ${
            align === "center" && !media ? "text-center" : ""
          }`}
        >
          {media ? (
            <div className="grid items-center gap-10 md:grid-cols-12">
              <div className={align === "center" ? "text-center md:col-span-7" : "md:col-span-7"}>
                <PageHeroCopy
                  eyebrow={eyebrow}
                  title={title}
                  description={description}
                  align={align}
                  tone={tone}
                >
                  {children}
                </PageHeroCopy>
              </div>
              <div className="md:col-span-5">{media}</div>
            </div>
          ) : (
            <PageHeroCopy
              eyebrow={eyebrow}
              title={title}
              description={description}
              align={align}
              tone={tone}
            >
              {children}
            </PageHeroCopy>
          )}
        </div>
      </div>
    </PageHeroShell>
  );
}
