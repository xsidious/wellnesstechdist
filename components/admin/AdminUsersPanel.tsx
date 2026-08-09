"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  type AdminUser,
} from "@/lib/api/admin";

const ROLES = ["CUSTOMER", "PROVIDER", "AMBASSADOR", "ADMIN"] as const;

function CreateUserForm() {
  const create = useCreateAdminUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("CUSTOMER");
  const [businessName, setBusinessName] = useState("");
  const [ambassadorCode, setAmbassadorCode] = useState("");

  return (
    <section className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-lg font-semibold text-primary">Create user</h2>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            {
              email,
              password,
              name: name || undefined,
              role,
              businessName: role === "PROVIDER" ? businessName : undefined,
              approved: role === "PROVIDER" ? true : undefined,
              ambassadorCode: role === "AMBASSADOR" ? ambassadorCode || undefined : undefined,
            },
            {
              onSuccess: () => {
                setEmail("");
                setPassword("");
                setName("");
                setBusinessName("");
                setAmbassadorCode("");
              },
            },
          );
        }}
      >
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          type="password"
          minLength={6}
          placeholder="Temp password"
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
        <select
          className="rounded-sm border border-input px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {role === "PROVIDER" && (
          <input
            className="rounded-sm border border-input px-3 py-2 text-sm md:col-span-2"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        )}
        {role === "AMBASSADOR" && (
          <input
            className="rounded-sm border border-input px-3 py-2 text-sm md:col-span-2"
            placeholder="Ambassador code (optional)"
            value={ambassadorCode}
            onChange={(e) => setAmbassadorCode(e.target.value)}
          />
        )}
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"
        >
          Create user
        </button>
        {create.isSuccess && <p className="text-sm text-accent md:col-span-2">User created.</p>}
        {create.isError && (
          <p className="text-sm text-destructive md:col-span-2">{create.error.message}</p>
        )}
      </form>
    </section>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const update = useUpdateAdminUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");

  return (
    <li className="border-b border-primary/10 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
        <div>
          <div className="font-medium text-primary">{user.email}</div>
          <div className="text-xs text-muted-foreground">
            {user.name || "—"} · {user.role} · {user.orderCount} orders · joined{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          {user.providerProfile && (
            <div className="mt-1 text-xs text-muted-foreground">
              Provider: {user.providerProfile.businessName} (
              {user.providerProfile.approved ? "approved" : "pending"})
            </div>
          )}
          {user.ambassadorProfile && (
            <div className="mt-1 text-xs text-muted-foreground">
              Ambassador: {user.ambassadorProfile.code} · wallet{" "}
              {formatCents(user.ambassadorProfile.walletBalance)}
            </div>
          )}
        </div>
        <button
          type="button"
          className="text-xs font-semibold uppercase tracking-wider text-accent"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Manage"}
        </button>
      </div>
      {open && (
        <form
          className="mt-3 grid gap-2 rounded-sm border border-primary/10 bg-card p-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate({
              userId: user.id,
              name: name || null,
              role: role as "CUSTOMER" | "PROVIDER" | "AMBASSADOR" | "ADMIN",
              password: password || undefined,
            });
            setPassword("");
          }}
        >
          <input
            className="rounded-sm border border-input px-2 py-1.5 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <select
            className="rounded-sm border border-input px-2 py-1.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            className="rounded-sm border border-input px-2 py-1.5 text-sm"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (optional)"
          />
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded-sm bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Save
          </button>
          {update.isSuccess && <p className="text-xs text-accent md:col-span-4">Saved.</p>}
          {update.isError && (
            <p className="text-xs text-destructive md:col-span-4">{update.error.message}</p>
          )}
        </form>
      )}
    </li>
  );
}

export function AdminUsersPanel() {
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading, error } = useAdminUsers({
    role: role || undefined,
    q: search || undefined,
  });

  return (
    <div className="space-y-8">
      <CreateUserForm />
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary">All users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter by role, reset passwords, and change roles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-sm border border-input px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <form
            className="flex flex-1 flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(q.trim());
            }}
          >
            <input
              className="min-w-[200px] flex-1 rounded-sm border border-input px-3 py-2 text-sm"
              placeholder="Search name or email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-sm border border-primary/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Search
            </button>
          </form>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Loading users…</p>}
        {error && <p className="text-sm text-destructive">{error.message}</p>}
        <ul>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
          {!isLoading && users.length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">No users found.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
