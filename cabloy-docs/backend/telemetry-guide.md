# Telemetry Guide

Vona can export backend distributed traces through the optional `a-telemetry` module. It is disabled by default and keeps Winston as the application logging API.

## Enable tracing

Configure the following deployment environment variables:

```ini
TELEMETRY_ENABLED=true
TELEMETRY_SERVICE_NAME=cabloy-basic
TELEMETRY_OTLP_HTTP_URL=https://collector.example.com/v1/traces
TELEMETRY_OTLP_HTTP_HEADERS=authorization=Bearer%20token
TELEMETRY_SAMPLING_ROOT_RATIO=0.1
```

The module exports traces through OTLP/HTTP protobuf. Use an OpenTelemetry Collector as the stable integration boundary; the Collector may export to Tempo, Jaeger, or a managed observability platform.

`TELEMETRY_SAMPLING_ROOT_RATIO` is the root sampling ratio. Begin with a low value such as `0.01` to `0.1`, then increase only after measuring exporter drops, CPU, memory, and trace volume.

## Propagation

The module uses W3C Trace Context:

- inbound HTTP extracts `traceparent` and `tracestate`
- outgoing queue jobs and Redis Broadcast messages carry a versioned technical trace carrier
- queue and Broadcast consumers create child spans in a new Vona context
- internal `performAction(...)` calls create an internal child span

Vona emits `x-request-id` for HTTP requests. It is a request diagnostic identifier and is different from OpenTelemetry `trace_id` and `span_id`.

Existing domain `correlationId` values remain business or idempotency identifiers. Do not replace them with trace IDs or automatically attach raw business IDs to span attributes.

## Logging correlation

When an active telemetry span is present, existing Vona log entries receive these technical fields:

```text
request_id
trace_id
span_id
trace_flags
```

Continue to use `$logger` and `$loggerChild(...)`. Do not create request-specific cached loggers.

## Privacy and cardinality

The built-in spans use HTTP method, route templates, status codes, module/controller/action names, queue names, Broadcast names, and retry counts. They do not record request or response bodies, cookies, authorization headers, raw query values, user IDs, tenant names, or business document IDs.

Only add business attributes after an explicit privacy, tenancy, cardinality, and retention review. Prefer bounded operation categories over opaque identifiers.

## Operations

Every Vona worker owns and flushes its own exporter. Export failures and shutdown timeouts must not fail user requests. Configure Collector-side tail sampling for error or slow-trace retention instead of trying to force sampling in application code.

Browser telemetry, WebSocket message tracing, database instrumentation, and third-party SDK instrumentation are intentionally separate follow-up work.
