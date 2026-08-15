# PayPal Commerce Sandbox and Tunnel Runbook

## Scope and documentation boundary

This is the canonical maintainer-facing operational reference for the `pay-paypal` Commerce path. It covers PayPal Sandbox/Live configuration, local HTTPS tunnel testing, webhook registration, and runtime diagnostics. The shorter [PayPal Sandbox Commerce Runbook](./paypal-sandbox-runbook.md) is a Sandbox-only checklist; this document owns the detailed shared setup and diagnostics. It does not authorize removal of the legacy `a-paypal` module, replace the payment architecture or test plan, or make Live rollout decisions.

User-facing setup guidance belongs in `cabloy-docs/`; this runbook records repository-specific wiring and operational checks.

## Environment selection

`PAYPAL_ENVIRONMENT` selects the PayPal endpoint and must be exactly one of:

- `sandbox` for PayPal Sandbox;
- `live` for PayPal Live.

Every PayPal value must come from the same environment. Never combine Sandbox credentials with a Live webhook or merchant ID, or vice versa. The selected environment is part of PaymentSession and provider-operation behavior; changing it is not a safe in-place switch for existing actionable sessions.

Backend values are loaded through the Vona env cascade under `vona/env/`. For local development, use the ignored `vona/env/.env.local` override. Do not put PayPal secrets in frontend env files or committed files. The effective values may also be supplied by the deployment secret manager. The relevant env cascade and local precedence are documented in [Runtime Environments and Flavors](../../../cabloy-docs/backend/runtime-and-flavors.md).

Changing env files or deployment secrets requires restarting/rebuilding the affected Vona process; a production change requires coordinated rebuild and deployment of all workers.

## PayPal environment variables

The PayPal provider declares and consumes these variables in `payProvider.paypal.ts`:

| Variable                    | Meaning                                                                                                                                     | Official source and setup                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PAYPAL_ENVIRONMENT`        | Provider environment selector: `sandbox` or `live`.                                                                                         | Select the corresponding environment in the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).                                             |
| `PAYPAL_CLIENT_ID`          | OAuth client ID for the PayPal REST application used by this backend.                                                                       | In the selected Dashboard environment, open or create the REST app and copy its client ID.                                                                     |
| `PAYPAL_CLIENT_SECRET`      | OAuth client secret for that same REST application.                                                                                         | Copy it from the selected app's credentials view. Treat it as a deployment secret; never commit it or expose it to browser code.                               |
| `PAYPAL_WEBHOOK_ID`         | PayPal's identifier for the registered webhook. It is not the webhook URL and is sent to PayPal's `verify-webhook-signature` API.           | Create the webhook in the selected Dashboard environment, then copy the generated Webhook ID.                                                                  |
| `PAYPAL_MERCHANT_REFERENCE` | Expected PayPal merchant/payee ID. The adapter compares it with merchant facts returned by PayPal before accepting payment or refund facts. | Obtain the receiving merchant/payee ID from the selected PayPal business account or a verified PayPal API response. Keep the Sandbox and Live values separate. |
| `SERVER_SERVE_PROTOCOL`     | External protocol used to construct trusted absolute callback and return URLs.                                                              | Use `https` for PayPal and for an HTTPS tunnel, even when the tunnel forwards to local HTTP.                                                                   |
| `SERVER_SERVE_HOST`         | External host used to construct trusted absolute URLs. It must contain only the hostname, without `https://`, a port, or a path.            | Set it to the currently registered public hostname, such as `<tunnel-host>` or `payments.example.com`.                                                         |
| `SERVER_SUBDOMAINOFFSET`    | Number of rightmost hostname labels treated as the base domain for Vona subdomain-derived instance resolution.                              | Keep the default `2` for a normal two-label base domain. Override it only after evaluating the tunnel hostname's labels and the intended instance mapping.     |

A safe local placeholder configuration is:

```dotenv
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_CLIENT_ID=<sandbox-client-id>
PAYPAL_CLIENT_SECRET=<sandbox-client-secret>
PAYPAL_WEBHOOK_ID=<sandbox-webhook-id>
PAYPAL_MERCHANT_REFERENCE=<sandbox-merchant-id>
SERVER_SERVE_PROTOCOL=https
SERVER_SERVE_HOST=<public-tunnel-host>
SERVER_SUBDOMAINOFFSET=2
```

Do not copy real credentials, merchant IDs, webhook IDs, or generated tunnel hostnames into this runbook. Local overrides and generated `.vona` artifacts are not documentation sources.

## Obtaining PayPal values from the official Dashboard

Repeat this procedure independently for Sandbox and Live:

1. Sign in to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/) and select the intended environment.
2. Open **Apps & Credentials** and create or select the REST application used by this backend.
3. Copy that application's **Client ID** into `PAYPAL_CLIENT_ID`.
4. Reveal/copy the application's **Secret** into `PAYPAL_CLIENT_SECRET` using the deployment secret source or ignored local override.
5. Confirm the receiving business account and obtain its merchant/payee identifier for `PAYPAL_MERCHANT_REFERENCE`. Do not substitute the application Client ID.
6. Create the webhook only after the public HTTPS endpoint is reachable, following the procedure below.
7. Copy the Webhook ID generated by PayPal into `PAYPAL_WEBHOOK_ID`.
8. Restart/rebuild Vona and verify that all values are paired with the selected `PAYPAL_ENVIRONMENT`.

The buyer account used for Sandbox approval must also be a Sandbox test account. Sandbox and Live applications, buyer accounts, webhook registrations, credentials, and merchant references are separate resources.

## Public origin and tunnel setup

PayPal cannot call `localhost`, `127.0.0.1`, or a private LAN address. For local Sandbox webhook and browser-return testing:

1. Start Vona on the local listening port selected by the active env cascade.
2. Start an HTTPS tunnel that forwards its public HTTPS endpoint to that local Vona entry point. The provider-neutral command shape is:

   ```text
   <tunnel-client> http <local-entry-port>
   ```

3. Use the tunnel's current public hostname as `SERVER_SERVE_HOST` and set `SERVER_SERVE_PROTOCOL=https`.
4. Ensure the tunnel forwards requests to the intended Vona port and preserves the external `Host` and relevant forwarded protocol/host information. If a reverse proxy sits in front of Vona, configure it consistently as well.
5. Restart Vona after changing the env override. Confirm that generated approval, return, and webhook URLs contain the tunnel hostname and do not contain `localhost`.
6. Register the webhook URL in PayPal using the same hostname. If the tunnel hostname changes, update `SERVER_SERVE_HOST` and replace/update the PayPal webhook registration.

A tunnel is temporary infrastructure, not a production deployment boundary. Use a stable controlled HTTPS hostname for shared or production validation. Never commit tunnel credentials or a transient tunnel URL.

## Vona host and instance resolution

The PayPal public origin and Vona instance host resolution are related but distinct settings:

- `SERVER_SERVE_PROTOCOL=https` describes the externally visible scheme.
- `SERVER_SERVE_HOST` describes the externally visible host used for absolute URLs.
- `SERVER_SUBDOMAINOFFSET` controls how Vona interprets hostname labels when deriving an instance name.

The default offset is `2`, which treats the last two labels as the base domain:

| Host                  | Derived instance      |
| --------------------- | --------------------- |
| `cabloy.test`         | default instance `''` |
| `acme.cabloy.test`    | `acme`                |
| `eu.acme.cabloy.test` | `acme.eu`             |

A generated tunnel hostname may have a different label shape. For example, with a host shaped like `<id>.<region>.devtunnels.ms`, offset `2` derives `<region>.<id>` rather than the default instance. If that name is not configured and enabled, Vona returns `423` and logs `instance not found`.

To support a tunnel with the default instance, count the labels that should belong to the tunnel's base host and set `SERVER_SUBDOMAINOFFSET` accordingly. For a four-label Dev Tunnel hostname, that commonly means `SERVER_SUBDOMAINOFFSET=4`, but verify the actual hostname and Vona's derived instance before relying on it. Do not blindly change the offset or create an unintended tenant instance. An unknown derived name does not fall back to the default instance.

For a single-instance local test, the desired result is that the tunnel request resolves to the existing default instance `''`. If a named instance is intentional, configure and enable that exact name through the normal Vona instance configuration instead. See [Multi-Instance and Instance Resolution](../../../cabloy-docs/backend/multi-instance-and-instance-resolution.md) and [Cloudflare/Docker deployment](../../../cabloy-docs/fullstack/deploy-cloudflare-docker.md).

## Webhook setup

The provider-specific webhook route is:

```text
POST https://<public-host>/api/pay/webhook/pay-paypal:paypal/default
```

The route components are:

- `/api`: the current `SERVER_GLOBALPREFIX`;
- `pay-paypal:paypal`: the provider name;
- `default`: the configured PayPal client name.

In the PayPal Developer Dashboard, select the same environment as the credentials, choose **Webhooks**, and select **Add Webhook**:

1. Enter the exact public HTTPS URL above.
2. Select specific supported events rather than **All Events** for normal testing and rollout.
3. Save the webhook and copy its generated Webhook ID to `PAYPAL_WEBHOOK_ID`.
4. Restart/rebuild Vona and verify the endpoint with a signed Sandbox delivery or the PayPal webhook simulator.

The endpoint must receive the raw request body and PayPal transmission headers. The provider verifies the signature with the Webhook ID; a reserialized JSON body, missing headers, wrong environment, or wrong Webhook ID causes verification to fail.

### Recommended event selection

Select the precise event combination supported by the current adapter:

| Event                       | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `PAYMENT.CAPTURE.COMPLETED` | Capture completed successfully.                     |
| `PAYMENT.CAPTURE.DENIED`    | Capture denied/failed.                              |
| `PAYMENT.CAPTURE.REFUNDED`  | Capture refund notification.                        |
| `PAYMENT.REFUND.COMPLETED`  | Refund completed.                                   |
| `PAYMENT.REFUND.FAILED`     | Refund failed.                                      |
| `PAYMENT.REFUND.PENDING`    | Refund remains pending and requires reconciliation. |
| `PAYMENT.REFUND.CANCELLED`  | Refund cancelled.                                   |

The implementation treats `PAYMENT.CAPTURE.REFUNDED` and `PAYMENT.REFUND.*` as refund events. Other `PAYMENT.CAPTURE.*` events are considered only when the provider order lookup maps them to a terminal payment state. Other event families are intentionally unsupported and may receive a non-success response. **All Events** is acceptable only for temporary investigation; it can produce unsupported deliveries and unnecessary retries/log noise.

Webhook delivery is asynchronous and at-least-once. Duplicate deliveries, webhook/query races, and delayed refund events are expected; validate that receipt deduplication and durable reconciliation converge to one business outcome.

## Sandbox verification flow

1. Fetch Checkout payment methods while authenticated. PayPal appears only when the complete selected-environment configuration is valid.
2. Create an order selecting the `paypal` candidate key.
3. Start payment and verify the approval redirect comes from the selected PayPal environment.
4. Approve with the corresponding Sandbox buyer account. The browser returns through `/api/pay/payment-callback/return`; it triggers durable server capture/reconciliation but is not payment settlement itself.
5. Confirm the server creates or reuses the durable confirm operation, captures the persisted PayPal order with `Prefer: return=representation`, and reaches a provider-neutral PaymentSession terminal state. The complete representation is required to verify order, purchase-unit, capture, amount/currency, and payee facts.
6. Confirm a verified webhook is stored, one payment outbox event is dispatched, and Commerce receives exactly one payment outcome.
7. Submit provider-level full and partial refunds; confirm provider refund IDs persist and webhook/query races converge to one outcome. This validates A-Pay/PayPal reconciliation only: the A-Commerce MVP remains pre-shipment and whole-order refund only. Provider refund facts must not create a Commerce partial-refund API, state transition, stock/coupon rule, or UI path without separately approved PRD/SRS/WBS scope.
8. Repeat the exact valid return callback after the PaymentSession is terminal; it must redirect to the same trusted continuation path without another capture or a `409` response. Repeat a webhook delivery to verify idempotency.
9. If a refund first reports pending, verify its linked `payProviderOperation` enters `reconciliation_required` and is resolved by durable refund query reconciliation or by a verified terminal refund webhook.

Mock remains the preferred provider for ordinary development and deterministic CI. Real Sandbox testing should be an explicit integration validation with isolated test resources and cleanup.

## Troubleshooting and other operational notes

| Symptom                                                     | Checks                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PayPal is unavailable in Checkout                           | Confirm all required PayPal values are present, non-empty, and from one environment; restart/rebuild after changes.                                                                                                                                                                                                                                    |
| Approval URL uses the wrong PayPal site                     | Check `PAYPAL_ENVIRONMENT` and that the app credentials belong to that environment.                                                                                                                                                                                                                                                                    |
| Callback URL contains `localhost` or an old tunnel host     | Check `SERVER_SERVE_PROTOCOL`, `SERVER_SERVE_HOST`, env precedence, and the active generated runtime metadata; restart Vona.                                                                                                                                                                                                                           |
| Tunnel request returns `423` and `instance not found`       | Inspect the hostname label shape and `SERVER_SUBDOMAINOFFSET`; ensure the derived instance is the existing default or an explicitly configured enabled instance.                                                                                                                                                                                       |
| Webhook signature verification fails                        | Check HTTPS reachability, raw-body preservation, PayPal transmission headers, Webhook ID, credentials, and environment pairing.                                                                                                                                                                                                                        |
| Merchant/reference conflict                                 | Confirm `PAYPAL_MERCHANT_REFERENCE` is the receiving merchant/payee ID for the selected environment, not the application Client ID.                                                                                                                                                                                                                    |
| Unsupported webhook responses or retries                    | Narrow the Dashboard subscription to the supported capture/refund events above.                                                                                                                                                                                                                                                                        |
| Return redirects to Login or cannot load the continuation   | Distinguish a missing/expired authentication token from a missing browser Passport projection or a private API started during SSR. Verify browser Passport recovery and the return page's post-hydration neutral-shell boundary; see [Zova SSR Payment Return and Passport Recovery](../../architecture/zova-ssr-payment-return-passport-recovery.md). |
| Return reaches Commerce but **Continue to payment** remains | Inspect the linked `payProviderOperation` (especially `confirm`/`query`), its state and redacted `errorSummary`, then PaymentSession, outbox, Commerce attempt, and order state. Do not reopen the consumed PayPal approval URL or manually mark the order paid.                                                                                       |
| Duplicate webhook or callback effects                       | Check webhook receipt deduplication, PaymentSession state, provider operation state, and outbox delivery rather than manually applying Commerce transitions.                                                                                                                                                                                           |
| Pending refund remains unresolved                           | Inspect `payProviderOperation` in `reconciliation_required`, its next attempt, provider refund ID, and query/reconciliation logs.                                                                                                                                                                                                                      |

Rotate credentials if they were exposed, and replace the corresponding PayPal webhook when its URL or environment changes. Do not put secrets in Git history, issue comments, screenshots, frontend bundles, generated documentation, or this runbook.

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
