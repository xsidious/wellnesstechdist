"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import { QueryProvider } from "@/components/QueryProvider";
import {
  useAmbassadorLedger,
  useAmbassadorLinks,
  useAmbassadorMe,
  useAmbassadorOrders,
  useCreateAmbassadorLink,
} from "@/lib/api/ambassador";

function Metrics() {
  const { data, isLoading, error } = useAmbassadorMe();
  const [copied, setCopied] = useState(false);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;
  if (!data) return null;

  const absoluteShare =
    typeof window !== "undefined"
      ? `${window.location.origin}${data.shareUrl}`
      : data.shareUrl;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Code", value: data.profile.code },
          { label: "Wallet", value: formatCents(data.profile.walletBalanceCents) },
          { label: "Attributed GMV", value: formatCents(data.attributedGmvCents) },
          {
            label: "Rank",
            value: data.rank ? `#${data.rank} / ${data.ambassadorCount}` : "—",
          },
        ].map((c) => (
          <div key={c.label} className="border-t border-primary/15 pt-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-primary/10 bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-primary">Your referral link</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Commission tier:{" "}
          {data.tier
            ? `${data.tier.name} (${(data.tier.percentBps / 100).toFixed(2)}%)`
            : "Default / none configured"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <code className="flex-1 rounded-sm bg-muted px-3 py-2 text-xs break-all">
            {absoluteShare}
          </code>
          <button
            type="button"
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
            onClick={async () => {
              await navigator.clipboard.writeText(absoluteShare);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Earned commissions: {formatCents(data.commissionEarnedCents)} · {data.orderCount} orders
        </p>
      </div>
    </div>
  );
}

function LinksPanel() {
  const { data, isLoading } = useAmbassadorLinks();
  const create = useCreateAmbassadorLink();
  const [slug, setSlug] = useState("");
  const [destination, setDestination] = useState("/shop");

  return (
    <section id="links" className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-primary">Tracked links</h2>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            { slug: slug || undefined, destination },
            {
              onSuccess: () => {
                setSlug("");
              },
            },
          );
        }}
      >
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="custom-slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          className="min-w-[180px] flex-1 rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="/shop or /products"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
        >
          Create link
        </button>
      </form>
      {create.isError && <p className="text-sm text-destructive">{create.error.message}</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading links…</p>
      ) : (
        <ul className="divide-y divide-primary/10 border-t border-primary/10">
          {(data ?? []).map((l) => (
            <li key={l.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <div>
                <a className="font-medium text-accent hover:underline" href={`/go/${l.slug}`}>
                  /go/{l.slug}
                </a>
                <div className="text-xs text-muted-foreground">→ {l.destination}</div>
              </div>
              <span className="text-muted-foreground">{l.clicks} clicks</span>
            </li>
          ))}
          {(data ?? []).length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No tracked links yet.</li>
          )}
        </ul>
      )}
    </section>
  );
}

function OrdersAndLedger() {
  const orders = useAmbassadorOrders();
  const ledger = useAmbassadorLedger();

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section id="orders">
        <h2 className="font-display text-xl font-semibold text-primary">Attributed orders</h2>
        <ul className="mt-4 divide-y divide-primary/10 border-t border-primary/10">
          {(orders.data ?? []).map((o) => (
            <li key={o.id} className="flex justify-between gap-3 py-3 text-sm">
              <div>
                <div className="font-medium">{o.email}</div>
                <div className="text-xs text-muted-foreground">
                  {o.status} · {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div>{formatCents(o.totalCents)}</div>
                <div className="text-xs text-accent">
                  +{formatCents(o.commissionCents)} commission
                </div>
              </div>
            </li>
          ))}
          {(orders.data ?? []).length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No attributed orders yet.</li>
          )}
        </ul>
      </section>

      <section id="ledger">
        <h2 className="font-display text-xl font-semibold text-primary">Ledger</h2>
        <ul className="mt-4 divide-y divide-primary/10 border-t border-primary/10">
          {(ledger.data ?? []).map((e) => (
            <li key={e.id} className="flex justify-between gap-3 py-3 text-sm">
              <div>
                <div className="font-medium">{e.type.replace(/_/g, " ")}</div>
                <div className="text-xs text-muted-foreground">
                  {e.status} · {new Date(e.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="font-medium">{formatCents(e.amountCents)}</div>
            </li>
          ))}
          {(ledger.data ?? []).length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No ledger entries yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-12">
      <Metrics />
      <LinksPanel />
      <OrdersAndLedger />
    </div>
  );
}

export function AmbassadorDashboard() {
  return (
    <QueryProvider>
      <Body />
    </QueryProvider>
  );
}
