# Cabloy AI MVP Delivery Plan

This bounded increment implements the [approved scope and acceptance](./README.md). Public configuration and usage are canonical in the [AI Guide](../../repo-docs/backend/ai-guide.md). The [progress register](./progress.md) records execution evidence; source completion alone is not acceptance.

## Work breakdown

### Phase 10: Configuration and scene capability

Dependency: none.

#### WBS-AI-10-01: Deliver configuration persistence and the scene facade

Tasks:

- Generate the owning backend/frontend modules through the existing CLIs.
- Implement instance-scoped sparse provider/model overrides and code-owned scenes with direct SDK provider factories.
- Support direct plaintext provider `options.apiKey` persistence and server-only consumption; expose async creation with SDK-compatible text methods.

Acceptance checks:

- Focused managed configuration tests prove config-only operation, merge/reset behavior, instance isolation, validation, snapshot refresh and SDK defaults.
- No configuration read inserts defaults and no persisted override contains executable code. Only provider `options.apiKey` may persist a credential; tests prove rotation, inheritance/reset and exclusion from serialized invocations and chat outputs.

### Phase 20: Persisted private streaming chat

Dependency: `WBS-AI-10-01`.

#### WBS-AI-20-01: Deliver private conversation execution and native streaming

Tasks:

- Add the initial migration and ordinary lookup indexes for configuration and conversation/message/run/usage records.
- Implement owner/instance-scoped APIs, serialized request-key admission and fenced finalization.
- Keep provider I/O outside transactions; join cancellation, deadlines and finalization inside the native request lifetime.

Acceptance checks:

- Focused managed domain and real HTTP tests prove contention, duplicate admission, ownership, stream chunks, terminal persistence, errors and cancellation.
- Failed/incomplete turns do not become completed model history; usage remains unknown when unavailable.

### Phase 30: Frontend and integration acceptance

Dependency: `WBS-AI-20-01`.

#### WBS-AI-30-01: Deliver the session-SSR chat page and verify the connected slice

Tasks:

- Generate module-local JSON consumers and implement model-owned history plus a JWT-aware SDK stream transport.
- Build every affected SSR/REST pair and synchronize Vona dependencies.
- Run critical managed browser scenarios, typechecks, documentation build and lightweight specification audit.

Acceptance checks:

- Incremental output, saved-history reload, stop/reconciliation and switch/disposal are verified against the managed test server.
- The page preserves session-SSR hydration and safe text rendering.
- Record actual results and limitations; mocks do not establish live-provider interoperability.

## Exit boundary

Stop after the connected scope and required checks pass. No administration UI, tools, MCP, workflow engine, background/resumable execution, live-provider request, development database reset, environment change or automatic commit is authorized by this plan.
