# PayPal Commerce Runbook

## Scope

This runbook operates the `pay-paypal` Commerce path in either PayPal Sandbox or Live. It does not authorize removal of the legacy `a-paypal` module.

## Environment selection

`PAYPAL_ENVIRONMENT` is the PayPal cutover selector. It accepts exactly one of:

- `sandbox` for PayPal Sandbox;
- `live` for PayPal Live.

The base [vona/env/.env](../../../vona/env/.env) selects `sandbox`; [vona/env/.env.prod](../../../vona/env/.env.prod) selects `live`. Vona resolves the matching environment cascade into generated runtime metadata during the build. Changing an env file or deployment secret therefore requires a coordinated rebuild and deployment of all workers; it is not an in-place runtime switch.

For the selected environment, provide matching values through the deployment secret source, never through frontend env files or committed files:

- `PAYPAL_CLIENT_ID`;
- `PAYPAL_CLIENT_SECRET`;
- `PAYPAL_WEBHOOK_ID`;
- `PAYPAL_MERCHANT_REFERENCE` — the expected merchant/payee ID;
- `SERVER_SERVE_PROTOCOL=https`;
- `SERVER_SERVE_HOST=<public HTTPS host>`.

The server must be publicly reachable at the configured origin. Callback URLs are generated from that trusted origin; browser `Host`, `Origin`, and arbitrary return URLs cannot alter them.

## PayPal application setup

1. Create the application, merchant account, buyer account, credentials, and webhook in the selected PayPal environment.
2. Register the backend webhook endpoint:
   `POST https://<public-host>/api/pay/webhook/pay-paypal:paypal/default`.
3. Subscribe only to the capture and refund event types supported by the adapter. Unsupported event families intentionally receive a non-success response.
4. Set `PAYPAL_WEBHOOK_ID` and `PAYPAL_MERCHANT_REFERENCE` from the same selected PayPal environment as the credentials.
5. Verify endpoint reachability and configuration before allowing eligible Checkout users to select PayPal.

## Verification flow

1. Fetch Checkout payment methods while authenticated. PayPal appears only when the complete selected-environment configuration is valid.
2. Create an order selecting the `paypal` candidate key.
3. Start payment and verify the approval redirect comes from the selected PayPal environment.
4. Approve with the corresponding buyer account. The browser returns through `/api/pay/payment-callback/return`; it cannot settle the order directly.
5. Confirm the server creates or reuses the durable confirm operation, captures the persisted PayPal order, and reaches a provider-neutral PaymentSession terminal state.
6. Confirm a verified webhook is stored, one payment outbox event is dispatched, and Commerce receives exactly one payment outcome.
7. Submit full and partial refunds; confirm provider refund IDs persist and webhook/query races converge to one outcome.
8. Repeat a callback and webhook delivery to verify idempotency.

## Environment cutover

`PaymentSession.environment`, provider operations, callback state, webhook receipts, and webhook deduplication are all environment-bound. Do not change a single `pay-paypal/default` client from Sandbox to Live while old Sandbox work remains actionable.

Before switching environments:

1. Reconcile and finalize or expire actionable sessions in the old environment.
2. Allow delayed webhooks and queued provider operations from that environment to drain.
3. Confirm no post-cutover refund is needed for an old-environment capture.
4. Build with the new resolved environment and matching secrets, then deploy all workers coherently.

A Live `default` client must never process Sandbox sessions, captures, webhooks, or refunds, and the implementation rejects such environment mismatches. If historical Sandbox refunds must remain supported after Live cutover, add a separately named retained Sandbox client in an explicit follow-up; do not weaken the environment-match checks.

## Operational checks

Monitor and investigate:

- `payProviderOperation` rows in `reconciliation_required` or `failed`;
- callback 401/404 errors from expired or mismatched signed state;
- webhook verification errors, merchant mismatches, amount/currency mismatches, and replay conflicts;
- pending `payOutboxEvent` rows;
- expired Commerce orders with a late payment audit and an automatic `late-capture:` refund operation.

For a late verified capture after an order expired, retain the expired order. The system records the capture and creates a full compensation refund. Do not manually mark the order paid or recreate stock/coupon effects.

## Constraints

- Mock remains the default for ordinary development and deterministic CI.
- `PAYPAL_ENVIRONMENT` is an exact allowlist; invalid values must be corrected rather than silently choosing an endpoint.
- Do not remove legacy `a-paypal` until the active legacy-record archive/migration/disposal decision is recorded.
