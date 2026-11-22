# Cabloy AI Guide

Cabloy AI integrates AI SDK v7 with Vona's module configuration, bean scenes and instance-scoped persistence. Its first delivery provides reusable text generation and a private Zova chat page, without requiring a provider administration page.

The backend and frontend each have one `cabloy-ai` module inside the `cabloy-ai` suite. The backend owns credentials, effective model configuration and execution records. The browser consumes generated JSON APIs and the SDK UI Message Stream protocol; it never receives provider credentials.

## Configuration ownership

```text
providerFactories (code)
  → aiProviders (configuration + instance DB overrides)
  → aiModels (configuration + instance DB overrides)
  → AiScene (code registration + instance configuration/DB overrides)
  → this.bean.ai.create(...)
```

| Layer               | Meaning                                               | Database behavior                                                               |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `providerFactories` | Trusted SDK provider creation functions               | Cannot be registered or replaced by database rows                               |
| `aiProviders`       | Named provider connections and connection options     | Override a configured connection or add a connection using a registered factory |
| `aiModels`          | Named language models and generation defaults         | Override a configured model or add a model referencing an effective provider    |
| `AiScene`           | Code-owned business scene and default model selection | Override a registered scene; cannot create a new scene                          |

A deployment can run entirely from code configuration. Reading configuration does not create corresponding database rows. Ordinary persisted conversation/run records are separate from configuration records.

### Configure a deployment

The module registers `openai`, `anthropic` and `openaiCompatible` factories but intentionally ships no production model ID or credential. For a single default connection, supply these backend environment variables through your deployment configuration:

| Variable                      | Module configuration target           | Default when unset or empty                                                                                |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `AI_PROVIDER_DEFAULT_FACTORY` | `aiProviders.default.factory`         | Unset; choose `openai`, `anthropic` or `openaiCompatible`, or another registered factory                   |
| `AI_PROVIDER_DEFAULT_BASEURL` | `aiProviders.default.options.baseURL` | Unset; SDK default for `openai`/`anthropic`; required for `openaiCompatible`                               |
| `AI_PROVIDER_DEFAULT_APIKEY`  | `aiProviders.default.options.apiKey`  | Unset; `openai` and `anthropic` require an effective configured key; compatible endpoints may allow no key |
| `AI_MODEL_DEFAULT_PROVIDER`   | `aiModels.default.provider`           | `default`                                                                                                  |
| `AI_MODEL_DEFAULT_MODELID`    | `aiModels.default.modelId`            | Unset; choose a model supported by the selected provider                                                   |

The factory name selects an entry in `providerFactories`; the model's provider name references a connection in `aiProviders`. They are different identities. For example, set `AI_PROVIDER_DEFAULT_FACTORY` to `anthropic` and `AI_MODEL_DEFAULT_MODELID` to `claude-opus-5`, and supply the key through `AI_PROVIDER_DEFAULT_APIKEY`. Leave `AI_MODEL_DEFAULT_PROVIDER` unset to use the `default` connection. Changing it does not create a connection: the referenced connection must already be defined in application/instance configuration or the instance's provider table.

Environment values become module defaults during startup configuration assembly. Application module configuration, instance configuration and then AI-specific database overrides take precedence. Changing the deployment environment requires restarting the affected backend process; a new scene invocation alone does not reload environment configuration. Database changes, in contrast, are resolved by a newly created invocation. In managed test mode, the module substitutes its mock factory, test key and test model before later application/instance overrides.

Installing the suite without a configured model is allowed. An attempted invocation rejects incomplete model/provider configuration or a missing required credential rather than silently choosing a production provider or its API-key environment fallback. The `openaiCompatible` factory permits an omitted key for endpoints that intentionally require no authentication.

For multiple connections or additional generation settings, supply `aiModels.default` and its provider in the application's `cabloy-ai` module configuration. For example, this configuration fragment obtains the key from deployment-owned code:

```ts
config.modules = {
  'cabloy-ai': {
    aiProviders: {
      primary: {
        factory: 'anthropic',
        options: { apiKey: deploymentCredentials.aiApiKey },
      },
    },
    aiModels: {
      default: {
        provider: 'primary',
        modelId: 'claude-opus-5',
        generation: { maxOutputTokens: 1024 },
        request: { maxRetries: 0 },
      },
    },
  },
};
```

`deploymentCredentials` represents your existing server-side deployment configuration, not a Cabloy AI service to install. Do not commit real keys to source control. Choose a model ID supported by your account and installed provider. Configuration alone enables scene calls; no administration page or configuration-row bootstrap is needed. No provider request occurs merely by registering configuration.

For another provider, import its SDK factory in trusted backend code, declare its package dependency in the owning module, and add it to `providerFactories`. The factory receives connection options and returns a provider with `languageModel(modelId)`. Custom server-side `fetch` and provider-specific connection options belong here, never in a database document.

### Shared base configuration

`base.aiProviders` supplies common provider defaults and `base.aiModels` supplies common model defaults. The module ships this base:

```ts
base: {
  aiProviders: {
    enabled: true,
    options: { headers: { 'accept-encoding': 'identity' } },
  },
  aiModels: {
    enabled: true,
    request: { maxRetries: 0 },
  },
},
```

Both use the same definition types as their named entries. They may contain factory/provider/model selectors and trusted connection options, but the shipped base contains no key, URL or model ID. Deliberately putting an API key or endpoint in the base shares it with every inheriting connection, potentially across different factories; prefer named entries when connections have different credentials or endpoints.

For each provider/model, effective resolution merges **base → named configuration → stored override** into a fresh object. Named configuration is already assembled from module, application and instance layers. This applies to configured entries and database-only entries; saving persists only the supplied override document, not inherited defaults or credentials. Base does not register resources: a name must exist in configuration or the active instance's table. An explicitly declared `{}` entry can inherit a complete base, but an unknown name still fails.

Set common policy or override a specific connection in application module configuration, for example:

```ts
config.modules['cabloy-ai'] = {
  base: {
    aiModels: { generation: { maxOutputTokens: 1024 } },
  },
  aiProviders: {
    compressed: {
      factory: 'openai',
      options: {
        apiKey: deploymentCredentials.aiApiKey,
        headers: { 'accept-encoding': 'gzip' },
      },
    },
  },
};
```

Here other connections inherit identity, while `compressed` requests gzip. Use the same lowercase header spelling when overriding it. The reference application has no additional default-connection encoding override. Registered factories called directly receive only supplied options; base is applied by Cabloy configuration resolution, not global Fetch or factory decoration.

The identity default requests uncompressed delivery, which may increase bandwidth. It was selected after a real-path comparison, but is not proof of a particular compression defect or a guarantee that every upstream complies or flushes immediately. Reassess policy for each endpoint; see [streaming diagnostics](#diagnosing-text-that-appears-only-at-completion) for the evidence boundaries. Trusted per-call request headers take precedence for the installed OpenAI SDK. The database header allowlist is unchanged: configure this encoding policy in backend code, not through `saveProvider`.

Apply code configuration through normal backend reload/restart; no frontend rebuild or database reset is needed. Unset/empty environment defaults omit optional factory, URL, key and model-ID fields so they do not erase base inheritance. An explicitly configured `undefined` still follows the normal merge semantics; it is not automatically skipped.

### OpenAI endpoint compatibility

Choose the factory explicitly; changing `AI_PROVIDER_DEFAULT_BASEURL` or `options.baseURL` changes the endpoint location, not the protocol:

| Factory            | Protocol                                                                   | Connection requirements                                                              |
| ------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `openai`           | Responses API (`/responses`) with the installed `@ai-sdk/openai` version   | Effective `apiKey`; optional `baseURL`                                               |
| `openaiCompatible` | Chat Completions (`/chat/completions`) through `@ai-sdk/openai-compatible` | Explicit `baseURL`; `apiKey` optional if the endpoint permits unauthenticated access |

For a third-party compatible service, configure the default connection with `AI_PROVIDER_DEFAULT_FACTORY=openaiCompatible`, its API prefix through `AI_PROVIDER_DEFAULT_BASEURL`, and its model ID through `AI_MODEL_DEFAULT_MODELID`. Supply `AI_PROVIDER_DEFAULT_APIKEY` when that service requires authentication. Leave `AI_MODEL_DEFAULT_PROVIDER` unset to use the default connection.

The same connection can be configured under any alias, for example in application module configuration:

```ts
aiProviders: {
  local: {
    factory: 'openaiCompatible',
    options: { baseURL: 'http://127.0.0.1:8000/v1' },
  },
},
aiModels: {
  default: { provider: 'local', modelId: 'your-model-id' },
},
```

Use the API prefix, such as `https://provider.example/v1`, not the full `/chat/completions` URL. The compatible factory requires an explicit URL and does not fall back to `OPENAI_BASE_URL` or `OPENAI_API_KEY`. A missing URL fails during invocation creation through the safe factory-error boundary. Never omit a required key for a remote authenticated service.

The compatible adapter fixes the SDK provider name to `openaiCompatible`, independent of the application's connection alias. Use `providerOptions.openaiCompatible` for its provider-specific generation options. It forwards provider connection options to the SDK; enable options such as `includeUsage: true` only when the endpoint supports them. Streaming usage is not requested by default, so token usage can remain unknown. Tools, reasoning and structured outputs depend on the endpoint/model; this factory does not provide Responses-only features or expand the text-chat MVP.

For the `openai` factory, when `options.baseURL` is unset, the OpenAI SDK may also use its standard `OPENAI_BASE_URL` environment variable. Set an explicit effective `baseURL` when endpoint selection must not depend on that fallback. This is separate from API-key resolution: `openai` and `anthropic` require a configured key.

### Sparse overrides

Effective provider/model entries merge the assembled `base.aiProviders` / `base.aiModels`, their named module/application/active-instance configuration and the instance's stored override document, in that order. Scene resolution applies decorator/application onion configuration, active-instance onion configuration, the stored scene override and trusted caller overrides, in that order. Base model settings enter through the selected model, not a second scene-level merge.

- Plain objects merge recursively into fresh objects.
- Arrays replace the previous array.
- Missing properties inherit; `false` and `0` are explicit values.
- Only nullable fields accept `null`. It is not a generic delete operator.
- To restore inheritance, remove the property from the stored override document.
- Saving an override replaces that override document; it is not an implicit JSON Patch.
- Deleting an override for a configured entry reveals the configured entry again. Disable the effective entry explicitly to stop its use.

Changing a scene's selected model first selects that model's defaults. Defaults from the previously selected model do not leak into the new selection. Creating another bound invocation resolves the latest effective configuration; an already-created invocation retains its snapshot.

Database values are data only: no factory functions, executable imports, custom `fetch`, tools, lifecycle callbacks, bean classes or executor options.

Trusted backend code can save overrides through the owning scope service:

```ts
const configuration = this.$scope.cabloyAi.service.configuration;

// Store a direct key override for the configured provider.
await configuration.saveProvider('primary', {
  options: { apiKey: newApiKey },
});
await configuration.saveModel('default', {
  generation: { temperature: 0, maxOutputTokens: 512 },
});
await configuration.saveScene('cabloy-ai:default', {
  generation: { temperature: 0.2 },
});

// Replace the stored model override with an empty document to inherit code defaults.
await configuration.saveModel('default', {});
```

These calls operate inside the current instance and validate the effective references. Database-only provider/model additions must supply a complete effective definition. They are not browser management APIs. Run backend orchestration inside an established Vona request/executor context; do not select instance or owner authority from posted data.

### Keep SDK option layers separate

Connection/factory settings such as `apiKey`, `baseURL` and shared headers belong to the provider. Generation defaults such as temperature and output-token limits belong to model/scene invocation settings. Request timeout, abort and retry settings remain distinct. Provider-specific generation settings use the SDK's `providerOptions` namespaces, not the application's provider alias.

For example, an application alias named `primary` does not change the SDK namespace used by that provider. Do not assume every provider accepts a second options argument when selecting a model; use the installed provider's actual API.

### Credentials

Set `options.apiKey` in backend deployment configuration, or save it directly in the provider's `overrides` JSON through `saveProvider`. A database-only provider must resolve to a registered `factory` and valid connection options, inherited from base or supplied in its document. No separate credential column or resolver is required.

**Database keys are stored in plaintext, without encryption.** Anyone with access to the provider records, database exports or backups can read them. Restrict that access and protect backups accordingly. Instance scoping controls ordinary application access; it does not encrypt data at rest.

Provider saves replace the entire stored override document. To rotate a key, save the replacement key together with any other database overrides you want to retain. To restore the deployment key, remove `options.apiKey` from the replacement document; saving `{}` removes all stored provider overrides and inherits the configured provider. It does not disable that provider. A future management form must preserve an unchanged stored key on the server, not submit a display mask as a new key. This MVP does not implement that form or its endpoints.

Only the exact provider-document path `options.apiKey` is permitted for persisted API keys. Secret-like fields elsewhere, credential-bearing URLs and non-allowlisted headers remain rejected. Executable connection options such as custom `fetch` remain code-only.

Configuration services are trusted backend operations: their mutation results, provider-model reads and `resolveProvider()` results may contain the actual key. Never return these objects directly from a controller or transfer them to a browser. There are no public provider/model/scene management endpoints in this MVP.

Do not include keys in run snapshots, errors, diagnostics, chat API responses, frontend state or SSR transfer. The invocation exposes only safe identity/limit data; its model and options remain private. This delivery does not introduce a secret vault, encryption-key lifecycle or secret-management UI.

## Scene calls

Register a business scene in its owning backend module, then regenerate that module's metadata through the Vona CLI:

```ts
import { BeanBase } from 'vona';
import { AiScene } from 'vona-module-cabloy-ai';

@AiScene({
  aiModel: 'default',
  instructions: 'Summarize the supplied text without inventing facts.',
  generation: { maxOutputTokens: 1024 },
})
export class AiSceneSummary extends BeanBase {}
```

Declare the owning module's dependency on `cabloy-ai`. Scene identity is the full registered onion name; a database row cannot register this class on its behalf. `cabloy-ai:default` is provided for the built-in chat.

The business call sequence is:

```ts
const scene = await this.bean.ai.create('cabloy-ai:default');
const result = await scene.generateText({
  prompt: 'Summarize the supplied public information.',
});
```

For a stream:

```ts
const scene = await this.bean.ai.create('cabloy-ai:default');
const result = scene.streamText({ messages, abortSignal });
```

Async creation performs configuration/model resolution. After creation, `generateText` returns the SDK promise and `streamText` returns the SDK streaming result synchronously. The default scene is a real registered bean, not a fallback that turns arbitrary names into scenes. Business modules may register their own `AiScene` beans and select named models.

Use v7's canonical `instructions`, `onEnd`, `onAbort`, `stream` and aggregate `usage` interfaces. Older examples may use deprecated names. SDK provider packages have independent versions; their major version need not equal the `ai` package's major.

Generation defaults are overridable only inside the trusted backend boundary. Disabled entries, ownership, admission and hard execution limits are not ordinary browser-overridable generation options. Do not pass posted SDK option objects directly into the facade.

## Private chat

The authenticated page is `/cabloy/ai/chat`. It uses session SSR for saved private history and starts generation only from a browser action. Conversation/history queries belong to the Zova model; the current stream is transient state, not a second durable history owner.

The API derives the user from Passport and operates inside the active instance. The browser sends a conversation identity, request key and new user text. The server loads owned history and chooses the scene/model; client-supplied system/assistant history and owner/tenant/model authority are not accepted.

### Run behavior

1. A short atomic preparation admits one active turn and persists its user message and run.
2. The provider executes outside the transaction.
3. A short fenced finalization persists the terminal outcome, assistant result and observed usage.

Repeating the same request key with the same input references the existing run without another provider call. Reusing it with different input conflicts. This establishes local admission/persistence behavior, not exactly-once remote billing.

Stop aborts the browser transport and propagates cancellation. Server status/history is authoritative after cancellation or a connection failure. Failed/incomplete turns are not reused as completed model history. Unknown usage remains unknown rather than a fabricated zero.

Runs have finite execution deadlines. A later status lookup or admission may mark an expired run interrupted and release its claim; it never resumes or replays that execution. This is not a background job system or a resumable streaming service.

### Streaming integration

The guarded Vona action validates authorization and input before taking ownership of the native response. It sets the response status and disables ordinary response handling, then awaits the SDK's native Node response pump and application finalization inside the live request scope. A lazy Koa body alone does not establish that lifetime.

The Zova transport uses the current API origin, locale/timezone and Passport bearer-token refresh path. Cookie credentials alone are not a replacement for that API authentication contract. The browser uses SDK transport/reader primitives, not a React-specific chat hook. Backend AI invocations use strict provider-wire validation rather than HTTP query coercion; the chat service retains that strict scope through stream consumption and finalization. This preserves valid empty-string provider events without changing the application's ordinary query parsing.

### Diagnosing text that appears only at completion

A successful SSE response or a short answer such as `OK` does not prove progressive rendering: a provider may emit the complete answer in one text delta. To observe progress manually, use one public, longer prompt (for example, a roughly 400-character explanation in numbered paragraphs) within the configured output/deadline limits. This makes a real provider request and may incur charges; do not repeatedly resend an uncertain request.

In browser Network tools, inspect `POST /api/cabloy/ai/chat/send` while it is still open. Where the browser exposes live SSE events, compare the arrival of `text-delta` events with growth of `Assistant · live response`, before the final `finish` event and `Ready` state. A completed Response tab, total request duration, or `response.clone().text()` read at EOF does not establish incremental arrival.

- Spaced text events but no visible growth point to the browser parser/state/render boundary.
- Text events arriving only in a final burst require upstream timing evidence to distinguish provider batching from HTTP/intermediary buffering. Multiple events in a completed response alone cannot make that distinction.
- An `ai.chat.stream.failed` event followed by saved text appearing can indicate stream failure followed by authoritative history reconciliation, not successful incremental delivery.

For a same-request comparison, the backend `ai.chat.stream.timing` debug summary reports first/last nonempty text times, total execution duration and 250 ms windows of delta counts and character lengths. Its clock starts inside chat execution, whereas a browser observer commonly starts at fetch; compare cadence and counts rather than equating their time origins. This measures SDK text-stream consumption immediately before SSE enqueue, not raw provider-network arrival or browser painting. Bursty backend consumption places the delay at or before that boundary; it does not by itself prove the provider service is buffering. Debug events require the existing logger filters to admit them; do not bypass protected-request diagnostic suppression.

If further authorized diagnosis is needed, compare provider-local Fetch response-body reads before SSE parsing with SDK text timing in the same execution clock. Observe the body the SDK consumes without independently draining or retaining it, and remove temporary instrumentation after collection. Batches already present in those reads place the pattern before SDK text normalization; they still include Fetch/runtime buffering and decompression, not just the remote provider. Roughly regular byte-sized batches are a reason to inspect gateway/proxy/compression buffering, not proof of one specific cause. Requesting a longer public answer can make repeated batches observable, but does not guarantee output length or justify increasing deployment limits or automatic retries.

A separately authorized request-level `Accept-Encoding: identity` comparison can help investigate compression-dependent delivery. Keep it local to the selected invocation and record only allowlisted encoding classifications and numeric timing/count summaries; check the response's actual `Content-Encoding`, since requesting identity does not guarantee upstream compliance. Preserve an explicit caller/provider compression policy rather than silently changing global Fetch behavior. If delivery improves, treat it as evidence for the negotiated path, not proof of a specific gzip/proxy defect—especially when the baseline response encoding was not recorded. Prefer provider-specific configuration or correcting upstream flush/compression behavior over an unverified framework-wide default.

The managed mock regression checks multiple growing partial texts before completion. It does not qualify a real provider or deployment path. Retain only safe event types, counts and relative timing when investigating; do not share credentials, cookies, raw provider errors or unreviewed HAR files. Do not add artificial typewriter delays to disguise a buffering problem.

## Verification and limitations

Focused tests use the official AI SDK mock in test mode. The ordinary private-chat browser checks use the managed isolated E2E runner, not a production provider or a development database reset. See [Repository Scripts](../reference/repo-scripts.md) for isolated tests and paired frontend builds.

### Explicit live-provider chat qualification

Real requests require separate authorization and may incur provider charges. After preparing the affected SSR/REST artifacts and configuring the server's five `AI_*` defaults, run only the opted-in qualification file:

```sh
CABLOY_AI_LIVE_VERIFY=1 npm run test -- -- --ci src/suite-vendor/cabloy-ai/modules/cabloy-ai/test/live.test.ts
```

This managed backend test starts its own isolated Vona application and HTTP listener, temporarily saves the environment-selected real provider/model and default-scene override in that run's database, then asynchronously runs the existing browser runner against Vona integrated SSR. It sends one public short prompt with a 64-token output cap, a 30-second provider timeout and zero SDK/browser retries. It checks native SSE, completed history, private SSR reload/hydration and same-key replay, then removes the owned account, conversations and temporary configuration. No Zova development server, development database reset, environment edit or executable HTTP setup endpoint is required.

The test reads already-loaded test-runtime `AI_*` defaults; it does not import dev-only environment layers or qualify an existing deployment's instance overrides. It accepts the built-in `openai`, `anthropic` and `openaiCompatible` factory names, with the environment model's provider alias unset or `default`. Normal test configuration still uses the mock, and both live files skip without the opt-in. Select only this backend file when opting in because it temporarily owns the isolated instance's default scene; do not run the live browser spec independently or combine it with mock chat scenarios.

The real API key is temporarily persisted as plaintext in the isolated provider override, consistent with the credential contract above. Browser traces, videos and screenshots are disabled. Cleanup is attempted in `finally`; a failed managed run can retain its owned resources for inspection, so inspect and resolve any cleanup failure rather than assuming credentials or fixtures were removed. Short replies may contain only one text delta; that establishes stream interoperability, not multi-chunk long-response performance or billing correctness.

This initial slice does not include tool execution, provider management pages, external MCP, agents/workflows, attachments, retrieval, stream reconnection or background continuation. Real-provider interoperability and deployment credential provisioning require separate authorized verification. Stable non-sensitive debug events assist diagnostics; `ai.chat.run.failure` records only a fixed execution phase, SDK error family and validated HTTP status (or `unknown`), never the raw error or provider response. A schema-validation failure does not by itself establish an HTTP rejection or identify the failing response field. Logs are not a substitute for assertions or a billing ledger.
