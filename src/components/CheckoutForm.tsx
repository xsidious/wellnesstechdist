"use client";

import { useState } from "react";
import { placeOrder } from "@/lib/actions";

export function CheckoutForm() {
  const [last4, setLast4] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="form"
      action={async (formData) => {
        const result = await placeOrder(formData);
        if (result?.error) setError(result.error);
      }}
    >
      <label>
        Card number
        <input
          inputMode="numeric"
          autoComplete="off"
          placeholder="Stays in the browser"
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            setLast4(digits.slice(-4));
          }}
        />
      </label>
      <input type="hidden" name="last4" value={last4} />
      <p className="muted">Only the last four digits leave this page. The server stores a token.</p>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn btn-accent" type="submit">Sign and submit</button>
    </form>
  );
}
