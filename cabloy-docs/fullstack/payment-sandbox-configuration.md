# Payment Provider Sandbox Configuration

This guide explains how to validate the current PayPal and Stripe payment providers in a Cabloy Basic Sandbox environment.

Use it after understanding the architecture in [A-Pay Payment Suite](/fullstack/a-pay-payment-suite). It covers safe, reproducible configuration and validation with placeholders. It does **not** authorize Live payment traffic, replace provider compliance requirements, or include real account values, secrets, deployment-specific paths, tunnel commands, or internal operational diagnostics.

## What Sandbox validation proves

A complete Sandbox validation proves the server can:

1. expose a configured provider as a Commerce payment method;
2. create a provider-neutral payment session;
3. redirect the customer to a provider Sandbox flow;
4. receive a provider callback and verified webhook;
5. persist the normalized payment result;
6. deliver one durable outcome to Commerce; and
7. settle the order idempotently.

It does **not** prove that Live credentials, a Live webhook endpoint, or production operations are approved. Keep Sandbox and Live provider accounts, credentials, webhook endpoints, and merchant references separate.

## Security boundary

Provider credentials and webhook material are backend-only configuration. Store them in the Vona server environment or deployment secret store. For an uncommitted local setup, use the backend local override:

```text
vona/env/.env.local
```

Never put provider credentials or private merchant configuration in:

- Zova or other frontend environment files;
- generated API contracts or frontend state;
- source code, commits, screenshots, issue comments, or public logs.

A browser redirect, callback, or success screen is **not** payment settlement authority. Settlement requires verified provider facts, correlation with the persisted payment session, durable state changes, and idempotent Commerce outcome handling.

## Shared server configuration

Both providers need a canonical, externally reachable HTTPS origin. A provider must be able to reach the webhook endpoint from the public Internet, so `localhost`, a private address, or an unreachable host is insufficient. An approved HTTPS tunnel can forward a public hostname to a local Vona process during Sandbox work.

```dotenv
SERVER_SERVE_PROTOCOL=https
SERVER_SERVE_HOST=<public-https-host>
SERVER_SUBDOMAINOFFSET=<domain-parts-count>
```

`SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` are the canonical external origin used to generate provider callback URLs. They are distinct from the hostname and port on which the Vona process listens.

Use the same public hostname for:

- `SERVER_SERVE_HOST`;
- generated provider callback URLs;
- the provider Dashboard webhook endpoint.

Restart Vona after changing server or provider environment values.

### Map the public host to the intended instance

`SERVER_SUBDOMAINOFFSET` controls how Vona derives an instance name from the incoming hostname. This matters for provider callbacks and webhooks because they arrive through the public host, not the browser's local development address.

With an offset of `2`, an ordinary two-label base domain works as follows:

```text
example.com            -> default instance ''
merchant.example.com   -> named instance 'merchant'
eu.merchant.example.com -> named instance 'merchant.eu'
```

The default instance is explicitly named `''`; an unknown hostname-derived instance does not silently fall back to it. Unknown, unavailable, or disabled instances can produce HTTP `423` before the provider webhook reaches A-Pay.

For a public hostname whose **complete** label sequence should resolve to the default instance, set `SERVER_SUBDOMAINOFFSET` to the number of labels in that complete hostname. For example, a generic four-label tunnel shape such as:

```text
<id>.<region>.devtunnels.ms
```

may need:

```dotenv
SERVER_SUBDOMAINOFFSET=4
```

Do not copy that value blindly. Count the actual hostname labels and recalculate the offset whenever the public hostname changes. If the remaining labels intentionally represent a named instance, use the base-domain label count instead and ensure that derived instance exists and is enabled.

Read [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution) for the full host-to-instance model and [Docker + Cloudflare Deployment](/fullstack/deploy-cloudflare-docker) for public-origin deployment context.

## Callback and webhook URLs

For redirect-capable providers, A-Pay generates callback URLs from the trusted server origin. The current callback paths are:

```text
GET /api/pay/payment-callback/return?state=<opaque-token>
GET /api/pay/payment-callback/cancel?state=<opaque-token>
```

The `state` value is a short-lived signed server token. It binds the return to the payment session and a server-selected continuation. The provider and browser do not choose an arbitrary continuation URL.

The current default webhook endpoint templates are:

```text
POST https://<public-host>/api/pay/webhook/pay-paypal:paypal/default
POST https://<public-host>/api/pay/webhook/pay-stripe:stripe/default
```

Here, `pay-paypal` and `pay-stripe` are provider names, while `default` is the provider client name. `/api` is the repository's default global API prefix. If a deployment configures a different global prefix, substitute that prefix in both callback and webhook URLs.

Register the exact current public HTTPS endpoint with the provider. Do not let a browser-supplied `Host`, `Origin`, or return URL replace the configured server origin.

## PayPal Sandbox

### Backend configuration

Configure the selected PayPal Sandbox client on Vona only:

```dotenv
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_WEBHOOK_ID=xxxxx
PAYPAL_MERCHANT_REFERENCE=xxxxx
```

| Variable                    | Purpose                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `PAYPAL_ENVIRONMENT`        | Selects `sandbox` or `live`. Use `sandbox` for this guide.                                                            |
| `PAYPAL_CLIENT_ID`          | Identifies the selected PayPal REST application.                                                                      |
| `PAYPAL_CLIENT_SECRET`      | Authenticates server-side PayPal API and webhook-verification work.                                                   |
| `PAYPAL_WEBHOOK_ID`         | Identifies the registered PayPal webhook when the server asks PayPal to verify a delivery. It is not the webhook URL. |
| `PAYPAL_MERCHANT_REFERENCE` | Identifies the expected Sandbox merchant/payee for provider-fact correlation.                                         |

The values must all belong to the same PayPal Sandbox environment. The Commerce payment scene offers PayPal only when the required PayPal values and the server origin are complete.

### Dashboard setup

1. Select the PayPal **Sandbox** environment.
2. Create or select an isolated Sandbox merchant and buyer account.
3. Create or select the REST application for that Sandbox environment.
4. Copy the application's client ID and secret into the Vona backend secret source.
5. Register this endpoint in the same Sandbox environment:

   ```text
   POST https://<public-host>/api/pay/webhook/pay-paypal:paypal/default
   ```

6. Store the resulting webhook ID as `PAYPAL_WEBHOOK_ID` and configure the expected Sandbox merchant reference.
7. Subscribe only to capture and refund event types supported by the current adapter. Avoid broad unrelated event families.
8. Restart Vona and confirm the provider becomes available in the authenticated Commerce payment-method projection.

### Validate a PayPal payment

1. Create a Sandbox Commerce order and select the PayPal candidate.
2. Start payment and confirm the browser is redirected to PayPal Sandbox approval.
3. Approve using the Sandbox buyer account.
4. Let the browser return through the signed A-Pay callback; the backend captures or reconciles the persisted provider order.
5. Confirm a verified webhook receipt is processed, the `PaymentSession` reaches a normalized terminal state, and Commerce receives exactly one payment outcome.
6. Repeat the browser return and redeliver the provider webhook. The order, inventory, coupon, audit, and outbox effects must not duplicate.
7. Validate full and partial refunds where the current provider capability and business policy allow them.

## Stripe Sandbox

### Backend configuration

Configure the selected Stripe Sandbox client on Vona only:

```dotenv
STRIPE_ENVIRONMENT=sandbox
STRIPE_SECRET_KEY=xxxxx
STRIPE_WEBHOOK_SECRET=xxxxx
STRIPE_MERCHANT_REFERENCE=xxxxx
```

| Variable                    | Purpose                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `STRIPE_ENVIRONMENT`        | Selects `sandbox` or `live`. Use `sandbox` for this guide.                                                                         |
| `STRIPE_SECRET_KEY`         | Creates the server-side Stripe client for Checkout, query, and refund operations. Use a Sandbox secret key, not a publishable key. |
| `STRIPE_WEBHOOK_SECRET`     | Verifies the raw request body and `Stripe-Signature` header for the registered endpoint.                                           |
| `STRIPE_MERCHANT_REFERENCE` | Optional deployment/merchant label carried in the client configuration; it does not replace either Stripe secret.                  |

The Commerce payment scene offers Stripe only when its Sandbox secret key, endpoint signing secret, and server origin are complete.

### Dashboard setup

1. Select the Stripe **Sandbox** environment.
2. Copy a Sandbox secret key into the Vona backend secret source. Do not use a publishable key as `STRIPE_SECRET_KEY`.
3. Register this endpoint in the same Sandbox environment:

   ```text
   POST https://<public-host>/api/pay/webhook/pay-stripe:stripe/default
   ```

4. Store the signing secret from that exact endpoint as `STRIPE_WEBHOOK_SECRET`.
5. Subscribe to the Checkout, PaymentIntent, and refund lifecycle events required by the current adapter and the intended validation flow. Avoid unrelated event families.
6. Restart Vona and confirm the provider becomes available in the authenticated Commerce payment-method projection.

### Validate a Stripe payment

1. Create a Sandbox Commerce order and select the Stripe candidate.
2. Start payment and confirm the browser is redirected to Stripe Hosted Checkout.
3. Complete Checkout with a Stripe-provided Sandbox test payment method.
4. Let the browser return through the signed A-Pay callback; the backend reconciles persisted Stripe facts.
5. Confirm the endpoint receives a verified webhook, the `PaymentSession` reaches its normalized terminal state, and Commerce receives exactly one payment outcome.
6. Redeliver the webhook and repeat the browser return. Settlement and business side effects must converge to one result.
7. Validate full and partial refunds where supported, and confirm an indeterminate provider result remains recoverable rather than being treated as successful.

Use the current Stripe documentation for the appropriate Sandbox test payment methods. Do not treat any example test value as a Cabloy-specific payment requirement.

## Verify the complete flow

For either provider, use this end-to-end checklist:

1. Restart Vona after configuration changes.
2. Authenticate and load the Commerce payment-method projection.
3. Confirm the provider appears only with complete, environment-matched configuration.
4. Create a USD test order and select the provider candidate.
5. Start the payment and verify the expected provider Sandbox redirect.
6. Complete or cancel the provider flow and return to the application.
7. Confirm the server callback asks the provider to confirm or reconcile; it must not trust browser success parameters.
8. Confirm the provider dashboard records a successful webhook delivery and Vona verifies it.
9. Confirm the persisted `PaymentSession` reaches the expected provider-neutral terminal state.
10. Confirm Commerce receives one durable outcome and exposes the corresponding settled order state.
11. Redeliver the same webhook and repeat the browser return to prove idempotency and race convergence.
12. Exercise supported full and partial refunds; confirm repeated provider events and queries converge to one refund outcome.

## Troubleshooting

### The provider does not appear in Checkout

Check the following:

- All required values are configured in Vona, not Zova.
- Every key, secret, webhook identifier/signing secret, merchant reference, and selected environment belongs to the same Sandbox environment.
- Stripe uses a secret key, not a publishable key.
- `SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` are configured.
- Vona was restarted after changing the environment.
- The public hostname is current and the provider candidate remains available for the active payment scene.

### The callback or webhook reaches HTTP `423`

Treat this as an instance-resolution check first:

- Count the labels in the incoming public hostname.
- Recheck `SERVER_SUBDOMAINOFFSET`.
- Verify whether the host should map to the default instance or a named instance.
- Verify that any intended named instance exists and is enabled.
- Do not expect an unknown hostname-derived instance to fall back to the default instance.

### Webhook signature verification fails

Check the following:

- The endpoint is publicly reachable over HTTPS.
- The configured public hostname matches the registered provider endpoint.
- The provider credentials and webhook identifier/signing secret belong to the same Sandbox environment and exact endpoint.
- Vona has the current values after restart.
- The integration preserves the provider's required raw request body and signature/transmission headers.

### The browser returns, but the order is not settled

A normal browser return is not proof of payment. Inspect the durable flow in order:

1. payment session state;
2. linked provider operation state;
3. webhook receipt and signature-verification result;
4. outbox delivery state;
5. redacted provider error summary.

Do not manually mark the order paid, recreate inventory/coupon effects, or reuse a consumed provider approval URL to bypass a delayed callback or webhook.

## Relationship to other guides

- [A-Pay Payment Suite](/fullstack/a-pay-payment-suite) explains session ownership, provider-neutral contracts, settlement, and Zova consumption.
- [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution) explains how hostname labels and `SERVER_SUBDOMAINOFFSET` select an instance.
- [Docker + Cloudflare Deployment](/fullstack/deploy-cloudflare-docker) explains public HTTPS origin deployment context.
- [Vona + Zova Integration](/fullstack/vona-zova-integration) explains the fullstack contract boundary.
- [Contract Loop Playbook](/fullstack/contract-loop-playbook) explains generated backend-to-frontend contracts.

## Verification

After changing payment configuration or documentation:

```bash
npm run docs:build
```

For a real Sandbox validation, repeat provider callback and webhook deliveries deliberately. The expected result is one verified payment/refund outcome and one Commerce business effect, even when external delivery is repeated or arrives in a different order.
