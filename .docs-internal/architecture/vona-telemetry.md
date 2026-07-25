# Vona Telemetry Architecture

`a-telemetry` owns OpenTelemetry provider lifecycle, W3C propagation, bounded OTLP export, and trace correlation for Vona runtime boundaries. It does not replace Vona's `VonaAsyncLocalStorage`; Vona owns request and bean lifecycle while OTel owns active span context.

The initial scope is HTTP server spans, log correlation, internal `performAction`, BullMQ queue producer/consumer spans, and Redis Broadcast producer/consumer spans. The module is disabled by default.

## Context rules

- `request_id` is a diagnostic request identifier.
- `trace_id` and `span_id` identify the technical distributed execution graph.
- Domain `correlationId` remains a business/idempotency contract.
- Only W3C `traceparent` and `tracestate` cross queue and Broadcast boundaries. They are versioned technical envelope fields, never business `x-vona-data-*` headers.

## Safety rules

- Span names use route templates, queue names, Broadcast names, and action names; never literal resource paths or raw URLs with query parameters.
- Request/response bodies, cookies, authorization, raw query values, identities, tenant names, and business identifiers are excluded by default.
- Export failure, full exporter queues, and shutdown timeout must not fail requests or workers.
- Each Vona worker initializes and flushes its own provider. Collector-side tail sampling retains slow or error traces.

## Deployment and configuration

Production traffic flows through an internal OpenTelemetry Collector rather than directly to the tracing storage backend:

```text
Vona application -- OTLP/HTTP(S) --> OpenTelemetry Collector --> tracing backend
```

- Use an HTTPS OTLP endpoint outside local development. The application-to-Collector connection carries operational metadata, including routes, timing, service identity, and trace identifiers, and must not cross an untrusted network in plaintext.
- Inject `TELEMETRY_OTLP_HTTP_URL` and `TELEMETRY_OTLP_HTTP_HEADERS` through the deployment platform. Authentication values such as bearer tokens or API keys belong in its secret store, never in committed environment files, Helm values, images, logs, or documentation examples.
- Restrict Collector OTLP receiver access to trusted workloads or networks. This prevents untrusted clients from injecting trace traffic, exhausting telemetry capacity, or contaminating trace data.
- Keep non-production and production telemetry isolated through separate Collectors, tenants, namespaces, or storage datasets. Their retention and access policies may differ.
- Treat the OTLP header parser as a deployment convenience, not a secret-management system. Values must be supplied by the runtime environment.

## Sampling and ingress trust

Root sampling limits the creation and export of new traces. It is configured with `TELEMETRY_SAMPLING_ROOT_RATIO`; for example, `0.01` targets approximately one percent of root requests. Actual trace volume also depends on the average number of spans per sampled trace:

```text
spans per second ≈ root requests per second × root sampling ratio × average spans per trace
```

Start with a low rate in non-production and production canaries. Raising the application exporter queue size is not the primary response to dropped spans: it can exchange loss for application memory pressure. Prefer reducing sampling, diagnosing Collector/network/backend throughput, and scaling the telemetry pipeline before increasing local buffering.

The intended policy is that a trusted internal ingress may retain an upstream sampling decision, while a public or otherwise untrusted ingress must not use a caller-supplied `traceparent` to force this service to sample. This policy is not yet enforced by the initial implementation. Until it is, do not treat public ingress as trusted; remove or replace inbound `traceparent` and `tracestate` at the edge, or keep tracing restricted to controlled internal traffic.

## Privacy contract

The initial attribute allowlist is limited to stable technical metadata such as HTTP method, route template, response status, controller/action, service/environment identity, queue or Broadcast name, retry count, and trace identifiers.

The following are prohibited by default and require a separate reviewed design before collection:

- request or response bodies;
- cookies and authorization headers;
- raw query-string values or literal resource URLs;
- database values;
- user IDs, emails, usernames, tenant names, and opaque business identifiers;
- arbitrary `extraData`, business objects, or serialized errors.

Use route templates such as `/orders/:id`, never a literal path or URL carrying identifiers. A code review that adds span attributes must verify both the privacy classification and cardinality of every new field.

## Rollout procedure

Enable tracing progressively; do not start with every instance and full sampling.

1. **Non-production verification:** Enable one percent root sampling against an isolated Collector. Verify HTTP, `performAction`, queue, Broadcast, log-correlation, exception, and shutdown behavior. Inspect actual stored attributes for privacy violations, not only the source code.
2. **Production canary:** Enable telemetry on one production instance or another tightly bounded traffic slice at one percent root sampling. Validate TLS, authentication, Collector reachability, exporter failures, and instance resource overhead.
3. **Coverage expansion:** Increase the enabled instance proportion while keeping the sampling rate unchanged. This reveals configuration drift and multi-instance Collector capacity issues without multiplying two variables at once.
4. **Sampling expansion:** After stable full-instance coverage, increase sampling one bounded step at a time, for example `1%` to `5%` to `10%`. Retain an observation window after every change.

Only change one rollout variable at a time. Do not combine a Collector upgrade, exporter tuning, traffic migration, and a sampling increase in one release window; doing so makes regressions difficult to attribute.

The immediate rollback must be simple: disable telemetry with `TELEMETRY_ENABLED=false`, or reduce root sampling to zero when configuration propagation is faster. Telemetry failure must not block request handling, queue workers, Broadcast handlers, or process termination.

## Operational signals

Compare a canary with an equivalent non-telemetry baseline under similar traffic. Monitor:

| Area            | Signals                                                                | Why it matters                                                                                               |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Application     | CPU, RSS/heap, GC activity, event-loop delay                           | Span creation, attribute handling, batch buffering, and serialization consume process resources.             |
| Request quality | business error rate and request P50/P95/P99                            | Average latency can hide rare exporter, GC, or queue-pressure stalls; tail latency is the release guardrail. |
| Exporter        | queue utilization, export latency, retry/failure count, dropped spans  | Indicates whether the application can hand spans to the Collector within the configured bounds.              |
| Collector       | accepted/refused/dropped spans, receiver/exporter latency, CPU, memory | Separates application-side loss from network, authentication, pipeline, or downstream-backend capacity.      |
| Lifecycle       | process shutdown duration and `telemetry.shutdown_failed` events       | Ensures flush is bounded and releases/restarts do not hang.                                                  |

A rise in exporter drops is a capacity signal, not a reason to make business requests wait. Reduce sampling first, then investigate Collector/network/backend capacity and scale the telemetry pipeline if needed.

## Incident runbook

| Condition                                            | Initial response                                                                                                                 | Follow-up                                                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Collector unreachable or export failures             | Confirm DNS, TLS certificate chain, network policy, endpoint, and secret-injected authentication. Keep business traffic running. | Reduce sampling or disable telemetry if failures create resource pressure; repair the pipeline before restoring volume.                |
| Exporter queue pressure or dropped spans             | Reduce sampling immediately.                                                                                                     | Check Collector acceptance/drops, network latency, downstream storage ingest, and capacity before raising queue limits.                |
| CPU, memory, event-loop delay, or P95/P99 regression | Disable telemetry on the affected canary or set sampling to zero; compare with the baseline.                                     | Inspect span rate, attribute volume, export latency, GC, and Collector behavior before another rollout attempt.                        |
| Suspected sensitive telemetry data                   | Stop or restrict export, preserve evidence according to incident policy, and rotate exposed credentials if applicable.           | Remove the offending attribute, assess stored-data access and retention, purge where supported, and add a regression test/review rule. |
| Slow shutdown or flush timeout                       | Preserve the bounded shutdown behavior; do not block deployment indefinitely for telemetry.                                      | Inspect Collector/exporter latency and timeout configuration; verify application lifecycle ownership before changing limits.           |

## Scope boundaries

Browser RUM, WebSocket packets, `fetch`, database/Redis auto-instrumentation, metrics, and third-party SDK instrumentation need separate design and rollout because they introduce distinct privacy, volume, or dependency-patching concerns.
