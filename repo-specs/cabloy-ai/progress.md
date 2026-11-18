# Cabloy AI Delivery Progress

## Current increment

The implementation increment is defined in the [scope and acceptance record](./README.md). This register records observations, not new requirements.

## Delivery status

| WBS ID       | Status   | Evidence                                                                              |
| ------------ | -------- | ------------------------------------------------------------------------------------- |
| WBS-AI-10-01 | verified | Managed configuration/facade tests and shared typecheck passed                        |
| WBS-AI-20-01 | verified | Managed domain/native HTTP tests passed, including contention and replay              |
| WBS-AI-30-01 | verified | Contract, four paired builds/sync, final typecheck and all 3 browser scenarios passed |

## Observations

- CLI-created backend and frontend suites/modules are present.
- `ai@7.0.173`, `@ai-sdk/openai@4.0.118` and `@ai-sdk/anthropic@4.0.105` were available from the configured package registry. Dependency closure generation/install completed through the normal root commands.
- Configuration/facade, private conversation execution and frontend source/tests are implemented; the approved connected increment passed its required deterministic verification.
- The first managed backend run completed with 8 passing and 3 failing tests. Strict configuration parsing, SQLite short-transaction serialization and pre-stream HTTP assertions were corrected. The managed rerun passed all 12 tests, including the added durable-replay regression.
- Module-local contract generation completed through the isolated command. The operation filter was corrected to the emitted `CabloyAiChat_*` identities and regenerated.
- Safe effective composition inspection found the new module in all four flavors: `cabloyBasicWeb`, `cabloyBasicAdmin`, `cabloyCommerce` and `cabloyCommerceAdmin`. The first build exposed a required direct `json-schema` declaration dependency; after declaring it in the owning frontend module and running normal dependency preparation, all four SSR/REST pairs built successfully. Normal Vona dependency synchronization then passed.
- The final shared frontend/backend typecheck passed after the backend corrections.
- The first managed browser run failed all three scenarios at the same incremental-text observation: HTTP streaming admission succeeded, but the transient prefix was not observed. A focused diagnostic rerun identified `AI_TypeValidationError`; a bounded reproduction traced it to the shared Zod query adapter reading a classic-only literal property on the SDK's Zod Mini schema. The minimal compatibility correction now covers both the shared literal value set and classic-only string metadata access. The managed shared-adapter regression passed all 5 tests. After correcting the owning-package linkage, the unchanged managed browser suite passed all 3 scenarios.
- The combined managed rerun passed all 17 tests: 12 AI configuration/domain/native-stream tests plus 5 shared query-adapter regressions.
- A local `file:` dependency installed successfully but excluded source under the utility's publication file filter. The authored linkage now includes only the owning `zod-query` package as a Zova workspace member, redirects its dependency requests through a workspace override, and deduplicates Zod in the application Vite hook. No installed files or copied build artifacts were patched.
- Effective Zova core/module consumers resolved the corrected local source before compilation. The final four-pair build and Vona synchronization passed, followed by the managed browser suite (3 pass, 0 fail, no retries) and final root frontend/backend typecheck.
- Browser assertions cover real incremental HTTP text, completed history and private session-SSR reload without hydration/page errors; Stop with durable cancellation and a later successful turn; conversation switching and page disposal without old-stream text leakage.
- The documentation build, scoped formatting/whitespace checks and lightweight specification audit passed. The audit is structural only and does not establish live-provider or production acceptance.
- No live-provider request was made during the original MVP increment. Separately authorized live verification is recorded below.

## Provider credential correction

The follow-up replaces external credential-reference resolution with direct plaintext provider `options.apiKey` persistence, as explicitly requested. It retains the existing JSON override storage and replacement/inheritance semantics; no database column, migration, encryption mechanism or management page/API is added.

Implemented and verified on 2026-11-17. Provider save/read validation permits only the exact `options.apiKey` path for persisted credentials; reference/resolver types, schema entries, runtime resolution and fixtures are removed. Trusted configuration operations still return raw configuration; chat contracts are unchanged.

Correction-specific verification:

- Managed configuration/domain/native HTTP tests: **14 passed, 0 failed**. Configuration tests verify plaintext storage, effective SDK key delivery, database-only providers, rotation/reset/inheritance, existing invocation snapshots and instance isolation. Negative cases retain JSON, exact-path, schema, header and URL validation. HTTP tests verify the distinctive fake key and internal provider metadata do not appear in SSE, replay, status/history responses or the checked durable records, including safe failure handling.
- `npm run tsc:vona`: exit 0.
- `npm run docs:build`: exit 0; seven local document link targets checked.
- `npm run spec:check -- cabloy-ai --lightweight`: passed for three delivery definitions; structural evidence only.
- Scoped formatting and tracked whitespace checks passed. The authored backend/frontend AI suites, canonical guide and delivery records contain no removed reference/resolver symbols.

No frontend contract changed, so this follow-up reuses the original browser and paired-build assurance without rerunning those checks. No live-provider request, database migration/reset, environment edit or commit was performed for this correction. The original connected-MVP results below remain historical evidence, not fresh results for this correction.

## OpenAI-compatible factory follow-up

The approved follow-up adds an independent `openaiCompatible` factory for third-party Chat Completions endpoints, retaining the existing `openai` Responses behavior. It requires an explicit API-prefix `baseURL`, permits an omitted key for intentionally unauthenticated endpoints and keeps the existing provider/model/scene contract. No public API, database schema or frontend contract changes are required.

Implemented and verified on 2026-11-17. The owning backend module declares `@ai-sdk/openai-compatible@3.0.92`; normal `npm run deps:vona` synchronization passed. A thin adapter forwards connection options, fixes the SDK provider name to `openaiCompatible` and rejects a missing/blank URL. Existing OpenAI and Anthropic registrations remain unchanged.

Follow-up verification:

- Managed configuration/domain/native HTTP tests: **16 passed, 0 failed**. Two new regressions exercise the actual compatible SDK with a caller-local `fetch` fixture: generation and streaming use `/chat/completions`, preserve the selected model, map optional bearer credentials and forward namespaced provider options plus opt-in streaming usage. Missing URL rejection remains behind the facade's safe factory-error boundary. No external provider request occurs.
- `npm run tsc:vona`: exit 0.
- `npm run docs:build`: exit 0; seven local document link targets checked.
- Scoped formatting and tracked whitespace checks passed; lightweight specification audit passed for three definitions, structural evidence only.

No frontend contract changed, so no frontend rebuild or browser rerun was needed for this addition. No environment edit, development database reset, migration or commit was performed. Actual third-party endpoint/model compatibility remains unverified; local wire fixtures are not live-provider evidence. The earlier results in this register remain historical evidence, not fresh results for this addition.

## Separately authorized live-provider verification

On 2026-11-18, the user explicitly authorized real Provider verification using their deployment environment configuration. A source-only process used the normal `normal`/`dev` environment loader and application module configuration merge, with `configResolutionOnly: true`; it did not bootstrap Vona, connect to application databases or start an HTTP listener. The selected real model passed through its registered factory and the actual `AiInvocation` generation/streaming wrapper. Environment file contents, endpoint, model identifier, credentials and raw responses/errors were not retained in this record.

The effective factory was **`openai` (Responses API)**, not `openaiCompatible`. Exactly two fetch calls were made, each with the public prompt `Reply with only OK.`, output cap 64 tokens, zero SDK retries and a 30-second per-call timeout.

| Check                    | Result   | Observed evidence                                                                                                     |
| ------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| Deployment configuration | Passed   | Dev mode, no test mock; effective credential present                                                                  |
| `generateText`           | Passed   | HTTP 200; 3,401 ms; nonempty 2-character reply; finish reason `stop`                                                  |
| `streamText`             | Passed   | HTTP 200; 1,997 ms total; first text at 1,990 ms; one nonempty text chunk totaling 2 characters; finish reason `stop` |
| Provider-reported usage  | Observed | Each call reported 4,227 input tokens and 5 output tokens; retained as reported, not independently verified billing   |

The input-token count is much larger than the short prompt; this check does not establish the provider's token-accounting or billing semantics. The short streamed reply yielded only one text chunk, so this is stream interoperability evidence, not evidence of multi-chunk long-response delivery. The check excludes instance/database overrides, `bean.ai.create()` database resolution, durable chat, server HTTP streaming and browser/SSR acceptance. It does not establish real `openaiCompatible` Chat Completions interoperability. No additional requests, environment edits, database resets or code changes were made for this live check.

## Separately authorized full-chat qualification

On 2026-11-18, the user separately requested the complete real-provider chat chain. The opt-in managed backend test starts the existing Vona application and loopback listener, resolves temporary database-backed provider/model/scene configuration from already-loaded deployment defaults, and asynchronously launches the existing managed browser runner. It does not change environment files, start a Zova development server, reset development databases or introduce an executable HTTP setup endpoint. See the [canonical qualification instructions](../../repo-docs/backend/ai-guide.md#explicit-live-provider-chat-qualification).

Qualification observations so far:

- The initial E2E setup attempt stopped at the dev-only `a-play` route's HTTP 404, before any provider call. The executable module's security boundary was preserved; that setup strategy and its helper were removed.
- The managed backend/browser replacement reached registration, activation, login, conversation creation and a real HTTP chat send. Its first runtime attempt failed at Chromium's unavailable consumed response-body inspection. The browser test now observes an in-page response clone without replacing the application's original stream.
- The next runtime attempt exposed a genuinely failed durable run (`failed` / `chat_failed`), not merely an observation failure. A subsequent bounded diagnostic attempt classified the SDK failure as `schema_validation`; no HTTP rejection can be inferred from that classification. Both failed runs reached terminal persistence with unknown usage and did not establish completed history, SSR or replay acceptance.
- Safe once-per-run backend diagnostics now emit only fixed execution phase/error-family classifications and a validated HTTP status or `unknown`. Raw provider errors, response bodies, endpoint/model identifiers and credentials are not retained in this register.
- The new diagnostics passed the existing managed native-HTTP regression file (**3 passed, 0 failed**) and backend typecheck. This does not turn the failed live qualification into a pass.
- All four failed managed runs described above were inspected and removed through the existing claim cleanup with verified process inactivity and checkout ownership. Account/conversation/configuration cleanup also runs in test `finally` boundaries; no development reset was used.

A local actual-OpenAI-SDK SSE fixture reproduced a concrete integration defect without external requests: query coercion transforms a valid required empty-string text delta into `undefined`, causing schema validation to fail. Strict parsing completes the same stream successfully. The AI facade now establishes strict query-coercion scopes for SDK calls, and chat execution retains the scope across the complete lazy stream/finalization lifecycle. The regression also consumes the facade's synchronous stream result from a coercion-enabled caller and verifies completion. The focused configuration/native-HTTP run passed **11 tests, 0 failed**. This proves the integration defect and correction, not which field triggered a historical live response.

The first post-fix browser qualification passed all browser assertions: one browser send, one text delta totaling two characters, a completed run with two saved messages, private SSR reload, no hydration/page errors and same-key replay with no text deltas or history change. Its outer test nevertheless exited nonzero because the cleanup assertion compared database count string `'0'` to number `0`. The assertion now normalizes the count with `Number(...)`; read-only inspection confirmed zero active AI configuration/conversation/message/run/usage rows before guarded cleanup of that run. This was a test type-assumption defect, not a failed browser chain. That fifth failed outer run was also removed through guarded inactive-claim cleanup.

The final opted-in managed rerun **passed: 1 test, 0 failures, exit 0**. Effective factory: **`openai` (Responses)**. Browser evidence: **1 send, 1 text delta, 2 reply characters, `completed`, 2 saved messages, private SSR true, 0 hydration errors, 0 page errors, 0 replay text deltas**, with unchanged durable history after reload/replay. The parent confirmed no remaining owned runs, removed temporary configuration, shut down the app gracefully and completed normal managed-resource cleanup. This qualifies the configured endpoint/model's short text-chat chain; it does not qualify a real `openaiCompatible` endpoint, long multi-chunk delivery, tools, billing correctness or fresh live usage-row assertions. Usage persistence retains its separate deterministic assurance.

Across the full-chain troubleshooting and final qualification there were five real browser generation sends (one per provider-reaching run, no SDK/browser retries), separate from the two earlier source-only requests. Same-key replay was checked without new text generation. The first setup-only run did not reach the provider.

Final follow-up checks also passed: managed configuration/domain/native-HTTP tests **17 passed, 0 failed** (including the new strict Responses regression); backend typecheck; docs build; scoped lint/format/whitespace; and the lightweight three-definition specification audit. The audit remains structural only. The earlier 17-test original-MVP baseline includes a different set of shared-adapter tests and is not relabeled as this fresh result.

Previous source-only generation/streaming success remains distinct evidence; it is not substituted for browser acceptance.

## Incremental rendering report follow-up

On 2026-11-18, the user reported that chat text appeared only after reception completed. Read-only inspection found no demonstrated EOF barrier in the authored path: Vona forwards SDK text deltas before terminal finalization, the installed SDK writes SSE chunks progressively and clones UI-message snapshots, and the reactive Zova model assigns each snapshot directly to transient render state. These source observations do not establish actual provider or deployment timing.

The existing mock now splits its prompt contribution into two nonempty deltas in addition to the initial response prefix, preserving the final response and existing slow-stream behavior. The native-HTTP regression parses complete received SSE events and requires two ordered, growing incomplete text prefixes before terminal finish. The completed-chat browser scenario similarly requires two distinct partial DOM texts while `Receiving response…` and Stop remain active; cancellation/switch/disposal scenarios retain their early-prefix observation rather than waiting for extra stages.

Fresh managed verification passed: **3 native-HTTP tests, 0 failures**, and **3 browser scenarios, 0 failures, zero retries**. The browser run includes repeated partial-text repaint, completed history/private SSR reload, Stop/recovery and conversation switch/disposal. Backend typecheck, documentation build and scoped lint/format/whitespace checks passed. The mock is the only runtime behavior changed; no production stream/render correction, unconditional diagnostic instrumentation, frontend build, environment change, development reset, real-provider request or commit was made for this follow-up.

**The user's real-path symptom remains unresolved.** These checks establish controlled multi-delta delivery/rendering, not live-provider progression. The previous `OK` qualification remains short-chat evidence only. The [streaming diagnostic guidance](../../repo-docs/backend/ai-guide.md#diagnosing-text-that-appears-only-at-completion) now explains using a longer public prompt and in-flight SSE/DOM timing to distinguish upstream batching, transport buffering and browser rendering, without retaining content or treating an EOF observer as timing evidence.

## Separately authorized real-stream timing observations

On 2026-11-18, the user authorized direct Chrome observation, followed by a separately approved same-request backend/browser timing comparison. Both used the current worktree's existing Vona integrated SSR development service, an independent ephemeral Google Chrome context, normal login admission and one newly created development conversation per observation. Each sent exactly one public prompt requesting a roughly 400-character, five-paragraph explanation of streaming responses; no automatic resend or additional qualification request occurred. The conversations remain in development data. The owned browser contexts were closed; no environment configuration, database reset or unrelated process action was involved.

The first browser-only observation received 295 text deltas totaling 446 characters in concentrated groups at 11,170 / 11,260 / 13,493 / 13,519 ms after fetch. First DOM text change was at 11,184 ms and terminal finish at 13,747 ms, with 295 nonempty text-length changes and no page errors. This established bursty browser arrival and pre-finish DOM updates, not actual paint cadence or attribution to a provider.

For the second observation, `run.ts` records one content-free `ai.chat.stream.timing` summary: first/last nonempty SDK text times, execution duration and 250 ms windows of counts/lengths immediately before SSE enqueue. Only this summary temporarily used `info` for collection under the existing development logger threshold; it was restored to `debug` afterward. No global logger configuration or protected diagnostic suppression was changed. No text, credentials, endpoint/model identifiers or raw provider errors were retained in the summaries.

| Boundary                                            | First text | Last text | Nonempty deltas / characters | Observed grouping                                                                      |
| --------------------------------------------------- | ---------- | --------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| Backend SDK text consumption, relative to execution | 9,180 ms   | 11,463 ms | 299 / 445                    | 210 deltas / 317 characters in the 9,000–9,249 ms window; 89 / 128 in 11,250–11,499 ms |
| Chrome SSE receipt, relative to fetch               | 9,216 ms   | 11,516 ms | 299 / 445                    | 42 / 62 at 9,216 ms; 168 / 255 at 9,354 ms; 6 / 9 at 11,475 ms; 83 / 119 at 11,516 ms  |

Chrome observed first DOM text at 9,235 ms, last nonempty transient-text change at 11,700 ms and terminal finish/EOF at 11,709 ms. It recorded 299 nonempty length changes, HTTP 200, `Ready`, no stream warning, no body-reader failure and zero page errors. Different clock origins preclude treating the 36 ms first-text difference as a standalone transport-latency measurement. DOM mutation is not proof of a separate painted frame for each delta.

**Attribution:** concentrated delivery was already present at the SDK-consumption/SSE-enqueue boundary. Browser text updated before completion, shortly after receipt; the observed main burst pattern is not explained by a frontend EOF barrier or solely by buffering after backend enqueue. This does not independently identify provider-service batching, an upstream gateway, raw upstream-network delivery or SDK processing as the cause. No speculative production rendering fix was applied; deeper upstream attribution remains open rather than claimed resolved.

Fresh checks for the summary increment passed: managed native HTTP **3 tests, 0 failures**, backend typecheck, docs build and scoped format/lint/whitespace checks. Initial scoped lint required braces around the extended stream branches; those were corrected and checks rerun. Earlier mock-browser results remain applicable historical evidence, not a new browser-regression run for this backend-only diagnostic change. The real-browser observation above is distinct from managed mock acceptance.

## Separately authorized upstream-body timing comparison

On 2026-11-18, the user approved the next upstream-versus-SDK comparison and permitted requesting a longer answer. Exactly one new real chat send requested an approximately 1,500-Chinese-character explanation in ten sections. The existing development service, normal login flow and an owned ephemeral Chrome context were reused; output/deadline limits and zero SDK retries were unchanged. The observation completed successfully and the owned browser was closed. The new conversation remains in development data.

A temporary provider-local `fetch` decorator observed only the SDK-consumed original response body, before SSE parsing. A pull-driven wrapper with `highWaterMark: 0` forwarded the same byte chunks, errors and cancellation; it did not clone, tee, independently drain, decode or retain the body. A temporary async-local numeric state was enabled only for the exact authorized public prompt outside tests. Raw-body and SDK text observations shared the existing execution clock. One reviewed `info` summary retained only timing/count/length fields; no environment/global fetch/logger configuration, credentials, endpoints, headers, payloads or raw errors were exposed. The decorator, async-local state, prompt selector and temporary log were removed after collection; the pre-existing SDK-boundary `debug` summary remains.

Safe evidence: **one upstream fetch, 59 nonempty body reads totaling 414,252 bytes, 1,295 nonempty SDK text deltas totaling 2,036 characters**. Chrome independently counted the same **1,295 / 2,036**. These character totals are JavaScript string lengths, not a linguistic character/token count. An intermediate narration said 2,033; the summed recorded windows give the corrected total 2,036.

| Execution-clock window | Upstream body reads / bytes | SDK text deltas / characters |
| ---------------------- | --------------------------- | ---------------------------- |
| 11,750–11,999 ms       | 12 / 64,083                 | 186 / 279                    |
| 18,500–18,749 ms       | 8 / 64,906                  | 225 / 363                    |
| 24,500–24,749 ms       | 8 / 64,922                  | 225 / 335                    |
| 31,000–31,249 ms       | 8 / 65,129                  | 226 / 385                    |
| 38,000–38,249 ms       | 8 / 66,879                  | 231 / 364                    |
| 43,750–43,999 ms       | 5 / 50,741                  | 175 / 271                    |
| 44,000–44,249 ms       | 10 / 37,592                 | 27 / 39                      |

Backend response headers became available at 5,352 ms; the first nonempty body read was at 11,756 ms and the first SDK text delta at 11,798 ms (42 ms later on the same clock). Last body read / SDK text / body EOF were 44,056 / 44,054 / 44,059 ms; remaining upstream bytes can contain non-text terminal data. Application execution finished at 44,080 ms. Header availability does not establish when upstream generation began, and a body read is not necessarily a complete SSE event.

Chrome's independent fetch clock recorded first text at 11,853 ms, first DOM text at 11,859 ms, final text and terminal finish/EOF at 44,255 ms, and last nonempty transient DOM change at 44,321 ms. It recorded 1,295 nonempty length changes, HTTP 200, `Ready`, no stream warning/body-reader failure and zero page errors. This is about 32.4 seconds of text reception with distinct bursts, not separate painted frames per delta. The clocks are not directly interchangeable.

**Attribution:** the roughly 6–7-second / roughly 64-KiB batch pattern is already visible in Fetch body delivery before the AI SDK's SSE parsing and text normalization. The text stream follows those batches, with no demonstrated additional SDK or frontend EOF barrier. The observed boundary still includes Fetch/runtime buffering and decompression as well as upstream network/proxy/gateway/provider behavior; these are consumption/read times, not socket packet capture. The batch size is a clue for inspecting upstream/proxy/compression buffering, not proof of a particular component or configuration defect. No speculative rendering/SDK fix or automatic provider/protocol switch was applied, and no second live request was used to probe a hypothesis.

The temporary observation passed backend typecheck and the existing managed native HTTP regression (**3 passed, 0 failed**) before the live call. After removing it, the same checks and scoped format/lint/whitespace checks were rerun. No frontend source, contract, environment file or development database reset was involved; no Git commit was made. The public diagnostic guide distinguishes pre-parser body-read timing from socket or provider-generation evidence.

## Separately authorized identity-encoding comparison

On 2026-11-18, the user approved the next proxy/compression diagnostic. The bounded comparison sent exactly one new real chat request using the same public long prompt, existing limits, normal login flow, current worktree's Vona integrated SSR service and an ephemeral owned Chrome context. A temporary request-local provider Fetch decorator normalized headers and set `Accept-Encoding: identity` immediately before delegation, only for that exact authorized prompt outside tests. It retained the same pre-parser pull-driven byte observation as the preceding increment. No persisted Provider settings, environment, global Fetch/dispatcher, remote gateway or repository Nginx settings were changed.

Bounded source inspection confirmed the installed OpenAI Responses SDK forwards its configured Fetch and merged headers. The inspected local Node binary was 24.11.0 with bundled Undici 7.16.0: it supplies default compression negotiation only when no encoding header exists, and automatically decodes supported compressed responses. These source observations do not independently prove a running service's exact binary or identify a remote gateway. The repository's inspected Nginx configuration proxies inbound application traffic, not the already-observed outbound provider Fetch boundary; its buffer settings were not altered. No explicit outbound dispatcher/ProxyAgent plumbing was found in the scoped authored search; that is not proof that deployment/network proxies are absent.

The temporary decorator passed backend typecheck, managed native HTTP **3 tests / 0 failures**, and a non-network synthetic Fetch fixture checking the identity header and delayed same-byte forwarding. The live summary confirmed **one delegated fetch, identity requested, `text/event-stream`, no declared `Content-Encoding`, `Transfer-Encoding: chunked`**. Only fixed allowlisted classifications were retained, not arbitrary headers, credentials, URLs, errors or body content.

| Check                                           | Previous unmodified request | Identity-request comparison |
| ----------------------------------------------- | --------------------------- | --------------------------- |
| Nonempty upstream body reads / bytes            | 59 / 414,252                | 280 / 377,874               |
| Active upstream 250-ms windows                  | 7                           | 126                         |
| Largest gap between active upstream windows     | 7,000 ms                    | 750 ms                      |
| Largest body bytes in one 250-ms window         | 66,879                      | 12,816                      |
| SDK nonempty text deltas / JS string characters | 1,295 / 2,036               | 1,177 / 1,845               |
| First body / first SDK text, execution clock    | 11,756 / 11,798 ms          | 5,125 / 5,154 ms            |

For identity, response headers were available at 5,122 ms, last body read at 39,016 ms, body EOF at 39,022 ms and execution completed at 39,057 ms. Last SDK text was at 38,554 ms. SDK text occupied 125 active 250-ms windows, with maximum adjacent-window gap 750 ms. Browser counts matched **1,177 / 1,845**, occupying 126 active text windows with maximum adjacent-window gap 750 ms; first text / first DOM change were 5,185 / 5,196 ms, last text 38,586 ms, finish 39,088 ms and EOF 39,100 ms. Chrome recorded 1,177 nonempty text-length changes, HTTP 200, `Ready`, no stream warning/body-reader failure and zero page errors. The two clocks and response contents differ; window-gap metrics are quantized cadence indicators, not exact maximum socket/delta latency or painted-frame counts.

**Result:** the prior multi-second, roughly 64-KiB burst pattern was absent in this identity comparison; upstream reads, SDK text and Chrome DOM updates were distributed throughout the response. This supports compression negotiation or an associated upstream processing path as a material lead. It is not a controlled proof of gzip as the root cause: the baseline response encoding was not retained, only one call per condition was observed, and provider load/content can vary. No automatic second call or permanent framework-wide identity default was introduced. A provider-scoped compression policy or upstream flush/compression correction is a concrete implementation candidate, not an already-applied fix.

After collection, the temporary observer, async-local selector, request header override and `info` summary were removed. SHA-256 confirmed `src/service/configuration.ts` and `src/service/run.ts` exactly matched their pre-comparison contents. The owned browser closed normally; its development conversation remains. Final verification reran backend typecheck, the native HTTP regression, docs build and scoped format/lint/whitespace checks. No environment change, development reset or commit occurred.

## Approved default-connection compression workaround

On 2026-11-18, the user approved implementing the provider-scoped workaround recommended after the identity comparison. The authored application configuration at `vona/src/backend/config/config/config.ts` now sets only `cabloy-ai.aiProviders.default.options.headers['accept-encoding']` to `identity`. It merges with existing module connection settings rather than copying keys or endpoint values. No suite/factory-wide encoding default, Fetch wrapper, global dispatcher modification, database override or environment change was introduced. This is an application policy for that connection alias, not a claim that all endpoints or factories require identity; reassess it if the connection changes.

The existing OpenAI Responses local Fetch regression now reads the effective application header and verifies forwarding through the installed SDK and invocation facade. It also checks that an explicit trusted per-call `gzip` header overrides the connection policy, that a separately constructed connection receives no encoding policy from the factory, and that strict empty-string SSE validation remains intact. Fixtures intercept every SDK request locally using synthetic responses; no external model request occurred in this implementation increment. The database header allowlist remains unchanged.

Verification completed successfully: managed configuration/native HTTP tests **11 passed, 0 failed**, `npm run tsc:vona` exit 0, `npm run docs:build` exit 0, and scoped formatting/lint plus `git diff --check` passed. Expected negative HTTP assertions produced 409/404/401 logs without test failures. The docs build retained its non-fatal large-chunk warning. The public guide now documents connection ownership, override spelling, bandwidth tradeoffs and normal backend configuration reload/restart. Frontend source and contracts are unchanged, so no frontend rebuild or fresh browser qualification was required; live cadence evidence remains the separately authorized preceding comparison, not a new post-configuration live run. No database reset or commit occurred.

## Approved shared provider/model base configuration

On 2026-11-18, the user requested and approved `base.aiProviders` and `base.aiModels` as reusable module configuration. Both optionally reuse the full existing definition types. The shipped base now owns `enabled: true`, provider `options.headers['accept-encoding']: 'identity'` and model `request.maxRetries: 0`; named entries and test configuration no longer duplicate these defaults. The preceding application's default-connection encoding block was removed. This intentionally broadens the earlier connection-specific policy into an overridable shared Cabloy AI default, without decorating SDK factories or modifying global Fetch.

Provider/model read resolution and save-time effective validation now merge **base → named configuration → stored/replacement override** into fresh objects. Base applies to both configured and database-only aliases, but does not register unknown names; missing aliases retain their existing errors. Saves retain only the supplied sparse document. Base can deliberately share factory/provider/model selectors and trusted connection options, including credentials; no such identity or credential is supplied by the shipped base. Database credential/header guards, active-instance scoping, selected-model-first scene resolution and request-owned invocation snapshots remain intact.

The environment-backed named default now omits unset/empty optional factory, URL, key and model-ID properties, preventing generated `undefined` values from erasing base inheritance; explicit nonempty values and the named model's `provider: 'default'` fallback remain. No environment file was read or modified. Existing merge behavior for explicitly authored `undefined`, array replacement, false and zero remains unchanged.

Focused regressions cover synthetic empty/nonempty environment assembly and managed test substitution; inherited identity/enabled/retry defaults; configured and database-only definitions; base/named/stored precedence; sparse reset; independent snapshots; unknown aliases; instance boundaries; nonmutation; and actual installed OpenAI SDK header forwarding with trusted per-call override. The existing domain/native-stream tests continue covering ownership, durable replay/fencing, cancellation and sanitized failures. All SDK fixture calls are intercepted locally; no live-provider request occurred.

Verification: the three managed configuration/domain/native HTTP files passed **19 tests, 0 failures**; backend `npm run tsc:vona`, public `npm run docs:build`, scoped format/lint and `git diff --check` passed. Expected negative HTTP assertions emitted 409/404/401 logs; docs retained the non-fatal large-chunk warning. The generated guide contains the shared-base and streaming-diagnostics anchors. No frontend contract/source or persistence schema changed, so no frontend rebuild, regeneration or new browser/live qualification was needed. No development reset, process termination, new dependency or Git commit occurred.

## Verification register

| Check                                         | Status  | Evidence                                                                                                                                         |
| --------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Focused managed backend tests                 | Passed  | Final combined run: 17 pass, 0 fail; AI configuration/domain/native HTTP plus shared query-adapter regressions                                   |
| Generated contract and typecheck              | Passed  | Isolated module-local generation and final `npm run tsc` exit 0                                                                                  |
| Affected SSR/REST paired builds and Vona sync | Passed  | Four affected SSR/REST pairs and subsequent `npm run deps:vona` exit 0                                                                           |
| Managed chat browser scenarios                | Passed  | Final scrolling-qualified suite: 3 pass, 0 fail, no retries; incremental text, viewport follow, private SSR reload, Stop and lifecycle           |
| Documentation build and links                 | Passed  | `npm run docs:build` exit 0; local guide/README/spec link targets checked                                                                        |
| Lightweight specification audit               | Passed  | `npm run spec:check -- cabloy-ai --lightweight` exit 0; three delivery definitions; structural evidence only                                     |
| Live-provider interoperability                | Partial | `openai` Responses source-only generate/stream and full browser chat passed; real compatible endpoint and broader capabilities remain unverified |

No development database reset, environment change or commit is part of this increment.

## Chat message viewport follow-bottom behavior

On 2026-11-18, the chat page added controller-local follow-bottom behavior for the existing `ai-chat-messages` viewport. A natural-height inner content wrapper is observed alongside the viewport so streamed text growth and history reconciliation remain visible while the reader is following the latest content. Manual upward scrolling pauses following; returning within the 64-pixel near-bottom tolerance resumes it. Hydration-safe Zova lifecycle registration, stale-element guards, programmatic-scroll event handling, observer replacement and disposal cleanup keep the behavior page-local without changing model, transport, layout or provider configuration.

The existing mock-backed browser acceptance now uses a bounded long prompt to verify actual overflow geometry, live bottom following, manual scroll-up preservation through the next partial response, follow resumption, terminal history transfer and SSR reload positioning. The existing Stop and conversation-switch/disposal scenarios remain unchanged. No real-provider request, environment change, reset or new dependency was used.

Verification completed: `npm run tsc:zova` exit 0; all four affected SSR/REST flavor pairs via `npm run build:zova:all` exit 0; subsequent `npm run deps:vona` exit 0; managed `npm run test:e2e -- cabloy-ai` passed **3 tests, 0 failures**; scoped formatting, lint and `git diff --check` passed. The first browser attempt exposed only a test-fixture trailing-space mismatch in the long prompt, which was corrected before the passing rerun. No commit was created.
