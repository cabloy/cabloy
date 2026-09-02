# Docker + Cloudflare Deployment

<Badge type="tip" text="Common" />

This guide deploys Cabloy Basic or Cabloy Start in two stages: first run the fullstack application on a cloud server with Docker Compose, then put Cloudflare orange-cloud proxying in front of that origin. It covers the Vona-integrated Zova Web and Admin SSR runtime shared by both editions.

Run all commands from the repository for the edition you are using. This guide documents the shared deployment contract; verify edition-specific flavor names, SSR site baselines, project assets, and repository details in the active edition source.

Cloudflare Pages and Cloudflare Workers are not supported deployment targets in this guide.

## Deployment model

```text
Browser
  -> Cloudflare orange cloud
  -> origin Nginx in Docker Compose
  -> Vona app with Web/Admin SSR
  -> PostgreSQL and Redis
```

The Docker Compose origin is the application deployment. Cloudflare provides DNS, edge TLS, proxying, and response caching in front of that origin.

## Stage 1: deploy the Docker origin

On the cloud server, clone and initialize the repository for your edition, then build and start its Docker flavor:

```bash
npm run init
npm run build:docker
cd vona/docker-compose
sudo COMPOSE_BAKE=true docker-compose build
sudo docker-compose up -d
```

The Compose stack contains the application, Nginx, PostgreSQL, and Redis. Treat database passwords, persistent volumes, backups, firewall rules, operating-system updates, and server hardening as production operator responsibilities.

In the repository for the edition you are using, `vona/docker-compose/` is the generated and ignored deployment directory, while `vona/docker-compose-original/` is the tracked source template. Initialization copies the template only when the generated directory does not already exist, so upgrading the repository does not automatically update an existing generated Nginx configuration. Reconcile or regenerate that local deployment configuration deliberately, and verify the current template in your edition repository.

## Local preflight with `cabloy.test`

Before using a public domain, test the same hostname model locally. Use the reserved test domain `cabloy.test`, not a public domain such as `test.com`.

Map every hostname that you want to test in the local hosts file, or use local DNS. For example:

```text
127.0.0.1 cabloy.test acme.cabloy.test eu.acme.cabloy.test
```

`SERVER_SUBDOMAINOFFSET` defaults to `2`. It treats the rightmost two labels as the base domain:

| Hostname              | Derived instance            |
| --------------------- | --------------------------- |
| `cabloy.test`         | `''` (the default instance) |
| `acme.cabloy.test`    | `acme`                      |
| `eu.acme.cabloy.test` | `acme.eu`                   |

The default instance is an explicitly configured empty-name instance. It can be disabled or removed. Each non-empty derived instance name must also be explicitly configured and enabled before its hostname can serve application traffic. A missing, disabled, or deleted named instance does not fall back to the default instance.

The Docker Nginx template preserves both the incoming `Host` and `X-Forwarded-Host`. This is necessary because Vona uses the forwarded host for host-sensitive URLs and subdomain instance resolution. Test through Nginx, not only by calling the app container directly.

For the instance configuration shape and full resolution order, see [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).

## Origin HTTPS prerequisite

Cloudflare TLS has two separate connections:

```text
Visitor <-> Cloudflare edge
Cloudflare <-> origin Nginx
```

The shared Docker origin baseline listens on port 80 only. Verify the current Nginx template in your edition repository. Before enabling Cloudflare **Full (strict)**, provide a separately managed TLS-capable origin layer and a valid certificate that matches the origin hostname. For example, this can be an Nginx or ingress configuration managed by the deployment environment.

Use Cloudflare **Full (strict)** for the production connection to the origin. Do not use Flexible mode: it leaves the Cloudflare-to-origin connection unencrypted and can produce incorrect scheme and security behavior. Enabling the orange cloud alone does not add HTTPS to the origin.

For current Cloudflare requirements, see [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

## Stage 2: put Cloudflare in front of the origin

After the origin is reachable with its TLS configuration:

1. Create the DNS record for the base hostname, such as `example.com`, pointing to the origin server.
2. Enable the record's orange-cloud proxy status.
3. If subdomain instance routing is required, add the required instance records or a suitable wildcard record, such as `*.example.com`.
4. Keep the origin proxy configuration forwarding the original `Host` and `X-Forwarded-Host` values to Vona.
5. Set the deployment environment to the public URL when it must produce canonical absolute URLs:

   ```dotenv
   SERVER_SERVE_PROTOCOL=https
   SERVER_SERVE_HOST=example.com
   SERVER_SUBDOMAINOFFSET=2
   CORS_WHITE_LIST=https://app.example.com
   ```

`SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` define the backend's canonical public origin; they do not automatically authorize a separately hosted browser frontend. When the frontend or another browser consumer uses a different origin, set `CORS_WHITE_LIST` to explicit comma-separated origins, as shown above. Keep this list limited to the origins that require browser access; do not use a wildcard as the production default. The normal CORS allowlist is also used by the built-in WebSocket origin check, while account credential-link flows require exact normalized HTTP(S) origins.

The base hostname resolves to the empty-name/default instance. For example, `acme.example.com` resolves to `acme`; a deeper hostname such as `eu.acme.example.com` resolves to `acme.eu` and requires that explicitly configured instance.

For current Cloudflare proxy-record behavior, see [Proxied DNS records](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/).

## Cloudflare Cache Rule

Configure one Cache Rule for the SSR origin:

1. **If incoming requests match:** All incoming requests.
2. **Cache eligibility:** Eligible for cache.
3. **Edge TTL:** Use the origin `Cache-Control` header when present; bypass cache when it is absent.

Do not add another Cache Rule or response-header override that replaces the origin `Cache-Control` value for these routes.

This rule is intentionally small. It makes a response eligible for caching but still lets the SSR response header decide whether Cloudflare stores it. A `no-store` response remains non-cacheable, and normal Cloudflare cacheability safeguards still apply.

For current Cache Rule settings, see [Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/).

## SSR cache contract

Zova SSR writes the public response-cache contract during rendering from the resolved profile, route locale metadata, and any public route-level `meta.ssrProfileOptions.responseCache` override. The effective SSR profile is authoritative: a `session` response always sets `Cache-Control: private, no-store` before route or profile response-cache policy is considered.

For a public route, the default response header depends on whether the URL identifies locale:

| Route condition                | Default SSR response header                                              | Cloudflare result with this rule  |
| ------------------------------ | ------------------------------------------------------------------------ | --------------------------------- |
| `meta.locale: true`            | `Cache-Control: public, max-age=600` using the Basic Web profile default | Eligible to cache for ten minutes |
| missing or false `meta.locale` | `Cache-Control: no-cache, no-store, must-revalidate`                     | Not stored                        |
| `session` profile              | `Cache-Control: private, no-store`                                       | Not stored                        |

For Cabloy Start, verify the effective Web and Admin values in the active Start repository before creating the Cloudflare rule. The rule design remains the same: preserve and follow the origin `Cache-Control` response instead of replacing it.

A route can override the flavor default through SSR route metadata. An explicit public `meta.ssrProfileOptions.responseCache` policy remains authoritative; the Cloudflare rule follows the resulting response contract and does not replace it.

For the public Basic environment-variable details, see [SSR Environment Variables](/frontend/ssr-env).

## Deployment checks

After the origin is running, verify the following before relying on Cloudflare traffic:

1. The base hostname returns the expected default instance.
2. Each configured subdomain resolves to its expected enabled instance.
3. Nginx forwards the browser hostname instead of the literal value `localhost`.
4. Web SSR returns the `Cache-Control` header expected from the active edition, route metadata, and flavor configuration: locale-aware public routes use the configured public cache default, while public routes without `meta.locale: true` use `no-cache, no-store, must-revalidate` unless they have an explicit cache override.
5. Admin SSR returns the `Cache-Control` header expected from the active edition and flavor configuration. In the current Basic baseline, it is `private, no-store`.
6. After Cloudflare proxying is enabled, only responses whose origin policy permits public caching are cached at the edge; responses marked `no-store` are not stored.
