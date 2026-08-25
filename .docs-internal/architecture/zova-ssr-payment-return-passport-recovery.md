# Zova SSR Payment Return and Passport Recovery

## Purpose

This note records the cross-layer behavior required when a customer returns from an external payment provider such as PayPal to a protected Commerce continuation page.

It preserves two separate invariants that are easy to conflate:

1. the continuation page must be an SSR-safe neutral shell until browser hydration has completed; and
2. the browser must be able to reconstruct a missing Passport projection from a still-valid token before protected-route admission.

Together, these invariants prevent a provider return from incorrectly reaching Login while preserving the server-owned payment settlement boundary.

## Scope and Non-Goals

This note covers the path from a provider return through Vona callback handling, anonymous SSR, browser hydration, Passport recovery, route admission, and delayed customer-owned payment/order queries.

It does not redefine:

- provider verification, durable `PaymentSession` transitions, outbox dispatch, or Commerce aggregate settlement, which remain owned by [A-Pay Payment Architecture](a-pay-payment-architecture.md);
- PayPal credentials, tunnel setup, webhook registration, or Sandbox operations, which belong in the [PayPal Commerce Sandbox and Tunnel Runbook](../business/a-commerce/paypal-commerce-runbook.md); or
- the generic Site and anonymous-SSR policy, which belongs in [User Workspace SSR Strategy](user-workspace-ssr-strategy.md).

## Triggering Scenario

A hosted-provider approval flow is a browser document-navigation boundary:

```text
Commerce payment page
  -> provider approval page
  -> public Vona payment callback
  -> protected Commerce continuation page
```

The browser token cookie may survive this navigation while the browser's local Passport projection is absent. Passport is the frontend authentication projection: `isAuthenticated` is based on the presence of `passport`, not merely the token cookie.

If the protected continuation route only sees the missing Passport projection, its route guard correctly treats the browser as unauthenticated and redirects to Login. The required recovery is to use the valid token to fetch the current Passport before completing route admission.

This is distinct from the historical SSR failure mode: a return page that starts an authenticated API call during server render can receive a server-side `401` and enter the SSR Login path before browser recovery is possible.

## End-to-End Return Sequence

```text
Provider approval
  -> GET /api/pay/payment-callback/return?state=...
  -> signed-state validation and server reconciliation/confirmation
  -> redirect to trusted /commerce/payment/:paymentSessionId/:orderId?providerResult=return
  -> anonymous SSR neutral shell
  -> browser hydration
  -> Passport recovery from valid token, if needed
  -> protected-route admission
  -> protected session/order reads and reconciliation
  -> payment/order presentation update or order navigation
```

### 1. Public provider callback and trusted continuation

`ControllerPaymentCallback` exposes public `return` and `cancel` endpoints. It consumes a signed, purpose-bound callback state, requests server-side provider confirmation or reconciliation, and redirects only to the persisted continuation path.

The callback state contains the selected payment-session/provider/client/environment identity and a continuation path. It is signed for the exact callback path and has a short lifetime. The payment scene derives the continuation; it is not supplied as an arbitrary browser redirect target.

Relevant source paths:

- `vona/src/suite-vendor/a-pay/modules/a-pay/src/controller/paymentCallback.ts`
- `vona/src/suite-vendor/a-pay/modules/a-pay/src/service/paymentCallback.ts`
- `vona/src/suite/a-commerce/modules/commerce-payment/src/bean/payScene.commerceOrder.ts`

### 2. Payment return is not settlement authority

A provider browser return/cancel is a notification input. It can cause server confirmation or reconciliation, but it cannot declare a Commerce payment outcome.

Verified provider facts update durable payment state. A verified terminal state produces `payment.outcome.v1` through the durable outbox, and the persisted payment scene delivers the outcome to the Commerce aggregate owner. That server-owned path remains authoritative even when the customer is logged out, the browser is closed, or the continuation page is never rendered.

Browser Passport recovery only restores frontend route admission. It is neither a provider verification step nor an authorization bypass for payment settlement.

### 3. Anonymous SSR neutral shell

For a Web-style SSR request with the `public` profile, the server does not recover Passport and route admission defers to the browser. The continuation route therefore must not initiate private payment-session, order, or reconciliation work while rendering on the server.

The payment page follows this rule:

- `__init__()` may retain server-required preparation, while `$ssr.handleDirectOrOnHydrated(...)` owns browser-only initialization;
- `$ssr.handleDirectOrOnHydrated(...)` does not invoke its callback on the server, delays it until after an SSR document has hydrated, and invokes it immediately for SPA startup or later client navigation;
- while `isRuntimeSsrHydrated` is false, `render()` returns the same neutral busy shell for server render and the browser's first hydration render.

This is stronger than merely avoiding private HTML. The server HTML and hydration-time first client tree must be equivalent; a private request or a differently shaped loading branch during hydration can still produce incorrect control flow or hydration mismatch.

Relevant source path:

- `zova/src/suite/a-commerce/modules/commerce-trade/src/page/payment/controller.tsx`

### 4. Browser Passport recovery and route admission

The Home router guard admits protected routes in this order:

1. allow routes explicitly marked `requiresAuth: false`;
2. bypass authenticated admission on the server when the effective profile is `public`;
3. when browser Passport is absent, call `ensurePassport()`;
4. redirect to the Site login route if Passport is still absent;
5. enforce the current `SITE_ID` role admission policy.

`ModelPassport.ensurePassport()` intentionally has no unconditional `process.env.CLIENT` early return. When the runtime can access cookies, Passport is absent, and an access token exists, it calls `homeUserPassport.current()` and stores the resulting Passport projection.

```ts
if (this.$ssr.profile === 'session' && !this.isAuthenticated && this.accessToken) {
  this.passport = await this.$api.homeUserPassport.current();
}
```

The deleted early return from commit `f027d7ad49b187fd78e4f36c881c45ed473ba3d2` must remain absent:

```ts
if (process.env.CLIENT) return this.passport;
```

Restoring it would make a client with a valid token but no local Passport return `undefined` to the protected-route guard. The guard would then redirect to Login before the payment page could run its post-hydration initialization.

This recovery is not payment-specific. It also supports a hard reload or another document-navigation boundary on any protected route where a valid token survives but the browser Passport projection does not.

Relevant source paths:

- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`
- `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`

### 5. Post-hydration private work

Only after the browser reaches the explicit hydration boundary may the payment controller:

1. load the customer-owned payment session;
2. load the customer-owned order;
3. call `reconcile()` for `providerResult=return`, or perform the cancel-return reconciliation path;
4. poll/reload the session and order presentation until the server-owned outcome becomes visible; and
5. navigate to the order page when the durable Commerce state is settled.

The page's private calls remain subject to normal Vona Passport and resource authorization. Browser route admission is user-experience control, not the final authorization boundary.

## Invariants Future Changes Must Preserve

1. **Do not restore the unconditional client return in `ensurePassport()`.** A valid cookie token must be able to reconstruct a missing browser Passport projection.
2. **Do not move payment-return private requests into SSR or hydration-time first render.** Server HTML and the first browser hydration tree must remain the same neutral shell.
3. **Do not infer payment success from a browser return.** Only verified server-side provider facts and their durable Commerce outcome delivery determine settlement.
4. **Do not make payment settlement depend on Passport or the continuation page.** The outbox/Commerce path must continue without a customer browser context.
5. **Keep protected APIs protected.** Client Passport restoration and router admission complement, but never replace, Vona API/resource authorization.
6. **Keep continuation targets trusted.** Provider callback state must remain path-bound, short-lived, and limited to scene-derived safe continuation paths.

## Failure Modes and Troubleshooting

| Symptom                                                  | Likely boundary                          | Checks                                                                                                                                                                                               |
| -------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The provider callback itself fails or does not redirect  | Callback state or provider operation     | Verify callback `state`, its purpose/path binding and expiry, the persisted operation, and server confirmation/reconciliation logs.                                                                  |
| The continuation immediately redirects to Login          | Browser route admission                  | Distinguish a missing/expired token from a missing Passport projection. With a valid token, verify that `ensurePassport()` calls `current()` and that the client early return has not been restored. |
| SSR response redirects to Login before browser hydration | SSR page behavior                        | Verify the return page has no authenticated API call, private-query creation, or private render branch during SSR/initial hydration. Preserve the neutral shell and post-hydration boundary.         |
| Passport restores but the payment page remains pending   | Presentation freshness versus settlement | Inspect payment session, provider operation, outbox delivery, Commerce attempt, and order state. A stale browser view does not prove settlement failed.                                              |
| Repeated return/callback creates another Commerce effect | Idempotency boundary                     | Inspect callback consume state, provider-operation idempotency, verified session transition, and outbox delivery rather than applying any Commerce transition manually.                              |
| Browser return says success but Commerce is not paid     | Payment authority                        | Treat browser return as input only. Trace verified provider fact, `PaymentSession`, outbox event, and Commerce outcome processing.                                                                   |

## Source-Tracing Order

When changing or diagnosing this path, read in this order:

1. `vona/src/suite-vendor/a-pay/modules/a-pay/src/controller/paymentCallback.ts`
2. `vona/src/suite-vendor/a-pay/modules/a-pay/src/service/paymentCallback.ts`
3. `vona/src/suite/a-commerce/modules/commerce-payment/src/bean/payScene.commerceOrder.ts`
4. `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`
5. `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`
6. `zova/src/suite/a-commerce/modules/commerce-trade/src/page/payment/controller.tsx`
7. `vona/src/suite-vendor/a-pay/modules/a-pay/src/bean/queue.outboxDispatch.ts`
8. the Commerce order payment-outcome consumer reached through the persisted payment scene

This order separates public callback security, server-owned payment authority, browser identity recovery, route admission, and presentation-state refresh rather than treating them as one redirect problem.

## Verification Scenarios

1. Start a redirect-capable payment, approve it at the provider, and verify the public callback reaches the signed trusted continuation without manually asserting an order outcome.
2. Directly load a `providerResult=return` continuation after clearing browser local/session storage while retaining a valid authentication cookie. Verify browser Passport recovery admits the protected route and the page reconciles/navigates as expected.
3. Inspect the server-rendered return-page HTML and the browser's initial hydration render. Both must be the neutral shell and contain no private payment/order data.
4. Test missing/expired tokens independently. The browser should redirect to Login through normal route admission; it must not treat an absent Passport projection as proof that a valid token is absent.
5. Repeat a terminal provider callback and combine return/webhook timing races. Verify one durable payment outcome and one Commerce effect.
6. Run the direct-return browser coverage in `e2e/specs/a-commerce.spec.ts` when validating the runtime path.

## Related Records

- [A-Pay Payment Architecture](a-pay-payment-architecture.md)
- [User Workspace SSR Strategy](user-workspace-ssr-strategy.md)
- [Zova `$goto...()` Navigation Control-Flow Semantics](zova-goto-navigation-control-flow-semantics.md)
- [SSR Vona/Zova Boundary and Call Chain](ssr-vona-zova-boundary-and-call-chain.md)
- [PayPal Commerce Sandbox and Tunnel Runbook](../business/a-commerce/paypal-commerce-runbook.md)
