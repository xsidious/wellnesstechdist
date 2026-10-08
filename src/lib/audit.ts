import { prisma } from "@/lib/prisma";

export async function audit(entry: {
  actorId?: string;
  action: string;
  object: string;
  before?: string;
  after?: string;
  ip?: string;
}) {
  await prisma.auditEvent.create({
    data: {
      actorId: entry.actorId ?? "",
      action: entry.action,
      object: entry.object,
      before: entry.before ?? "",
      after: entry.after ?? "",
      ip: entry.ip ?? "",
    },
  });
}
