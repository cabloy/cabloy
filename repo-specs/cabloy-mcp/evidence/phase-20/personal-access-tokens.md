# Personal MCP access tokens — bounded delivery

## Scope and attribution

- Date: 2026-11-12; Cabloy Basic on `main`, baseline `18f63fe112` plus the current uncommitted implementation. This is not clean-commit or deployment qualification.
- Target: only `WBS-MCP-20-06`, under the [accepted personal-token disposition](../../decisions/0010-mcp-browser-execution-profile.md#accepted-personal-access-token-disposition-2026-11-12) and [focused test plan](../../test-plan.md#personal-access-token-increment-2026-11-12). Original blocked tasks, full ATPs and release gates are unchanged.
- Execution and keeping `mcp-auth.fileVersion=1` were explicitly approved. New columns and nullable OAuth-client bindings are folded into v1 creation. Managed isolated tests initialize fresh disposable schema; an already-initialized v1 development database does not replay it automatically.
- No development reset, environment-file edit, new worktree, deployment, commit or push was performed. Dependency synchronization was performed through the repository scripts after the paired builds.
- Canonical usage is maintained in the [suite guide](../../../../vona/src/suite-vendor/cabloy-mcp/docs/access-tokens.md), not duplicated here.
- [Source attribution](./artifacts/2026-11-12-18f63fe112-personal-token-source-hashes.json) records SHA-256 for 43 changed source/test/generated/suite-guide/lockfile paths. Specification and evidence prose are outside that manifest. The backend passing run precedes only nonsemantic brace/format corrections; the browser rerun uses the supported native form wrapper correction.

## Delivered behavior

Personal issuance creates a directly active, explicitly personal grant with null OAuth-client bindings, generation one, no refresh credential, and one access JWT signed through the existing `mcpAccess` client. It reuses `/mcp`, current grant/account/auth/provider/role verification, resource/instance binding, exact custom-tool ceilings and ordinary guarded business execution. Existing kind-less OAuth JWTs remain OAuth-only; OAuth management, exchange, refresh, legacy lookup and expiry cleanup cannot operate on personal grants.

The independent Account → Security page lists safe own metadata and active/expired/revoked status, supports schema-backed creation and confirmed deletion, and reveals the secret once. Creation defaults to seven days, permits longer finite safely representable lifetimes without a product maximum, and does not create a permanent credential. Secret-bearing results are not query/mutation cache state or SSR transfer state and are cleared on dialog close, navigation/deactivation, identity change and disposal.

## Executed verification

Artifact basenames use prefix `2026-11-12-18f63fe112-personal-token-` in [artifacts](./artifacts/). Logs use `.txt` so repository ignore rules do not silently discard the referenced evidence. Repository paths are relative; external private paths and ANSI presentation are removed. Path sanitation is not secret scanning or acceptance proof.

| Check | Observed result | Artifact suffix |
| --- | --- | --- |
| Managed isolated `cabloy-mcp` OpenAPI generation | Exit 0; SDK/schema/metadata regenerated from backend truth. | `contract.txt` |
| Root frontend typecheck | Exit 0, including final form wrapper. | `tsc-zova.txt`, `tsc-zova-02.txt` |
| Paired Admin/Web SSR + REST build | Exit 0; both existing affected flavors published through one isolated coordinator invocation. | `build.txt` |
| Backend dependency synchronization | Exit 0. Generated REST dependency versions explain the Vona lockfile changes; Zova lockfile specifiers synchronize existing manifest ranges. | `deps-vona.txt` |
| Root backend typecheck after OAuth fixture narrowing | Exit 0; final synchronized rerun also passed. | `tsc-vona-02.txt`, `tsc-vona-03.txt` |
| Focused managed backend regression, six auth files | **52 passed / 0 failed**, exit 0. Includes seven personal-token cases and neighboring OAuth/grant/custom-scope/Passport/registration coverage. | `backend-02.txt` |
| Public docs build | Exit 0; ordinary chunk-size warning. Suite-local guide is outside VitePress rendering coverage; its relative links were checked separately. | `docs.txt` |
| Lightweight specification audit | Exit 1; 70 definitions parsed and the new verified progress row recognized. All 25 remaining missing-link errors are unchanged baseline defects, not new increment links. | `spec-03.txt`, `spec-final.txt` |
| Credential-safe browser flows | **2 passed / 0 failed**, exit 0: independent Account entry, default seven-day read issuance, actual clipboard copy, secret absence after close/reload/navigation, real MCP discovery/read, delete cancellation/confirmation and rejection; year-long custom token and scope-deletion invalidation. | `e2e-04.txt`; `e2e.txt`, `e2e-02.txt`, `e2e-03.txt` retain failed attempts. |
| Final scoped formatting, source lint and diff whitespace | Exit 0; all changed TypeScript/TSX sources checked with root lint configuration, including the final nonempty scope fixture description. Evidence Markdown is excluded by the existing formatter configuration and was manually checked. | `style-final.txt`, `style-02.txt` |

Commands actually executed:

```bash
npm run contract:generate:isolated -- cabloy-mcp
npm run tsc:zova
npm run build:zova:isolated -- cabloyBasicAdmin cabloyBasicWeb
npm run deps:vona
npm run tsc:vona
npm run test -- -- --ci \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/accessToken.test.ts \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/authorization.test.ts \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/authorizationGrant.test.ts \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/customScope.test.ts \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/passport.test.ts \
  src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/registration.test.ts
npm run docs:build
npm run spec:check -- cabloy-mcp --lightweight
npm run test:e2e -- mcp-access-tokens --reporter=line --trace=off --retries=0
```

Managed tests own their isolated resources and precise fixture cleanup. Successful root-run completion includes the runner's cleanup outcome, not an independent claim of remote resource deletion. Failed runs remain runner-retained rather than being manually reset.

## Retained failures and corrections

- `backend.txt`: initial run **48 passed / 4 failed**. Two old configuration assertions omitted the new default; the personal revoked-retention fixture incorrectly used the intentionally OAuth-only revoke endpoint; the input fixture incorrectly expected ordinary framework numeric-string coercion to fail. Corrected expectations/setup retain positive safe-integer bounds and strict unknown-field validation. The six-file rerun passed 52/52.
- `tsc-vona.txt`: initial root typecheck failed at three OAuth-fixture references after client columns became nullable. Explicit assertions and narrowed local OAuth identities fixed those references; final root typecheck passed.
- `e2e.txt`: initial browser cleanup failures arose from missing `Accept: application/json` on fixture account requests, which negotiated raw GET responses rather than the expected envelope. Aligned with existing helpers and made cleanup attempt every owned resource branch without masking the original failure.
- `e2e-02.txt`: the second browser attempt exposed a missing required custom-scope `description` in the fixture and a create-form locator that did not resolve. The dialog itself was visible, but `ZForm` does not forward arbitrary attributes. A native wrapper through the existing `slotWrapper` API now owns the test ID; both Admin/Web pairs were rebuilt and dependencies synchronized (`build-02.txt`, `deps-vona-02.txt`).
- `e2e-03.txt`: default read-token browser flow passed, but an empty fixture description was normalized away and still failed the existing required field. Replaced it with a nonempty test-owned description, matching established fixtures. `e2e-04.txt` then passed both flows without enabling credential-bearing captures.
- Scoped style checks identified a missing brace around personal-TTL configuration validation, a test-local variable shadowing browser `document`, and two formatting differences. These were corrected; final whole-increment style checks will be recorded after browser corrections stabilize.
- Initial specification preparation had an unparseable WBS dependency line and omitted the formal progress row; both are corrected. The remaining **25** missing-link diagnostics are in two Markdown files byte-identical to `HEAD`: ADR 0008 (one) and the WBS 20-01 execution dossier (24). All 24 distinct target paths are absent from both current files and the committed HEAD tree. This establishes baseline-relative provenance, not whether ignored local logs existed historically. No unrelated historical-link cleanup was performed.

## Lifetime-days presentation follow-up

At the maintainer's request, the creation page now displays **Lifetime (days)** / **有效期（天）**, initially **7**. The existing generated schema and API keep `expiresIn` in seconds; the field converts days to seconds without changing backend expiry policy. The suite guide and existing browser expectations were updated accordingly.

Follow-up artifacts use prefix `2026-11-12-18f63fe112-personal-token-days-` in [artifacts](./artifacts/):

- `tsc.txt`, `style.txt`: frontend typecheck and scoped formatting/lint/diff checks passed.
- `build.txt`, `deps.txt`: both Admin/Web SSR + REST pairs rebuilt through one isolated invocation, then Vona dependencies synchronized; both commands exited 0.
- `e2e.txt`: **2 passed / 0 failed**. The form label and default `7` are asserted; entering `365` still submits `31536000` seconds, with the matching issued deadline. Credential-bearing browser captures remain disabled.
- `docs.txt`: docs build passed; the edited suite guide is outside VitePress rendering coverage.
- [Follow-up source attribution](./artifacts/2026-11-12-18f63fe112-personal-token-days-source-hashes.json) rehashes the original 43-path scope after these checks. The original manifest and logs describe the earlier revision, not the day-input bytes. The account Chinese locale also differs from that earlier snapshot and is included as observed current source, not attributed to the unit-conversion edit.

The backend is unchanged from its passing regression and was not rerun for this presentation-only change. The prior specification-audit baseline failures remain unchanged; no additional audit or release qualification is claimed. Follow-up evidence passed path checking and was inspected for machine-local paths and token-shaped values.

## Shared public-origin follow-up

The maintainer requested that MCP reuse `app.util.getAbsoluteUrl()` and that production requirements belong to the shared `AppUtil` getters. Each getter now rejects its missing effective configured field in production with an ordinary actionable error. Context config still takes precedence over root config; dev/test configured → request → HTTP/localhost fallbacks remain available. MCP retains canonical-origin, HTTPS/explicit loopback-HTTP, resource and instance checks.

The initial follow-up supplied a short-lived anonymous context at raw `/mcp` ingress. The maintainer subsequently rejected that wrapper because `AppUtil` already supports an absent context. The wrapper and its async propagation have now been removed: ingress directly resolves the resource and validates the single incoming Host against it. Without an ambient context, origin resolution uses configured values or the framework's requestless fallback. Metadata still uses the resolved resource as its issuer. Bindings remain exact; `localhost` and `127.0.0.1` are not interchangeable. The artifacts below describe the earlier wrapped revision, not this correction.

This follow-up is attributed to baseline `87f44f9fb374a35949a3f2069e2e98e99f11af69` plus the uncommitted origin diff, not to the earlier personal-token source snapshots. Artifacts use prefix `2026-11-12-87f44f9fb3-public-origin-` in [artifacts](./artifacts/):

- `backend-03.txt`: managed root regression of `application.test.ts`, `mcp-auth/authorization.test.ts`, `mcp-auth/accessToken.test.ts` and `cabloy-mcp/businessHttp.test.ts`: **56 passed / 0 failed**, exit 0. Covers production field requirements and configured-host mismatch, nonproduction fallback, OAuth/personal authorization, raw transports, resource metadata and guarded business execution.
- `tsc.txt`: final `npm run tsc:vona`, exit 0.
- `e2e.txt`: existing credential-safe `mcp-access-tokens` browser flows: **2 passed / 0 failed**, exit 0. Browser issuance and raw admission agree at the explicit local origin. Captures remain disabled. This run precedes only formatting and the final backend-only authority fixture correction.
- `docs.txt`: `npm run docs:build`, exit 0 with the ordinary chunk-size warning. No new navigation or links were introduced in the four affected public pages.
- `style.txt`: scoped formatter, root-config source lint and whitespace checks, exit 0.
- [Source attribution](./artifacts/2026-11-12-87f44f9fb3-public-origin-source-hashes.json): SHA-256 for the 12 affected source/test/docs files and the unchanged browser regression spec; evidence prose/artifacts are outside this manifest.

Failure history is retained rather than presented as passing evidence:

- `tsc-initial.txt`: the first attempt treated the owned context runner as synchronous. Its actual Promise return required async resource resolution and `await` in transport, metadata handler and middleware. Final typecheck passes.
- `backend-initial-stopped.txt`: the pre-`await` run failed raw-transport assertions and stalled during shutdown. Its owned background task was stopped; its process tree was subsequently absent. No successful cleanup or complete test-summary claim is made for this run, and no manual database/Redis cleanup or reset was performed.
- `backend-02.txt`: **55 passed / 1 failed**, exit 1. The unconfigured local-origin fixture still expected an unregistered nonloopback HTTP Host to fail an old configured-host comparison (400); shared fallback instead reaches the retained MCP HTTPS policy (503). The assertion now expects that rejection, and a separate configured production Host mismatch asserts 400. No origin validation or binding was relaxed; the final run passed all 56 cases.

### Removal of the redundant context wrapper

The actual shared endpoint is invoked by `middlewareSystem.mcp` inside the existing system-middleware context. Creating another context for origin resolution was unnecessary. Direct calls without a context are also supported by `AppUtil`. Removed the wrapper and restored synchronous resource/metadata resolution and callers. The public guides now describe the existing-context/requestless behavior rather than synthetic Host/TLS propagation.

Correction artifacts use prefix `2026-11-12-87f44f9fb3-public-origin-noctx-` in [artifacts](./artifacts/): `backend-02.txt` records **56/56 passing**, `tsc.txt` records a passing backend typecheck, `e2e.txt` records **2/2 passing** credential-safe browser flows, and `docs.txt` records a passing docs build. Scoped formatter/lint/diff checks also passed. `backend-initial.txt` retains the initial **55/56** result: changing the unknown-Host expectation to 400 was incorrect because the existing middleware context still supplies that Host to the nonproduction fallback, and MCP's HTTP policy rejects it with 503. Restoring 503 does not require the removed wrapper. The [corrected source manifest](./artifacts/2026-11-12-87f44f9fb3-public-origin-noctx-source-hashes.json) attributes the current revision separately from the earlier wrapped revision.

No frontend source/contract changes, rebuild, schema change, development reset, environment edit, commit or push was performed for this origin follow-up. Successful managed runs report their own completion; failed-run resources remain runner-owned/retained. Earlier specification-audit baseline failures were not rerun or reclassified by these focused checks.

## Remaining boundary

The approved functional increment has passed its focused backend and browser checks. The full lightweight specification command is not clean because of the 25 confirmed baseline missing-link defects above; this is explicitly reported, not treated as a passing audit. Existing initialized v1 databases still need a separately approved migration or disposable-data strategy before using these new columns. No reset, deployment or release advancement follows automatically from this bounded implementation.
