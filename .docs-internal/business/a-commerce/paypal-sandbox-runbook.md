# PayPal Sandbox Commerce Runbook

## Scope

This runbook enables the `pay-paypal` Commerce path only for Sandbox verification. It does not authorize a live PayPal rollout or removal of legacy `a-paypal`.

## Required non-committed configuration

Provide these values through the deployed environment secret source, never through frontend environment files:

- `PAYPAL_SANDBOX_ENABLED=true`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_MERCHANT_REFERENCE` — the expected Sandbox merchant/payee ID
- `SERVER_SERVE_PROTOCOL=https`
- `SERVER_SERVE_HOST=<public HTTPS host>`

The server must be publicly reachable at the configured origin. Callback URLs are generated from this trusted origin; a browser `Host`, `Origin`, or arbitrary return URL cannot alter them.

## PayPal application setup

1. Create isolated Sandbox merchant and buyer accounts.
2. Register the backend webhook endpoint:
   `POST https://<public-host>/api/pay/webhook/pay-paypal:paypal/default`.
3. Subscribe only to the capture and refund event types supported by the adapter. Do not subscribe to broad unrelated event families because unsupported events intentionally receive a non-success response.
4. Set `PAYPAL_WEBHOOK_ID` to the registered webhook ID and `PAYPAL_MERCHANT_REFERENCE` to the merchant payee ID.
5. Keep `PAYPAL_SANDBOX_ENABLED=false` until all values and endpoint reachability are verified.

## Verification flow

1. Fetch Checkout payment methods while authenticated. PayPal appears only when the complete Sandbox configuration is valid.
2. Create an order selecting the `paypal` candidate key.
3. Start payment and verify the approval redirect comes from PayPal.
4. Approve with the Sandbox buyer. The browser returns through `/api/pay/payment-callback/return`; it cannot settle the order directly.
5. Confirm that the server creates/reuses the durable confirm operation, captures the persisted PayPal order, and reaches the provider-neutral PaymentSession terminal state.
6. Confirm a verified webhook is stored, a single payment outbox event is dispatched, and Commerce receives exactly one payment outcome.
7. Submit both full and partial refunds; confirm provider refund IDs persist and webhook/query races converge to one outcome.
8. Repeat a callback and webhook delivery to verify idempotency.

## Operational checks

Monitor and investigate:

- `payProviderOperation` rows in `reconciliation_required` or `failed`;
- callback 401/404 errors (expired or mismatched signed state);
- webhook verification errors, merchant mismatches, amount/currency mismatches, and replay conflicts;
- pending `payOutboxEvent` rows;
- expired Commerce orders with a late payment audit and an automatic `late-capture:` refund operation.

For a late verified capture after an order expired, retain the expired order. The system records the capture and creates a full compensation refund. Do not manually mark the order paid or recreate stock/coupon effects.

## Cutover constraints

- Keep Mock as the default in normal development and deterministic CI.
- Enable Sandbox PayPal only for internal validation cohorts.
- Do not configure a live client or enable live selection in this change.
- Do not remove legacy `a-paypal` until Sandbox cutover has passed and the active legacy-record archive/migration/disposal decision is recorded.
