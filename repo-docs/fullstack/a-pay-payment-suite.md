# A-Pay Payment Suite

This guide explains the current payment architecture in Cabloy Basic across Vona, Zova, and the Commerce domain.

It is a source-oriented architecture guide for:

- application authors integrating a payment scene;
- provider-module authors implementing a payment adapter;
- Zova developers consuming payment-session state and next actions;
- maintainers tracing callbacks, webhooks, settlement, and SSR return flows.

This is **not** a production rollout manual or payment-provider compliance guide. It does not include real credentials, account identifiers, domains, tunnel commands, or internal operational diagnostics. For sanitized PayPal and Stripe Sandbox setup, trusted public-origin configuration, webhook registration templates, and validation guidance, see [Payment Provider Sandbox Configuration](/fullstack/payment-sandbox-configuration).

## The short version

A-Pay is a provider-neutral payment infrastructure layer. Commerce owns the business result; A-Pay owns the payment-session and provider-operation result; provider modules translate external provider facts into A-Pay facts; Zova presents and observes those facts.

```text
Commerce trade
    -> Commerce payment boundary
    -> A-Pay payment-session boundary
    <- pay-mock / pay-paypal / pay-stripe provider adapters
```

The most important rule is:

> A browser redirect, callback, or rendered success state is not proof of payment. Verified provider facts, persisted payment state, durable outcome delivery, and the business aggregate owner determine settlement.

## Suite and module topology

The payment feature is a vendor suite named `a-pay`, mirrored in both framework halves:

```text
vona/src/suite-vendor/a-pay/
├── modules/
│   ├── a-pay/
│   ├── pay-mock/
│   ├── pay-paypal/
│   └── pay-stripe/
└── package.json

zova/src/suite-vendor/a-pay/
├── modules/
│   ├── a-pay/
│   ├── pay-mock/
│   ├── pay-paypal/
│   └── pay-stripe/
└── package.json
```

The general suite/module organization is described in [Suites and Modules](/fullstack/suites-and-modules). The payment suite follows the vendor-suite layout rather than being a complete user-facing page package.

| Module       | Vona responsibility                                                                                       | Zova responsibility                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `a-pay`      | Payment sessions, provider operations, callbacks, webhooks, normalized contracts, audit/outbox boundaries | Payment-session API/model, generated contracts, next-action component, redirect coordinator |
| `pay-mock`   | Deterministic development/test provider and simulator webhook path                                        | Mock completion mutation used by the Commerce test surface                                  |
| `pay-paypal` | PayPal API, capture, query, refund, and webhook translation                                               | Provider identity and metadata surface; no PayPal SDK execution in the browser              |
| `pay-stripe` | Stripe Checkout, query, refund, and webhook translation                                                   | Provider identity and metadata surface; no Stripe SDK execution in the browser              |

The actual Web payment page is owned by the Commerce consumer, not by `zova-module-a-pay`:

```text
zova/src/suite/a-commerce/modules/commerce-trade/src/page/payment/controller.tsx
```

This separation lets A-Pay stay reusable while Commerce owns order-specific presentation, polling, and navigation.

## Ownership and authority

The ownership chain in the current implementation is:

```text
commerce-trade -> commerce-payment -> a-pay <- pay-mock / pay-paypal / pay-stripe
```

| Layer            | Owns                                                                                                                                          | Must not own                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Commerce trade   | Order transitions, inventory and coupon effects, shipment eligibility, and order/refund business rules                                        | Provider SDK calls or webhook parsing                  |
| Commerce payment | Commerce `PaymentAttempt`, refund records, audit rules, and the Commerce payment scene                                                        | Direct provider integration                            |
| A-Pay            | Provider-neutral `PaymentSession`, provider/refund operations, verified webhook receipts, payment audit records, and durable outcome delivery | Commerce aggregate settlement rules                    |
| Provider modules | Translation between provider API/webhook facts and normalized A-Pay snapshots                                                                 | Direct mutation of Commerce orders or payment attempts |
| Zova consumers   | Payment-session observation, user actions, next-action presentation, and post-hydration refresh                                               | Declaring payment success or settling an order         |

A Commerce payment attempt initially has one A-Pay payment session. A future retry or provider switch can create another session without changing the Commerce aggregate identity. The payment session is the provider-execution boundary; the order remains the business boundary.

## Payment session and state model

A `PaymentSession` records the facts needed to execute and reconcile one provider payment attempt. Among other fields, the current entity stores:

- the owning user and payment scene;
- the business reference and correlation identifiers;
- amount in minor units and currency;
- the selected provider, client, and environment snapshot;
- provider invoice/order/payment/capture identifiers as they become known;
- the current state, next action, expiration, and finalization time.

The amount and currency are established by the business domain before provider execution. Provider selection is resolved by the server from the payment scene; the browser does not choose arbitrary provider configuration.

The session state is a discriminated union:

```text
created
  -> starting
  -> requires_action | processing | succeeded | failed | cancelled
  -> expired
```

| State             | Meaning                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `created`         | The business domain created the session, but provider execution has not started.                    |
| `starting`        | A provider start operation is being prepared or executed.                                           |
| `requires_action` | The customer must follow a provider-directed action, usually a redirect in the current providers.   |
| `processing`      | The provider has accepted or is processing the operation, but a terminal fact is not available yet. |
| `succeeded`       | A verified terminal provider fact reports success.                                                  |
| `failed`          | A verified terminal provider fact reports failure.                                                  |
| `cancelled`       | The payment was cancelled or the provider reported cancellation.                                    |
| `expired`         | The session passed its allowed lifetime without completing.                                         |

The payment session and Commerce order are separate state machines. A terminal payment session can become visible before the outbox consumer settles the order, so the frontend must represent **pending confirmation** rather than assuming that a terminal provider state immediately means a paid order.

### The `nextAction` contract

The backend exposes a normalized action union. Zova consumers branch on `nextAction.kind`, not on PayPal- or Stripe-specific SDK objects.

| Action kind | Consumer behavior                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `redirect`  | In the browser, send the customer to the supplied provider URL through the shared payment coordinator.                                             |
| `embedded`  | Pass the client-facing token/configuration to the selected provider UI adapter. The current shared coordinator does not execute embedded checkout. |
| `pending`   | Show preparation or status messaging and offer a safe refresh/reconcile action when appropriate.                                                   |
| `completed` | Show completion messaging, while still waiting for the business aggregate to expose its settled state.                                             |

The normalized contract is defined in the backend payment types and view DTO, then carried to Zova through generated OpenAPI types and schemas. Do not hand-edit generated API output; change the backend contract source and follow the [contract loop playbook](/fullstack/contract-loop-playbook).

## End-to-end payment lifecycle

The following flow is source-confirmed by the current Commerce and A-Pay implementation.

1. The authenticated customer opens Commerce checkout.
2. Commerce asks its payment scene for the currently available provider candidates through `GET /api/commerce/trade/checkout/payment-methods`.
3. Checkout submits order data and, at most, a scene-local `providerCandidateKey` through `POST /api/commerce/trade/checkout`.
4. Commerce creates the order in `awaiting_payment`, creates a `PaymentAttempt`, and creates the associated A-Pay `PaymentSession` in `created` state.
5. A-Pay re-evaluates provider availability and the submitted candidate on the server. It resolves a declared provider/client pair, snapshots its execution context and expiry, and rejects stale or ineligible choices.
6. Commerce navigates to an authenticated Commerce payment route with the payment-session and order identifiers. Callback continuation remains server-selected and allowlisted; do not derive it from provider or browser input.
7. The customer starts the session. Zova calls `POST /api/pay/payment-session/{id}/start`; A-Pay claims a provider operation with a stable idempotency key before making the external provider call.
8. The provider adapter returns a normalized snapshot and optional `nextAction`. Redirect-capable providers normally return `requires_action` with a redirect action.
9. Zova renders the generic next-action component. On the client, the redirect coordinator uses `window.location.assign(...)`; it does not call a provider SDK or decide whether the order is paid.
10. The provider returns through the server callback route, or sends a webhook to the public webhook route. A return callback can request confirmation or reconciliation, but cannot assert success.
11. A-Pay verifies provider webhook input using the selected server-side client and the raw request body, then correlates provider, client, environment, amount, currency, and identifiers with the persisted session.
12. Verified facts are deduplicated and applied to payment state. The state transition, audit entry, and `payment.outcome.v1` outbox record are written durably.
13. An outbox worker dispatches the outcome. The persisted payment scene resolves its outcome handler, which delegates to the Commerce order owner.
14. Commerce validates the payment-session and business references, amount, currency, provider event identity, and current order/attempt state before applying the idempotent paid, cancelled, or refund transition.
15. Zova reconciles and polls the payment session and order. It navigates to the order page only when the two durable views agree. If delivery is delayed, the page remains in a pending-confirmation state and offers refresh/reconcile controls.

The provider call is intentionally outside the short database transaction. The durable phases are committed before and after that external call, so crash recovery and duplicate delivery are expected parts of the design. Consumers must therefore be idempotent.

## Payment scenes and provider selection

A payment scene is the business-domain policy boundary. It declares and coordinates:

- the allowlist of named provider/client candidates;
- supported currency and amount policy;
- capture, refund, and partial-refund policy;
- session expiry;
- current availability and default selection;
- the outcome handler for the owning business aggregate;
- the trusted continuation behavior for customer returns.

The checkout projection contains only safe presentation data such as a candidate key, label, description, display order, and interaction kind. The browser submits only the candidate key. It must never submit:

- an arbitrary provider or client name;
- environment or merchant account information;
- credentials or webhook secrets;
- provider callback URLs;
- raw provider SDK options.

A candidate appearing in the scene allowlist does not guarantee present-time availability. A-Pay recomputes availability when creating the session. An omitted choice uses the server-selected default; an invalid, stale, or disabled choice is rejected rather than silently replaced.

### Current provider modules

- **`pay-mock`** is a deterministic development and test provider. Its simulator sends a signed mock webhook through the normal webhook path, so tests exercise verification, state transitions, durable outcome delivery, and Commerce settlement instead of directly mutating a session.
- **`pay-paypal`** owns the server-side PayPal hosted-approval, capture, query, refund, and webhook translation boundary. The browser receives normalized actions and never receives PayPal credentials or SDK authority.
- **`pay-stripe`** owns the server-side Stripe hosted Checkout, query, refund, and webhook translation boundary. The browser receives normalized actions and never receives Stripe credentials or SDK authority.

The frontend PayPal and Stripe modules are currently identity/metadata surfaces. Provider execution, credentials, callbacks, webhook verification, and reconciliation remain backend responsibilities.

## Provider-module authoring contract

A provider adapter implements the neutral A-Pay execution boundary rather than writing Commerce-specific logic. Depending on its capabilities, the adapter supplies operations conceptually equivalent to:

- start payment;
- confirm payment;
- query or reconcile payment;
- create and query refunds;
- verify webhooks.

An adapter should:

1. use only the selected, server-resolved client options;
2. translate provider responses into A-Pay payment/refund snapshots;
3. preserve provider identifiers needed for correlation and idempotency;
4. verify webhook input before returning a trusted event identity and payload;
5. validate provider facts against the persisted session context;
6. return only safe summary and next-action data through outward-facing contracts;
7. leave Commerce `PaymentAttempt` and `Order` mutations to the Commerce owner.

The adapter must not derive authoritative payment identity, amount, currency, environment, or continuation targets from untrusted browser or webhook fields. Webhook verification receives the raw request body because reserialized JSON is not an equivalent signature input.

## Zova consumption model

Read the frontend in Zova’s own roles first:

| Zova role                        | Current A-Pay responsibility                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ModelPaymentSession`            | Model-owned query and mutation state for `view`, `start`, and `reconcile`, including invalidation after mutations |
| `ControllerPaymentNextAction`    | Component-controller behavior for redirect, pending, completed, and embedded action rendering                     |
| `ServicePaymentCoordinator`      | Client-only execution of a normalized redirect action                                                             |
| `ZPaymentNextAction`             | Metadata-backed public component wrapper for the action controller                                                |
| Commerce payment page controller | Route state, start/reconcile decisions, settlement polling, and order navigation                                  |

This is not page-local Vue fetching rewritten with classes. The model bean owns remote query/mutation state; the controller owns interaction and lifecycle decisions; the service bean owns reusable browser-side behavior; the render/component wrapper exposes the controller to consumers.

The core frontend reading path is:

1. `zova/src/suite-vendor/a-pay/modules/a-pay/src/types/payment.ts`
2. `zova/src/suite-vendor/a-pay/modules/a-pay/src/model/paymentSession.ts`
3. `zova/src/suite-vendor/a-pay/modules/a-pay/src/api/paymentSession.ts`
4. `zova/src/suite-vendor/a-pay/modules/a-pay/src/apiSchema/paymentSession.ts`
5. `zova/src/suite-vendor/a-pay/modules/a-pay/src/service/paymentCoordinator.ts`
6. `zova/src/suite-vendor/a-pay/modules/a-pay/src/component/paymentNextAction/controller.tsx`
7. `zova/src/suite/a-commerce/modules/commerce-trade/src/page/payment/controller.tsx`

When a consumer uses `controllerRef` on `ZPaymentNextAction`, it receives the Zova component controller instance. It is not a generic DOM or Vue component reference.

### Frontend consumer rules

- Keep payment-session query/mutation state in `ModelPaymentSession`.
- Consume generated API types and schemas; do not hand-patch generated files.
- Pass the normalized `nextAction` to the generic action component instead of adding provider-specific branches to Commerce pages.
- Execute redirects only in the browser.
- Keep mock simulator controls limited to mock sessions and development/test surfaces.
- Treat payment-session terminal state and Commerce order settlement as separate observations.
- Keep customer-visible success behind authenticated, server-authorized reads.

## Callback, SSR, and hydration

A provider return crosses two boundaries:

1. **Settlement authority:** the server callback confirms or reconciles provider state; it does not trust a browser assertion.
2. **Browser route recovery:** after an external provider navigation, the browser may need to restore the Passport projection before accessing customer-owned payment and order data.

The current return path is conceptually:

```text
provider return or cancel
  -> public A-Pay callback with opaque state
  -> server confirm or reconcile
  -> allowlisted Commerce continuation
  -> SSR-compatible payment route
  -> browser hydration and Passport admission
  -> authenticated payment-session reconciliation
  -> durable order settlement observation
```

The Commerce payment route requires authentication and uses the session SSR profile. Its controller keeps server-required preparation separate from browser-only initialization and passes the latter through `$ssr.handleDirectOrOnHydrated(...)`. This helper returns without invoking its callback on the server, queues it until initial SSR hydration completes, and runs it immediately for SPA startup or later client navigation. The payment-session model avoids creating private server-side query state when cookies are unavailable or the Passport is not authenticated. After hydration and admission, the controller can reconcile, poll, and navigate using customer-authorized reads.

The invariant is more important than a particular visual shell: server HTML and the hydration-time initial render must agree about private payment/order data. Do not render customer-owned payment state on the server when the request cannot authorize it, and do not let the provider return itself settle Commerce.

When the active repository provides the corresponding internal architecture note, maintainers can consult it for deeper SSR return and Passport recovery rationale. The public rule remains: settle on verified server facts; recover private browser state only after hydration and authorization.

## Reliability and security invariants

Use this checklist when extending or reviewing the payment flow:

- Amount and currency are immutable, server-owned session facts.
- Provider selection is scene-allowlisted and revalidated when the session is created.
- Provider calls have durable operation records, idempotency keys, claim leases, and recovery paths.
- Webhooks are verified against the raw body and the selected server-side provider client.
- Verified webhook facts are correlated with the persisted session before trusted mutation.
- Webhook receipts and provider event IDs are deduplicated.
- Terminal session transitions, audit records, and outcome outbox entries are durable and atomic.
- Outbox delivery is at-least-once; Commerce consumers must handle duplicate and out-of-order delivery safely.
- Browser callbacks, frontend polling, and Passport recovery never directly settle Commerce.
- Callback continuations are opaque, short-lived, signed, and allowlisted by the server.
- Payment-session endpoints enforce authenticated ownership; route admission does not replace resource authorization.
- Provider secrets and private configuration never enter DTOs, OpenAPI output, frontend state, audit summaries, or public documentation.

## Source-reading map

For backend contract and orchestration:

1. `vona/src/suite-vendor/a-pay/modules/a-pay/src/types/payment.ts`
2. `vona/src/suite-vendor/a-pay/modules/a-pay/src/controller/paymentSession.ts`
3. `vona/src/suite-vendor/a-pay/modules/a-pay/src/service/paymentSession.ts`
4. `vona/src/suite-vendor/a-pay/modules/a-pay/src/service/providerOperation.ts`
5. `vona/src/suite-vendor/a-pay/modules/a-pay/src/controller/paymentCallback.ts`
6. `vona/src/suite-vendor/a-pay/modules/a-pay/src/controller/webhook.ts`
7. `vona/src/suite-vendor/a-pay/modules/pay-mock/src/bean/payProvider.mock.ts`
8. `vona/src/suite-vendor/a-pay/modules/pay-paypal/src/bean/payProvider.paypal.ts`
9. `vona/src/suite-vendor/a-pay/modules/pay-stripe/src/bean/payProvider.stripe.ts`
10. `vona/src/suite/a-commerce/modules/commerce-trade/src/service/order.ts`

For frontend contracts and consumption:

1. `zova/src/suite-vendor/a-pay/modules/a-pay/src/types/payment.ts`
2. `zova/src/suite-vendor/a-pay/modules/a-pay/src/model/paymentSession.ts`
3. `zova/src/suite-vendor/a-pay/modules/a-pay/src/api/paymentSession.ts`
4. `zova/src/suite-vendor/a-pay/modules/a-pay/src/apiSchema/paymentSession.ts`
5. `zova/src/suite-vendor/a-pay/modules/a-pay/src/service/paymentCoordinator.ts`
6. `zova/src/suite-vendor/a-pay/modules/a-pay/src/component/paymentNextAction/controller.tsx`
7. `zova/src/suite/a-commerce/modules/commerce-trade/src/routes.ts`
8. `zova/src/suite/a-commerce/modules/commerce-trade/src/page/checkout/controller.tsx`
9. `zova/src/suite/a-commerce/modules/commerce-trade/src/page/payment/controller.tsx`

For the generated contract handoff, follow the backend DTO/OpenAPI source to the generated Zova API/types and then to the model/page consumer. See [Vona + Zova Integration](/fullstack/vona-zova-integration) and [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Relationship to other guides

- [Suites and Modules](/fullstack/suites-and-modules) explains the suite-first source-tree model.
- [Payment Provider Sandbox Configuration](/fullstack/payment-sandbox-configuration) explains sanitized PayPal and Stripe Sandbox setup, public-origin configuration, and end-to-end validation.
- [Vona + Zova Integration](/fullstack/vona-zova-integration) explains the cross-framework integration boundary.
- [Contract Loop Playbook](/fullstack/contract-loop-playbook) explains how backend contracts become generated frontend consumers.
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers) explains controller, model, service, and IoC roles in Zova-native terms.
- [Transaction Guide](/backend/transaction-guide) and [Queue Guide](/backend/queue-guide) provide framework-level background for the durable phases used by A-Pay.

## Verification

For documentation changes, run:

```bash
npm run docs:build
```

Then confirm that **Fullstack / Architecture & Integration → A-Pay Payment Suite** opens correctly and that the linked public guides resolve. When the implementation changes, recheck this page against current source; generated contracts and legacy operational notes are not substitutes for authored source truth.
