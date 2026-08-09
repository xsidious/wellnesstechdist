"use client";

import { useEffect, useState } from "react";
import { useAdminContent, useSaveAdminContent } from "@/lib/api/admin";

const TABS = [
  { key: "home.hero", label: "Home hero" },
  { key: "home.cta", label: "Home CTA" },
  { key: "faq.items", label: "FAQ" },
  { key: "contact.info", label: "Contact" },
] as const;

function HeroForm({ body, onSave, pending }: {
  body: Record<string, unknown>;
  onSave: (b: Record<string, unknown>) => void;
  pending: boolean;
}) {
  const [headline, setHeadline] = useState(String(body.headline || ""));
  const [subcopy, setSubcopy] = useState(String(body.subcopy || ""));
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState(String(body.primaryCtaLabel || ""));
  const [primaryCtaHref, setPrimaryCtaHref] = useState(String(body.primaryCtaHref || ""));
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(String(body.secondaryCtaLabel || ""));
  const [secondaryCtaHref, setSecondaryCtaHref] = useState(String(body.secondaryCtaHref || ""));

  useEffect(() => {
    setHeadline(String(body.headline || ""));
    setSubcopy(String(body.subcopy || ""));
    setPrimaryCtaLabel(String(body.primaryCtaLabel || ""));
    setPrimaryCtaHref(String(body.primaryCtaHref || ""));
    setSecondaryCtaLabel(String(body.secondaryCtaLabel || ""));
    setSecondaryCtaHref(String(body.secondaryCtaHref || ""));
  }, [body]);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          headline,
          subcopy,
          primaryCtaLabel,
          primaryCtaHref,
          secondaryCtaLabel,
          secondaryCtaHref,
        });
      }}
    >
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Subcopy" value={subcopy} onChange={setSubcopy} textarea />
      <Field label="Primary CTA label" value={primaryCtaLabel} onChange={setPrimaryCtaLabel} />
      <Field label="Primary CTA href" value={primaryCtaHref} onChange={setPrimaryCtaHref} />
      <Field label="Secondary CTA label" value={secondaryCtaLabel} onChange={setSecondaryCtaLabel} />
      <Field label="Secondary CTA href" value={secondaryCtaHref} onChange={setSecondaryCtaHref} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
      >
        Save hero
      </button>
    </form>
  );
}

function CtaForm({ body, onSave, pending }: {
  body: Record<string, unknown>;
  onSave: (b: Record<string, unknown>) => void;
  pending: boolean;
}) {
  const [eyebrow, setEyebrow] = useState(String(body.eyebrow || ""));
  const [headline, setHeadline] = useState(String(body.headline || ""));
  const [ctaBody, setCtaBody] = useState(String(body.body || ""));
  const [ctaLabel, setCtaLabel] = useState(String(body.ctaLabel || ""));
  const [ctaHref, setCtaHref] = useState(String(body.ctaHref || ""));

  useEffect(() => {
    setEyebrow(String(body.eyebrow || ""));
    setHeadline(String(body.headline || ""));
    setCtaBody(String(body.body || ""));
    setCtaLabel(String(body.ctaLabel || ""));
    setCtaHref(String(body.ctaHref || ""));
  }, [body]);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ eyebrow, headline, body: ctaBody, ctaLabel, ctaHref });
      }}
    >
      <Field label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
      <Field label="Headline" value={headline} onChange={setHeadline} />
      <Field label="Body" value={ctaBody} onChange={setCtaBody} textarea />
      <Field label="CTA label" value={ctaLabel} onChange={setCtaLabel} />
      <Field label="CTA href" value={ctaHref} onChange={setCtaHref} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
      >
        Save CTA
      </button>
    </form>
  );
}

function ContactForm({ body, onSave, pending }: {
  body: Record<string, unknown>;
  onSave: (b: Record<string, unknown>) => void;
  pending: boolean;
}) {
  const [email, setEmail] = useState(String(body.email || ""));
  const [phone, setPhone] = useState(String(body.phone || ""));
  const [phoneHref, setPhoneHref] = useState(String(body.phoneHref || ""));
  const [coverage, setCoverage] = useState(String(body.coverage || ""));
  const [blurb, setBlurb] = useState(String(body.blurb || ""));
  const [hours, setHours] = useState(String(body.hours || ""));

  useEffect(() => {
    setEmail(String(body.email || ""));
    setPhone(String(body.phone || ""));
    setPhoneHref(String(body.phoneHref || ""));
    setCoverage(String(body.coverage || ""));
    setBlurb(String(body.blurb || ""));
    setHours(String(body.hours || ""));
  }, [body]);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ email, phone, phoneHref, coverage, blurb, hours });
      }}
    >
      <Field label="Email" value={email} onChange={setEmail} />
      <Field label="Phone display" value={phone} onChange={setPhone} />
      <Field label="Phone href (tel:…)" value={phoneHref} onChange={setPhoneHref} />
      <Field label="Coverage" value={coverage} onChange={setCoverage} />
      <Field label="Blurb" value={blurb} onChange={setBlurb} textarea />
      <Field label="Hours" value={hours} onChange={setHours} textarea />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
      >
        Save contact
      </button>
    </form>
  );
}

function FaqForm({ body, onSave, pending }: {
  body: Record<string, unknown>;
  onSave: (b: Record<string, unknown>) => void;
  pending: boolean;
}) {
  const [json, setJson] = useState(() => JSON.stringify(body.categories || [], null, 2));

  useEffect(() => {
    setJson(JSON.stringify(body.categories || [], null, 2));
  }, [body]);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          const categories = JSON.parse(json) as unknown;
          onSave({ categories });
        } catch {
          alert("Invalid JSON");
        }
      }}
    >
      <p className="text-xs text-muted-foreground">
        JSON array of categories: {"{ id, title, items: [{ q, a }] }"}. Leave empty array to use
        site defaults.
      </p>
      <textarea
        className="min-h-[320px] w-full rounded-sm border border-input px-3 py-2 font-mono text-xs"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
      >
        Save FAQ
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block text-xs">
      <span className="font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          className="mt-1 w-full rounded-sm border border-input px-3 py-2 text-sm"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-sm border border-input px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function AdminContentPanel() {
  const { data: blocks = [], isLoading, error } = useAdminContent();
  const save = useSaveAdminContent();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("home.hero");
  const block = blocks.find((b) => b.key === tab);
  const body = (block?.body || {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "border border-primary/15 text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading content…</p>}
      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <div className="rounded-sm border border-primary/10 bg-card p-5">
        {tab === "home.hero" && (
          <HeroForm
            body={body}
            pending={save.isPending}
            onSave={(b) => save.mutate({ key: tab, title: "Home hero", body: b })}
          />
        )}
        {tab === "home.cta" && (
          <CtaForm
            body={body}
            pending={save.isPending}
            onSave={(b) => save.mutate({ key: tab, title: "Home CTA", body: b })}
          />
        )}
        {tab === "contact.info" && (
          <ContactForm
            body={body}
            pending={save.isPending}
            onSave={(b) => save.mutate({ key: tab, title: "Contact info", body: b })}
          />
        )}
        {tab === "faq.items" && (
          <FaqForm
            body={body}
            pending={save.isPending}
            onSave={(b) => save.mutate({ key: tab, title: "FAQ", body: b })}
          />
        )}
        {save.isSuccess && <p className="mt-3 text-sm text-accent">Saved.</p>}
        {save.isError && <p className="mt-3 text-sm text-destructive">{save.error.message}</p>}
      </div>
    </div>
  );
}
