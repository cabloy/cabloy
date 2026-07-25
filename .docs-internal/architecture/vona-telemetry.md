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

## Scope boundaries

Browser RUM, WebSocket packets, `fetch`, database/Redis auto-instrumentation, metrics, and third-party SDK instrumentation need separate design and rollout because they introduce distinct privacy, volume, or dependency-patching concerns.
