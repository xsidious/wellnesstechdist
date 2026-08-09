"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { US_STATES } from "@/lib/register-options";

export type NpiResult = {
  npi: string;
  enumerationType: string;
  displayName: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  credential: string;
  status: string;
  taxonomy: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
};

export function NpiLookup({
  title = "Search NPI Registry",
  onSelect,
}: {
  title?: string;
  onSelect: (result: NpiResult) => void;
}) {
  const [mode, setMode] = useState<"number" | "individual" | "organization">("number");
  const [number, setNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [taxonomy, setTaxonomy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<NpiResult[]>([]);

  async function search() {
    setError(null);
    setLoading(true);
    setResults([]);

    const params = new URLSearchParams();
    if (mode === "number") {
      const n = number.replace(/\D/g, "");
      if (n.length !== 10) {
        setError("Enter a valid 10-digit NPI.");
        setLoading(false);
        return;
      }
      params.set("number", n);
    } else if (mode === "individual") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("First and last name are required.");
        setLoading(false);
        return;
      }
      params.set("first_name", firstName);
      params.set("last_name", lastName);
      params.set("enumeration_type", "NPI-1");
    } else {
      if (!organizationName.trim()) {
        setError("Organization name is required.");
        setLoading(false);
        return;
      }
      params.set("organization_name", organizationName);
      params.set("enumeration_type", "NPI-2");
    }
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (postalCode) params.set("postal_code", postalCode);
    if (taxonomy) params.set("taxonomy_description", taxonomy);
    params.set("limit", "10");

    try {
      const res = await fetch(`/api/public/npi-lookup?${params.toString()}`);
      const data = (await res.json()) as { results?: NpiResult[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Search failed");
        return;
      }
      setResults(data.results || []);
      if (!(data.results || []).length) {
        setError("No matching NPI records found. Refine your search.");
      }
    } catch {
      setError("Could not reach NPI lookup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md:col-span-2 space-y-4 rounded-sm border border-primary/15 bg-primary/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-primary">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Live lookup against the CMS NPPES NPI Registry. Select a result to autofill verification
            fields.
          </p>
        </div>
        <a
          href="https://npiregistry.cms.hhs.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
        >
          NPI Registry <ExternalLink className="size-3" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["number", "By NPI #"],
            ["individual", "Individual"],
            ["organization", "Organization"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
              mode === id
                ? "bg-primary text-primary-foreground"
                : "border border-primary/20 text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {mode === "number" && (
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              NPI Number
            </span>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit NPI"
              inputMode="numeric"
              className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
            />
          </label>
        )}
        {mode === "individual" && (
          <>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                First name
              </span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Last name
              </span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
              />
            </label>
          </>
        )}
        {mode === "organization" && (
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              Organization name
            </span>
            <input
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
            />
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">State</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
          >
            <option value="">Any</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Postal code
          </span>
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Taxonomy / specialty
          </span>
          <input
            value={taxonomy}
            onChange={(e) => setTaxonomy(e.target.value)}
            placeholder="e.g. Family Medicine"
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void search()}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2 disabled:opacity-60"
        >
          <Search className="size-3.5" />
          {loading ? "Searching…" : "Search NPI Registry"}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results.length > 0 && (
        <ul className="divide-y divide-primary/10 border-t border-primary/10">
          {results.map((r) => (
            <li key={r.npi} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
              <div>
                <div className="font-medium text-primary">{r.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  NPI {r.npi}
                  {r.taxonomy ? ` · ${r.taxonomy}` : ""}
                  {r.city || r.state ? ` · ${[r.city, r.state].filter(Boolean).join(", ")}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className="rounded-sm border border-accent/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent hover:bg-accent/10"
              >
                Use this NPI
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
