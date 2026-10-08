import { sendRepMessage } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const user = await requireUser();
  const messages = await prisma.message.findMany({ where: { orgId: user.orgId }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <h1>Messages</h1>
      <p>Your rep is {user.org.assignedRep}.</p>
      <form className="form" action={sendRepMessage}>
        <label>Message<textarea name="body" required /></label>
        <button className="btn btn-accent">Send</button>
      </form>
      <ul>{messages.map((message) => <li key={message.id}><strong>{message.authorName}</strong> — {message.body}</li>)}</ul>
    </>
  );
}
