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
- Provider credentials are references such as `env://PAYPAL_CLIENT_SECRET`, never ordinary persisted client options or public DTO data.
- `@PayScene()` declares allowed providers, currency, capture policy, expiry, and refund policy. A scene does not provide arbitrary merchant credentials, arbitrary return URLs, or business settlement callbacks.
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

The controller must use `ctx.request.rawBody`; it must not reserialize parsed JSON for signature verification. An opaque configured endpoint key selects one enabled instance/provider/client/environment mapping before verification; the handler rejects any request context whose instance does not equal that configured binding, and request `iid`, query fields, and unsigned body fields never select an instance or merchant secret. A verified event is stored in `WebhookInbox`, deduplicated by active instance/provider/client/event ID, normalized, and then causes atomic session/audit/outbox updates. The current `pay-mock` verifier requires `PAY_MOCK_WEBHOOK_SECRET` and accepts only signed terminal payment facts.

Browser redirects are notification inputs. A return/cancel page can request server reconciliation but cannot declare payment success. A verified terminal session fact emits `payment.outcome.v1` through the durable outbox; Commerce consumes the stable provider event ID idempotently under its existing serializable Order lock, without a customer Passport context.

## PayPal v1 and refunds

PayPal v1 supports hosted approval, automatic capture, verified status/webhook reconciliation, and full or partial refunds against a stored capture ID. Manual authorization/capture, subscriptions, vaulted methods, disputes, and chargebacks are deferred.

Partial refunds are a pre-shipment monetary adjustment. They do not restore stock. Stock restoration occurs only once after the order has been fully refunded. Refund amount cannot exceed captured amount minus successful and active approved refund amounts.

## Legacy a-paypal

Legacy `a-paypal` is not a migration base. It remains only until `pay-paypal` has completed sandbox Commerce cutover and active legacy records have an explicit archive/migration/disposal decision. Then remove its source, dependency, callback routes, SDK residue, and old credentials. Rotate all legacy credentials before any live cutover.

## Acceptance requirements

Tests must prove invalid signatures cause no trusted mutation; duplicate/concurrent/out-of-order webhooks converge; return/webhook/reconciliation races produce one Commerce effect; provider request IDs survive crash recovery; and payment/refund state, stock/coupon effects, and outbox records roll back together. Tests use explicit independent `mockCtx(...)` boundaries for every competing operation.
