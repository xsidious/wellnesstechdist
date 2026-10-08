import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encryptField, decryptField, readSession, rejectCardNumber, signSession, signWebhook, tokenizeLast4, verifyWebhook } from "./crypto";

process.env.SESSION_SECRET ||= "test-session-secret-value";
process.env.FIELD_KEY ||= "test-field-key-value";
process.env.RXCORE_WEBHOOK_SECRET ||= "test-webhook-secret";

describe("tokens and secrets", () => {
  it("refuses a full card number and accepts last four only", () => {
    assert.equal(rejectCardNumber("4242424242424242"), true);
    assert.throws(() => tokenizeLast4("4242424242424242"));
    const token = tokenizeLast4("4242");
    assert.equal(token.last4, "4242");
    assert.match(token.token, /^tok_sandbox_/);
  });

  it("round-trips a license and a session cookie", () => {
    const packed = encryptField("VA-12345");
    assert.notEqual(packed, "VA-12345");
    assert.equal(decryptField(packed), "VA-12345");
    const token = signSession("user|9999999999999");
    assert.equal(readSession(token), "user|9999999999999");
    assert.equal(readSession(`${token}x`), null);
  });

  it("rejects a webhook whose body changed", () => {
    const body = JSON.stringify({ id: "evt_1", type: "order.shipped" });
    const signature = signWebhook(body);
    assert.equal(verifyWebhook(body, signature), true);
    assert.equal(verifyWebhook(body.replace("shipped", "delivered"), signature), false);
  });
});
