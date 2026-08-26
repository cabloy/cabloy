# Stripe Sandbox Commerce Runbook

## Scope

This runbook is an internal reference for validating the `pay-stripe` Hosted Checkout path in the A-Commerce suite. It covers Stripe Sandbox only. It does not authorize Stripe Live credentials, production payment traffic, or a live rollout.

The payment ownership boundary remains:

```text
commerce-trade -> commerce-payment -> a-pay <- pay-stripe
```

Stripe provider code translates Stripe API and webhook facts into provider-neutral payment and refund snapshots. Commerce settlement remains server-owned and is driven by verified, correlated provider facts; a browser return URL must never be treated as proof of payment.

## Required server configuration

Inject these values through the Vona server environment or deployment secret store. Do not put Stripe credentials in Zova/frontend environment files or commit them to Git.

```dotenv
STRIPE_ENVIRONMENT = sandbox
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_MERCHANT_REFERENCE = stripe-sandbox
SERVER_SERVE_PROTOCOL = https
SERVER_SERVE_HOST = <public-domain>
SERVER_SUBDOMAINOFFSET = <domain-parts-count>
```

`STRIPE_MERCHANT_REFERENCE` is an optional deployment or merchant label used to distinguish the configured Stripe client. It is not a replacement for either secret.

The minimum Stripe availability requirements are:

- `STRIPE_ENVIRONMENT` is `sandbox`;
- `STRIPE_SECRET_KEY` is a Stripe Sandbox secret key (`sk_test_...`);
- `STRIPE_WEBHOOK_SECRET` belongs to the same Stripe Sandbox webhook endpoint (`whsec_...`);
- `SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` form a trusted public HTTPS origin.

Restart Vona after changing these values. Stripe credentials and webhook secrets must remain server-side.

### Public host and subdomain offset

Stripe Hosted Checkout return URLs and webhook URLs are generated from the trusted server origin. The host must be reachable from the public Internet over HTTPS; `localhost` alone is not sufficient for Stripe webhook delivery. An authorized HTTPS tunnel, such as a company-approved dev tunnel, may be used for local Sandbox testing.

Set `SERVER_SERVE_HOST` to the complete public hostname and set `SERVER_SUBDOMAINOFFSET` to the number of dot-separated domain parts in that hostname. For example:

```dotenv
SERVER_SERVE_HOST = xxx.asse.devtunnels.ms
SERVER_SUBDOMAINOFFSET = 4
```

The four parts are `xxx`, `asse`, `devtunnels`, and `ms`. This lets Vona map the hostname to the default instance correctly. Recalculate the value when the tunnel or domain changes; do not copy the default value blindly.

Use the same host consistently for the generated return URL and the registered webhook endpoint. Do not allow a browser-supplied `Host`, `Origin`, or arbitrary return URL to replace this trusted configuration.

## Stripe Dashboard setup

1. Open the [Stripe Dashboard](https://dashboard.stripe.com/) and switch to the intended **Sandbox** environment. Keep Sandbox and Live projects/credentials separate.
2. In **Developers → API keys**, copy the Sandbox **Secret key** (`sk_test_...`). Never use a publishable key (`pk_test_...`) as `STRIPE_SECRET_KEY`.
3. In **Developers → Webhooks**, add an endpoint using:

   ```text
   POST https://<public-domain>/api/pay/webhook/pay-stripe:stripe/default
   ```

4. Select the event families needed for the validation flow. At minimum, cover the Checkout Session and PaymentIntent terminal events used by the adapter:

   ```text
   checkout.session.completed
   checkout.session.async_payment_failed
   payment_intent.succeeded
   payment_intent.payment_failed
   ```

   For refund validation, also subscribe to the available Stripe refund lifecycle events required by the Sandbox account, such as `refund.created`, `refund.updated`, and `refund.failed`. Do not assume every unrelated Stripe event is supported by the adapter.

5. Reveal the endpoint's signing secret and set that value as `STRIPE_WEBHOOK_SECRET`. The signing secret must come from this exact endpoint and the same Sandbox environment.
6. Verify that Stripe can reach the endpoint over HTTPS before starting checkout validation.

## Local configuration location

For a local, uncommitted setup, use:

```text
vona/env/.env.local
```

Keep the repository template `vona/env/.env` free of credentials. A representative local configuration is:

```dotenv
STRIPE_ENVIRONMENT = sandbox
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_MERCHANT_REFERENCE = stripe-sandbox
SERVER_SERVE_PROTOCOL = https
SERVER_SERVE_HOST = xxx.asse.devtunnels.ms
SERVER_SUBDOMAINOFFSET = 4
```

Never paste real key values into this document, source code, tests, screenshots, issue comments, or commits. If a secret is accidentally exposed, revoke and replace it in Stripe immediately.

## Verification procedure

1. Start or restart Vona with the local server configuration.
2. While authenticated, load the Commerce payment-method projection. Stripe should appear only when its complete Sandbox configuration and trusted origin are valid.
3. Create a USD Commerce order and select the Stripe candidate.
4. Start payment and verify that the browser is redirected to Stripe Hosted Checkout.
5. Complete the checkout with a Stripe test payment method, then follow the configured return path.
6. Verify in Vona that the persisted `PaymentSession` reaches the provider-neutral terminal state and that Commerce receives exactly one payment outcome.
7. In Stripe Dashboard, inspect the webhook delivery and confirm signature verification succeeds.
8. Redeliver the same webhook and repeat the browser return. Confirm that replay and return/webhook races do not duplicate payment settlement, audit, inventory, coupon, or outbox effects.
9. Exercise a full refund and a partial refund. Confirm the provider refund ID is persisted and repeated refund webhook/query delivery converges to one refund outcome.
10. Exercise a failed or indeterminate refund response where the test gateway supports it. Confirm the operation remains recoverable and is not treated as a successful refund without verified provider evidence.

For ordinary Sandbox card testing, Stripe's standard successful test card is `4242 4242 4242 4242`, with any future expiry date, any three-digit CVC, and a valid postal code. Use only Stripe-provided test payment methods while the Dashboard is in Sandbox mode.

## Troubleshooting checklist

If Stripe does not appear as a payment method, check:

- the backend has `sk_test_...`, not `pk_test_...`;
- the webhook signing secret belongs to the same endpoint and Sandbox environment;
- Vona was restarted after environment changes;
- the public host resolves and serves HTTPS;
- `SERVER_SUBDOMAINOFFSET` equals the number of dot-separated parts in `SERVER_SERVE_HOST`;
- the configured host is not stale after changing a tunnel;
- secrets were configured in Vona rather than Zova.

If the browser returns successfully but the Commerce order is not settled, inspect the persisted payment session, provider operation, webhook receipt/inbox, outbox, and redacted error summary. Do not manually mark the order paid and do not trust the browser return as settlement authority.

## Safety and rollout boundary

- Keep Mock as the default for ordinary development and deterministic CI.
- Use Stripe Sandbox only for an explicitly scoped validation cohort.
- Do not set `STRIPE_ENVIRONMENT = live` or use `sk_live_...` without a separate Live rollout review.
- Do not reuse Sandbox webhook secrets or endpoints for Live.
- Do not commit secrets, tunnel credentials, or real customer/payment data.
- Revoke temporary Sandbox credentials and remove obsolete tunnel configuration after the validation window.

## Related records

- [A-Pay Payment Architecture](../../repo-docs-internal/architecture/a-pay-payment-architecture.md)
- [PayPal Sandbox Commerce Runbook](./paypal-sandbox-runbook.md)
- [A-Commerce internal index](./README.md)
