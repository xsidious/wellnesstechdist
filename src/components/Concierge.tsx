"use client";

import { useState } from "react";

export function Concierge() {
  const [reply, setReply] = useState("");
  return (
    <form
      className="form"
      onSubmit={async (event) => {
        event.preventDefault();
        const message = new FormData(event.currentTarget).get("message");
        const response = await fetch("/api/concierge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = (await response.json()) as { reply: string };
        setReply(data.reply);
      }}
    >
      <label>Ask the concierge<input name="message" placeholder="Where is my order?" /></label>
      <button className="btn btn-dark">Send</button>
      {reply ? <p className="note">{reply}</p> : null}
    </form>
  );
}
