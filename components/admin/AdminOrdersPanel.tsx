"use client";

import { useState, Fragment } from "react";
import { formatCents } from "@/lib/utils";
import { useAdminOrders, useUpdateAdminOrder, type AdminOrderRow } from "@/lib/api/admin";

const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLING", "COMPLETED", "CANCELLED", "REFUNDED"];
const SUB_STATUSES = ["PENDING", "PAID", "FULFILLING", "SHIPPED", "COMPLETED", "CANCELLED"];

function OrderDetail({ order }: { order: AdminOrderRow }) {
  const update = useUpdateAdminOrder();

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
        {update.isSuccess && <span className="text-xs text-accent">Saved</span>}
        {update.isError && <span className="text-xs text-destructive">{update.error.message}</span>}
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
    </div>
  );
}

export function AdminOrdersPanel() {
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: orders = [], isLoading, error } = useAdminOrders(status || undefined);

  return (
    <div className="space-y-4">
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
  const { data: orders = [], isLoading } = useAdminOrders();
  const recent = orders.slice(0, 8);

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
