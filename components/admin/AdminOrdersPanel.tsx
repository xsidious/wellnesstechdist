"use client";

import { useState, Fragment } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminOrders,
  useAdminOrderDetail,
  useUpdateAdminOrder,
  type AdminOrderRow,
} from "@/lib/api/admin";

const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLING", "COMPLETED", "CANCELLED", "REFUNDED"];
const SUB_STATUSES = ["PENDING", "PAID", "FULFILLING", "SHIPPED", "COMPLETED", "CANCELLED"];

function OrderDetail({ order }: { order: AdminOrderRow }) {
  const update = useUpdateAdminOrder();
  const detail = useAdminOrderDetail(order.id);
  const ledger = detail.data?.ledgerEntries ?? [];

  return (
    <div className="mt-3 space-y-4 rounded-sm border border-primary/10 bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Order status</span>
        <select
          className="rounded-sm border border-input px-2 py-1.5 text-sm"
          defaultValue={order.status}
          onChange={(e) => update.mutate({ id: order.id, status: e.target.value })}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">ID: {order.id}</span>
        {update.isSuccess && <span className="text-xs text-accent">Saved</span>}
        {update.isError && <span className="text-xs text-destructive">{update.error.message}</span>}
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div>Subtotal {formatCents(order.subtotalCents)}</div>
        <div>Platform fee {formatCents(order.feeCents)}</div>
        <div>Commission {formatCents(order.commissionCents)}</div>
      </div>

      <ul className="space-y-3">
        {order.subOrders.map((s) => (
          <li key={s.id} className="border-t border-primary/10 pt-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{s.providerName}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCents(s.subtotalCents)} · {s.items.length} lines
                </div>
              </div>
              <select
                className="rounded-sm border border-input px-2 py-1.5 text-sm"
                defaultValue={s.status}
                onChange={(e) =>
                  update.mutate({
                    id: order.id,
                    subOrderId: s.id,
                    subOrderStatus: e.target.value,
                  })
                }
              >
                {SUB_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {s.items.map((i) => (
                <li key={i.id}>
                  {i.quantity}× {i.productName} ({i.variantName}) — {formatCents(i.lineTotalCents)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="border-t border-primary/10 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Ledger
        </h4>
        {detail.isLoading && <p className="mt-2 text-xs text-muted-foreground">Loading ledger…</p>}
        {ledger.length === 0 && !detail.isLoading ? (
          <p className="mt-2 text-xs text-muted-foreground">No ledger entries.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs">
            {ledger.map((e) => (
              <li key={e.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  {e.type} · {e.status}
                  {e.description ? ` — ${e.description}` : ""}
                </span>
                <span className="font-medium">{formatCents(e.amountCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function AdminOrdersPanel() {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading, error } = useAdminOrders({
    status: status || undefined,
    q: search || undefined,
  });
  const orders = data?.orders ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded-sm border border-input px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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
            placeholder="Search email, order id, ambassador…"
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

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders…</p>}
      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-primary/15 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Customer</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Total</th>
              <th className="py-2 pr-3">Items</th>
              <th className="py-2 pr-3">Ambassador</th>
              <th className="py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <Fragment key={o.id}>
                <tr className="border-b border-primary/10">
                  <td className="py-3 pr-3 text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-3">
                    <div>{o.customerName || "—"}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="py-3 pr-3 font-medium">{o.status}</td>
                  <td className="py-3 pr-3">{formatCents(o.totalCents)}</td>
                  <td className="py-3 pr-3">{o.itemCount}</td>
                  <td className="py-3 pr-3">{o.ambassadorCode || "—"}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-wider text-accent"
                      onClick={() => setOpenId(openId === o.id ? null : o.id)}
                    >
                      {openId === o.id ? "Hide" : "Manage"}
                    </button>
                  </td>
                </tr>
                {openId === o.id && (
                  <tr>
                    <td colSpan={7} className="pb-4">
                      <OrderDetail order={o} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminRecentOrders() {
  const { data, isLoading } = useAdminOrders();
  const recent = (data?.orders ?? []).slice(0, 8);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-primary">Recent orders</h2>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <ul className="divide-y divide-primary/10 border-t border-primary/10">
        {recent.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
            <div>
              <div className="font-medium">{o.email}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.createdAt).toLocaleString()} · {o.status}
              </div>
            </div>
            <div className="font-medium">{formatCents(o.totalCents)}</div>
          </li>
        ))}
        {!isLoading && recent.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">No orders yet.</li>
        )}
      </ul>
    </section>
  );
}
