# Security gate

Automated checks live in `src/lib/security.test.ts` and `src/lib/rules.test.ts`. Run them with `npm test`.

Covered in this copy:

- Product-class gates, including the Tier 1 block on 503B office-use stock.
- Commission math refuses prescription classes.
- Webhook signatures use HMAC-SHA256 and reject a tampered body.
- Duplicate webhook event IDs are ignored by the ingest function.
- Checkout tokenization accepts only four digits and never a full card number.
- License and DEA values are encrypted before they are stored.
- Session cookies are HMAC signed.
- Billing users are blocked from the patient list in the portal layout.
- Patient pages store initials and an RxCore reference only.

Not done, and required before a real launch:

- An independent penetration test. Do not treat `npm test` as that test.
- A signed BAA, HIPAA hosting, MFA via a hardware key, and the license, DEA, and OIG vendors.
- Compliance sign-off on exosomes, distributor licensing, prescription commissions, and the merchant account.
- RxHere Partner API tokens and webhook secrets stay in environment variables. Never commit them. Configure the portal webhook URL to `/api/webhooks/rxhere`.

Those items stay off until Sarah and counsel close section 17 of the RxCore blueprint.
