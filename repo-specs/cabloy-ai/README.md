# Cabloy AI MVP

## Scope

Deliver one connected, provider-neutral AI SDK v7 capability in Cabloy Basic: code-configured scene calls and authenticated private text chat. Vona owns model configuration, execution and durable state; Zova owns the interactive page and query/stream state.

Public usage and configuration belong in the [AI Guide](../../repo-docs/backend/ai-guide.md). This record owns only the bounded delivery and acceptance scope.

## Accepted boundaries

- One backend module and one frontend module named `cabloy-ai`, each in the `cabloy-ai` suite.
- `providerFactories` are trusted executable configuration. Named `aiProviders` and `aiModels` support code defaults plus instance-local sparse database overrides/additions.
- `AiScene` identities are code-owned beans. Database rows override existing scenes; they do not register executable scenes.
- Code configuration works without corresponding database rows. Reads never materialize defaults into configuration tables.
- Provider `options.apiKey` may be supplied by server deployment configuration or persisted directly in instance-local provider overrides, in plaintext without encryption. Trusted configuration reads/writes may contain keys; chat API responses, SSR transfer, logs and execution records must not. Database and backup access must be restricted.
- Asynchronous facade creation returns a bound invocation with SDK-compatible `generateText` and `streamText` semantics.
- Private conversations, messages, runs and usage share the current instance boundary and explicit user ownership.
- One active turn per conversation, durable request-key deduplication, short atomic prepare/finalize boundaries, finite execution deadlines and transport cancellation. Local persistence is idempotent; provider billing is not claimed exactly-once.
- One authenticated session-SSR chat page. No management pages, tool execution, external MCP, workflow engine, background execution, resumable streams or extra client/configuration caches.

## Acceptance

| Area          | Required observation                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configuration | Code-only resolution; sparse override/reset; database-only provider/model; invalid/disabled references rejected; registered scene enforcement; fresh configuration after writes |
| Isolation     | Instance-local configuration and resources; cross-owner access denied; client cannot select owner, tenant, arbitrary model or trusted SDK options                               |
| Invocation    | Real default scene; v7 generation and synchronous stream-result semantics after async creation; safe model identity and secret redaction                                        |
| Durable turn  | Duplicate keys do not invoke the provider again; competing turns admit at most one; terminal result and usage persisted once; late results cannot overwrite a newer turn        |
| Streaming     | Actual HTTP delivers incremental SDK UI-message chunks without a JSON envelope; errors/disconnect/timeout join finalization before context disposal                             |
| Browser       | Send, incremental output, reload history, Stop/reconciliation, and conversation-switch lifecycle using existing managed fixtures                                                |
| Verification  | Focused managed backend tests, affected paired SSR/REST builds, dependency sync, managed browser checks, docs build and lightweight spec audit                                  |

Deterministic tests use the official SDK mock and do not contact a paid provider. Live-provider interoperability, provider billing and production credential provisioning require separate authorized evidence. A successful lightweight spec audit establishes structure only, not runtime acceptance.

## Delivery status

The approved MVP is implemented and its required deterministic checks passed: 17 focused managed backend/shared-adapter tests, all 3 managed browser scenarios, four affected SSR/REST pairs with Vona synchronization, shared typechecking, documentation build and lightweight specification audit. Actual observations, earlier failures and remaining live-provider limitations are recorded in [progress](./progress.md).
