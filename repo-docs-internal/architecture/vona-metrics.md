# Vona Metrics Architecture

## Decision

Metrics is a dedicated `a-metrics` infrastructure module. It uses OpenTelemetry Metrics and OTLP/HTTP to a private OpenTelemetry Collector. Prometheus scrapes the Collector exporter; Vona has no `/metrics` application endpoint.

## Metrics and tracing independence

`a-metrics` and `a-telemetry` are separate infrastructure modules with separate providers, exporters, configuration, lifecycle ownership, and failure boundaries. Their signals can be enabled in any combination:

| `TELEMETRY_ENABLED` | `METRICS_ENABLED` | Result                                                                                           |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `false`             | `false`           | Neither tracing nor metrics work is created.                                                     |
| `true`              | `false`           | Tracing exports spans without creating Metrics instruments, timers, or an OTLP Metrics exporter. |
| `false`             | `true`            | Metrics exports operational signals without creating spans or requiring trace context.           |
| `true`              | `true`            | Both signal pipelines run independently for the same request lifecycle.                          |

Do not add `a-telemetry` as an `a-metrics` module dependency and do not make `a-metrics:metrics` depend on `a-telemetry:trace`. HTTP Metrics only requires the Vona request lifecycle, route metadata, and final response state; it must not require a trace provider or a trace context. Middleware enumeration order is not a coupling contract between these modules.

The Metrics middleware must exclude infrastructure probes directly from `ctx.path` before starting an observation. Do not use a resolved route as the only health-path exclusion: infrastructure middleware can respond before normal router resolution, in which case the route is absent and would be mislabelled as `unmatched`.

If a future cross-signal feature is genuinely needed, keep it optional and one-way through a narrow, privacy-reviewed interface. It must preserve the ability to enable either module alone and must never turn trace IDs, request IDs, or other correlation data into metric attributes.

## Why not an application Prometheus registry

Vona cluster workers have isolated memory. A shared application listener distributes a scrape to one arbitrary worker, so an in-process pull registry is not an application aggregate. Master-process IPC, extra worker ports, and Redis aggregation add framework-specific failure modes that the Collector already addresses.

Every worker exports a distinct resource stream. Collector/PromQL aggregation is explicit, while worker identity remains available for restart, imbalance, and resource diagnosis.

## Safety contract

- Metrics are disabled by default and exporter failures never affect business work.
- Instrument creation is once per worker; HTTP middleware performs no I/O or allocation-heavy collection.
- The metric catalogue owns names, units, labels, cardinality limits, and histogram buckets. New metrics require privacy, tenancy, and cardinality review.
- Tenant/instance names, identities, raw URLs, query values, correlation IDs, job payloads, Redis keys, database values, credentials, and arbitrary errors are not metric labels.
- Health paths are infrastructure endpoints. They must not create a tenant context, invoke passport handling, or disclose dependency details.

## Admin boundary

`basic-metrics` owns the authenticated system-admin dashboard API and Zova page. It reads a bounded facade from `a-metrics`; it is not an alerting interface or a browser bridge to Collector/Prometheus.

## Queue follow-up

Shared BullMQ gauges require an `a-election` leader lease across every worker/pod sharing the queue Redis namespace. The first implementation exposes an explicit empty queue section until that collector, bounded aggregate API use, timeout policy, and leader-handoff test are added. Do not solve this by scanning Redis keys or emitting tenant partitions.

## Rollout

1. Verify a local Collector and one worker.
2. Verify multiple workers preserve distinct series and aggregate correctly.
3. Canary Metrics in non-production, then one production workload slice.
4. Compare P95/P99, CPU, heap/RSS, and event-loop delay against Metrics-off baseline.
5. Add queue gauges only after exporter and Collector capacity are stable.

Rollback is `METRICS_ENABLED=false`.
