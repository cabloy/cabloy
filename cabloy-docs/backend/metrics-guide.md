# Metrics Guide

Cabloy Metrics uses OpenTelemetry Metrics (OTLP/HTTP) and is disabled by default. It does not publish an application `/metrics` endpoint. A Vona application normally has several independent workers, so an in-memory Prometheus registry on the shared application port would expose only one worker per scrape.

## Architecture

```text
Vona workers -> private OpenTelemetry Collector -> Prometheus exporter -> Prometheus
```

Each worker exports its own metric stream. Preserve `service.instance.id` during ingestion and aggregate workers in PromQL with `sum`, `rate`, and `histogram_quantile` as appropriate.

Prometheus must scrape the Collector exporter on a private monitoring network. Do not route Collector OTLP or Prometheus exporter ports through Cloudflare or a public Nginx listener.

## Enablement

Inject configuration through the deployment platform. Do not commit credentials to environment files.

```text
METRICS_ENABLED=true
METRICS_SERVICE_NAME=cabloy
METRICS_OTLP_HTTP_URL=https://collector.internal/v1/metrics
METRICS_OTLP_HTTP_HEADERS=Authorization=Bearer <secret>
```

Additional bounded settings are available:

- `METRICS_EXPORT_INTERVAL_MS` — export cadence, default `15000`
- `METRICS_EXPORT_TIMEOUT_MS` — one export timeout, default `10000`
- `METRICS_RUNTIME_INTERVAL_MS` — process/runtime snapshot cadence, default `15000`
- `METRICS_QUEUE_INTERVAL_MS` — reserved queue collection cadence, default `30000`
- `METRICS_SNAPSHOT_CACHE_MS` — Admin snapshot cache lifetime, default `5000`
- `METRICS_SHUTDOWN_TIMEOUT_MS` — bounded final flush time, default `4000`

Invalid numeric values are clamped to safe ranges. Disabling Metrics creates no exporter or background sampler.

## Initial metric families

- HTTP request count, duration histogram, and active-request count
- process uptime, RSS, heap, external memory, event-loop delay, and active Vona contexts
- metrics observation failure counters

HTTP labels are deliberately restricted to normalized method, route template, final status, and a bounded aborted marker. Literal URLs, query strings, hosts, tenant/instance names, users, request IDs, trace IDs, cookies, authorization values, Redis keys, queue job IDs, and job payloads are prohibited.

HTTP duration buckets in seconds are fixed as:

```text
0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30
```

## Health probes

Use these private infrastructure endpoints:

| Endpoint              | Meaning                                                   |
| --------------------- | --------------------------------------------------------- |
| `GET /health/startup` | Vona startup completed                                    |
| `GET /health/live`    | process is serving and not closing                        |
| `GET /health/ready`   | startup complete plus bounded PostgreSQL and Redis checks |

They return only a small status response. Collector and queue-observation failures never make the readiness probe fail.

## Admin dashboard

The Basic Admin **Metrics** page is available only to `systemAdmin`. It shows a redacted, short-lived runtime snapshot and clear `disabled`, `fresh`, `stale`, or `unavailable` states. It is not a Prometheus query UI and never sends browser traffic to OTLP, Collector, or probe endpoints.

## Local example

A loopback-only local stack is available under the repository's `observability/README.md`:

```bash
docker compose -f observability/docker-compose.metrics.yml up
```

Use it for local validation only. Production networking, TLS/mTLS, secret injection, retention, dashboards, and alert routing are operator-owned.
