# Stripe Sandbox Commerce Runbook

## Scope

This runbook validates the first Stripe Commerce path: server-created, hosted Stripe Checkout Sessions with automatic capture, server reconciliation, verified webhooks, and full or partial refunds. It does not authorize Stripe Live, embedded Checkout, Payment Element, saved payment methods, subscriptions, Connect, disputes, or chargebacks.

## Required server configuration

Provide these values through the deployed server secret source. Do not put credentials in frontend environment files or expose them through payment-method DTOs:

- `STRIPE_ENVIRONMENT=sandbox`
- `STRIPE_SECRET_KEY` — Stripe test-mode secret key
- `STRIPE_WEBHOOK_SECRET` — signing secret for the registered test webhook endpoint
- `STRIPE_MERCHANT_REFERENCE` — optional deployment/account reference retained for future account validation
- `SERVER_SERVE_PROTOCOL=https`
- `SERVER_SERVE_HOST=<public HTTPS host>`

The server must be publicly reachable at the configured origin. Callback URLs are generated from this trusted origin; browser query parameters cannot replace them. Keep the Stripe secret key and webhook signing secret server-only.

## Stripe application setup

1. Use an isolated Stripe test account or test-mode workspace.
2. Register the backend endpoint:
   `POST https://<public-host>/api/pay/webhook/pay-stripe:stripe/default`.
3. Subscribe to the Checkout Session, PaymentIntent, and Refund event families needed by this deployment. Avoid broad unrelated subscriptions until their ignored-event behavior is explicitly reviewed.
4. Copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET` and confirm the key and signing secret belong to the same Stripe test environment.
5. Restart the backend after configuration changes. Stripe appears in the Commerce payment-method projection only when the complete server configuration and public origin are available.

## Verification flow

1. Fetch Commerce payment methods while authenticated. Mock remains the default; Stripe appears only when the configuration gate passes.
2. Create a USD Commerce order selecting the `stripe` candidate key.
3. Start payment. Confirm the server creates one Checkout Session in `mode=payment` with one line item, the signed return/cancel URLs, the local payment/correlation/invoice references in metadata, and the durable A-Pay operation idempotency key as Stripe's idempotency key.
4. Follow the hosted Stripe Checkout redirect and complete the payment with a Stripe test payment method.
5. Confirm the browser return only triggers server reconciliation. It must not settle Commerce from URL parameters or client-side state.
6. Confirm the PaymentSession reaches a provider-neutral terminal state, stores the Checkout Session ID as its provider order ID, and stores the successful PaymentIntent ID as its provider payment/capture fact.
7. Deliver the signed Checkout Session or PaymentIntent webhook. Confirm the exact raw request body is used for signature verification, invalid signatures cause no trusted mutation, duplicate deliveries produce one inbox record/outbox outcome, and Commerce receives one settlement effect.
8. Submit a full and a partial refund. Confirm the refund operation carries local metadata and its durable idempotency key, and that query/webhook races converge to one refund outcome.
9. Repeat the callback and webhook delivery. Confirm no duplicate order, stock, coupon, or refund effects.

## Operational checks

Monitor and investigate:

- `payProviderOperation` rows in `reconciliation_required` or `failed`;
- callback 401/404 responses or expired signed callback state;
- invalid Stripe signatures, metadata/correlation conflicts, amount/currency conflicts, environment mismatches, and webhook inbox replay conflicts;
- pending `payOutboxEvent` rows;
- Commerce orders whose payment remains actionable or processing after the expected provider transition.

Never mark an order paid manually from a Checkout URL, redirect query parameter, Stripe Dashboard observation, or browser state. Use the persisted PaymentSession and provider-operation reconciliation path.

For an expired Commerce order with a later verified successful payment, retain the expired order and follow the existing late-capture compensation path. Do not revive stock or coupon effects.

## Cutover constraints

- Keep Mock as the default in development and deterministic CI.
- Keep Stripe Sandbox configuration limited to an internal validation cohort until operational checks pass.
- Do not configure Stripe Live or describe this path as production-ready in this change.
- Before Live approval, separately review account identity validation, webhook monitoring and alerting, secret rotation, replay/recovery procedures, rollback, refund reconciliation, and a controlled production smoke test.
