import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  let orders: {
    id: string;
    status: string;
    totalCents: number;
    createdAt: Date;
    items: { productName: string; quantity: number }[];
  }[] = [];

  try {
    orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: session!.user.id }, { email: session!.user.email }],
      },
      include: {
        items: { select: { productName: true, quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    /* empty */
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Your orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{session?.user?.email}</p>
      </div>
      <ul className="divide-y divide-primary/10 border-t border-primary/10">
        {orders.map((o) => (
          <li key={o.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium text-primary">{o.id}</div>
              <div className="text-sm">
                {o.status} · {formatCents(o.totalCents)}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {o.createdAt.toISOString().slice(0, 10)} ·{" "}
              {o.items.map((i) => `${i.productName}×${i.quantity}`).join(", ")}
            </p>
          </li>
        ))}
        {orders.length === 0 && (
          <li className="py-4 text-sm text-muted-foreground">No orders yet.</li>
        )}
      </ul>
    </div>
  );
}
