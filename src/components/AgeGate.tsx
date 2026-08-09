import { useEffect, useState } from "react";

const KEY = "wtbd_age_gate_v1";

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ok = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
      if (!ok) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  function onYes() {
    if (!agree) {
      setError("Please confirm the statement below to continue.");
      return;
    }
    const trimmed = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!emailOk) {
      setError("Please enter a valid email address to continue.");
      return;
    }
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, "1");
    } catch { /* ignore */ }
    // Fire-and-forget notification to admin
    try {
      void fetch("/api/public/age-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* ignore */ }
    setOpen(false);
  }

  function onNo() {
    window.location.href = "https://www.google.com";
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-md border border-primary/10 bg-background p-6 md:p-8 shadow-2xl">
        <h2 className="text-center font-display text-2xl font-semibold text-primary md:text-3xl">
          Are you over 21 years of age?
        </h2>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onNo}
            className="min-w-28 rounded-sm bg-primary px-6 py-3 text-base font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
          >
            No
          </button>
          <button
            onClick={onYes}
            className="min-w-28 rounded-sm bg-accent px-6 py-3 text-base font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-accent/90"
          >
            Yes
          </button>
        </div>

        <label className="mt-6 flex items-start gap-2 text-sm text-primary/80">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => { setAgree(e.target.checked); if (e.target.checked) setError(null); }}
            className="mt-1 accent-accent"
          />
          <span>
            I confirm that I am 21+ years of age, have read and agree to the{" "}
            <a href="/compliance" className="text-accent hover:underline">Terms &amp; Conditions</a>,{" "}
            <a href="/compliance" className="text-accent hover:underline">Chargeback &amp; Dispute Policy</a>, and{" "}
            <a href="/compliance" className="text-accent hover:underline">Research Use Only Policy</a>, acknowledge that products are for research use only, and agree to contact customer support before filing a payment dispute or chargeback.
          </span>
        </label>

        <div className="mt-5">
          <label htmlFor="wtbd-email" className="block text-xs font-semibold uppercase tracking-widest text-primary/70">
            Email address
          </label>
          <input
            id="wtbd-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (e.target.value) setError(null); }}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-primary/80">
          <input
            id="wtbd-remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-accent"
          />
          <label htmlFor="wtbd-remember">Remember me</label>
        </div>
      </div>
    </div>
  );
}