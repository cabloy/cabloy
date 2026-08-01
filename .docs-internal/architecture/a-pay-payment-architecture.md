# A-Pay Payment Architecture

## Status

Accepted for Cabloy Basic implementation. The first vertical slice is `pay-mock`; PayPal is the first live-provider target. Stripe is scaffolded but intentionally unavailable until the generic session, webhook, and recovery path is proven.

## Ownership

```text
commerce-trade -> commerce-payment -> a-pay <- pay-mock / pay-paypal / pay-stripe
```

- `commerce-trade` owns Order, stock and coupon effects, shipment eligibility, refund eligibility, and the only aggregate transitions that can make an order paid or refunded.
- `commerce-payment` owns the Commerce `PaymentAttempt`, refund request/attempt records, Commerce audit rules, and the `commerce-order` payment scene.
- `a-pay` owns provider-neutral `PaymentSession`, provider and refund operations, verified webhook receipts, payment audit records, and durable outbox records.
- Provider modules only translate provider SDK/API/webhook facts into provider-neutral snapshots. They must never mutate Commerce records directly.

A Commerce `PaymentAttempt` has one initial `a-pay` `PaymentSession`; future retry or provider-switch work may add more sessions without changing the Commerce aggregate identity.

## Provider and scene contracts

`a-pay` uses the established `a-file`/`a-image` provider and scene pattern:

- `@PayProvider()` supplies a typed capability and execution contract with `base + clients` configuration.
- Vona loads Provider secrets from its env cascade at bootstrap, and `@PayProvider()` captures them in private server-side metadata as `secretCredential` and `secretWebhook`. The `secret*` prefix reserves a future metadata-sanitization boundary; it does not currently add generic redaction. Secrets are never persisted in payment records or emitted through DTO, OpenAPI, frontend, audit, outbox, or Provider summary data.
- `secretWebhook` is client-level by default. Put it in `base` only when every declared client intentionally shares the identical value. Provider operations receive the selected merged `base + client` options; operation code must not reread Vona env or `process.env`.
- `@PayScene()` declares an allowlist of named `providerName + clientName` candidates, currency, capture policy, expiry, and refund policy. Its optional resolver chooses only a declared candidate key; it cannot supply an arbitrary provider, client, environment, credential, or return URL. `a-pay` resolves the selected Provider client, derives its environment and the scene-defined absolute expiry, and persists those values as the immutable `PaymentSession` execution snapshot. A scene also owns the single `onPaymentOutcome` callback selected by the persisted `PaymentSession.payScene`; the callback may use Vona scope lookup to delegate to the aggregate owner, but it is not a global broadcast mechanism.

### Deferred customer provider selection

A multi-candidate scene may eventually allow a customer to select a payment method, but Cabloy Basic does not add a Checkout selector until a second Provider is fully usable in Commerce. The current Commerce scene has exactly one `pay-mock/default` candidate, so server-side automatic selection remains the only active flow.

When a live PayPal or Stripe Provider completes its execution, verified webhook/reconciliation, and Zova UI adapter work, implement the selector together with that Provider integration:

- `providers` remains the scene's static Provider-Client allowlist; each candidate has a stable, scene-local `key`.
- Server policy resolves the current order/user/instance/currency context into an `availableKeys` subset and one `defaultKey`. A candidate's presence in `providers` alone does not guarantee present-time availability.
- Checkout receives only a public payment-method projection (candidate key, label, description, icon, display order, and interaction kind). It does not receive raw Provider options, `secretCredential`, `secretWebhook`, merchant configuration, webhook configuration, or an environment value.
- Checkout submits only an optional `providerCandidateKey`; it never submits `providerName`, `clientName`, `environment`, credentials, or return URLs.
- `PaymentSession.create()` must recompute the server-side availability decision and reject a submitted key outside `availableKeys`. An omitted key selects `defaultKey`; a previously rendered choice is never trusted without this creation-time revalidation.
- PayScene owns eligibility, defaulting, and selection validation. Provider modules own their payment-method presentation metadata and redirect/embedded UI adapters. Commerce Checkout renders generic options and dispatches the persisted `PaymentSession.nextAction` to the selected Provider adapter rather than hard-coding Provider-specific branches.

This deferred work must be delivered with focused API, Zova, and lifecycle tests for default selection, invalid or stale submitted candidate keys, changed availability, and the selected Provider's redirect or embedded completion path.

- Amount and currency are immutable minor-unit values set by the business domain before a Provider operation is created.

## Side effects and durable delivery

Provider calls use two short local transaction phases:

1. lock and claim/persist a provider operation and stable Provider idempotency key;
2. commit;
3. call the Provider outside database transaction and retry AOP boundaries;
4. lock again, persist a sanitized response, transition the session, append audit, and insert an outbox event atomically.

The database outbox, not a synchronous Vona event or a queue push, is the durable source of pending delivery. A queue nudge is allowed after commit for latency; a bounded recovery schedule scans due and expired-lease rows. Each worker claim carries a token and lease, and completion compares that token so a stale worker cannot overwrite a reclaimed delivery. Consumers must accept duplicate delivery safely.

## Webhooks

Webhook endpoints are `@Passport.public()` only to bypass end-user Passport. Provider signature verification, endpoint-to-client mapping, account validation, and event identity are the authentication boundary.

The controller must use `ctx.request.rawBody`; it must not reserialize parsed JSON for signature verification. An opaque configured endpoint key selects one enabled instance/provider/client/environment mapping before verification; the handler resolves that exact client’s private Provider options, rejects a configured environment mismatch, and request `iid`, query fields, and unsigned body fields never select an instance, client, or merchant secret. A verified event is stored in `WebhookInbox`, deduplicated by active instance/provider/client/event ID, normalized, and then causes atomic session/audit/outbox updates. The current `pay-mock` verifier uses the selected client’s `secretWebhook` and accepts only signed terminal payment facts.

Browser redirects are notification inputs. A return/cancel page can request server reconciliation but cannot declare payment success. A verified terminal session fact creates `payment.outcome.v1` through the durable outbox; the dispatch worker resolves the persisted `PaymentSession.payScene` and invokes its `onPaymentOutcome` callback. The Commerce scene delegates through Vona scope lookup to the Commerce Order owner, which consumes the stable provider event ID idempotently under its existing serializable Order lock, without a customer Passport context.

## Current pay-mock boundary

The current customer flow is deliberately limited to the `pay-mock` provider. Its completion controls are a development/test simulator, not a production payment capability: the server restricts them to the active instance, authenticated session ownership, actionable `pay-mock/default` sandbox sessions, and signed mock webhooks. The simulator forwards the active instance selector with its internal webhook so finalization remains tenant-scoped. The browser must never declare a Commerce payment outcome directly.

The `PaymentSession.nextAction` contract is provider-neutral, but live-provider work remains incomplete. A live provider must add its own redirect or embedded UI adapter, durable provider-operation recovery, authoritative `queryPayment()` reconciliation, captured-payment versus expired-order compensation, and stronger webhook-event convergence for abnormal lock-topology failures. Until those pieces exist, do not enable a live provider for Commerce checkout.

## PayPal v1 and refunds

PayPal v1 supports hosted approval, automatic capture, verified status/webhook reconciliation, and full or partial refunds against a stored capture ID. Manual authorization/capture, subscriptions, vaulted methods, disputes, and chargebacks are deferred.

Partial refunds are a pre-shipment monetary adjustment. They do not restore stock. Stock restoration occurs only once after the order has been fully refunded. Refund amount cannot exceed captured amount minus successful and active approved refund amounts.

## Legacy a-paypal

Legacy `a-paypal` is not a migration base. It remains only until `pay-paypal` has completed sandbox Commerce cutover and active legacy records have an explicit archive/migration/disposal decision. Then remove its source, dependency, callback routes, SDK residue, and old credentials. Rotate all legacy credentials before any live cutover.

## Acceptance requirements

Tests must prove invalid signatures cause no trusted mutation; duplicate/concurrent/out-of-order webhooks converge; return/webhook/reconciliation races produce one Commerce effect; provider request IDs survive crash recovery; and payment/refund state, stock/coupon effects, and outbox records roll back together. Tests use explicit independent `mockCtx(...)` boundaries for every competing operation.
