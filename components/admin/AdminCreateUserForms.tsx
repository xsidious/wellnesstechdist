"use client";

import { useState } from "react";
import { useCreateAdminUser } from "@/lib/api/admin";

export function AdminCreateProviderForm() {
  const create = useCreateAdminUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [approved, setApproved] = useState(true);

  return (
    <section className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-lg font-semibold text-primary">Create provider</h2>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            {
              email,
              password,
              name: name || undefined,
              role: "PROVIDER",
              businessName,
              approved,
            },
            {
              onSuccess: () => {
                setEmail("");
                setPassword("");
                setName("");
                setBusinessName("");
              },
            },
          );
        }}
      >
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Temp password"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} />
          Approved immediately
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"
        >
          Create provider
        </button>
        {create.isSuccess && (
          <p className="text-sm text-accent md:col-span-2">Provider created.</p>
        )}
        {create.isError && (
          <p className="text-sm text-destructive md:col-span-2">{create.error.message}</p>
        )}
      </form>
    </section>
  );
}

export function AdminCreateAmbassadorForm() {
  const create = useCreateAdminUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <section className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-lg font-semibold text-primary">Create ambassador</h2>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            {
              email,
              password,
              name: name || undefined,
              role: "AMBASSADOR",
              ambassadorCode: code || undefined,
            },
            {
              onSuccess: () => {
                setEmail("");
                setPassword("");
                setName("");
                setCode("");
              },
            },
          );
        }}
      >
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Temp password"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Referral code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"
        >
          Create ambassador
        </button>
        {create.isSuccess && (
          <p className="text-sm text-accent md:col-span-2">Ambassador created.</p>
        )}
        {create.isError && (
          <p className="text-sm text-destructive md:col-span-2">{create.error.message}</p>
        )}
      </form>
    </section>
  );
}
