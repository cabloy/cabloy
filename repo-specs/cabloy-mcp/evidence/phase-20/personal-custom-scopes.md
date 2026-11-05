# Personal custom MCP scopes — bounded delivery

## Scope and attribution

- Date: 2026-11-04; Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, baseline `b59ffc1cfc` plus the current feature's uncommitted changes. This is not a clean-commit qualification.
- Target: `WBS-MCP-20-05` and only the personal-scope subsets of `ATP-MCP-AUTH-01/02/03`, `ATP-MCP-CALL-02`, `ATP-MCP-INSTANCE-01` and `ATP-MCP-CONTRACT-01` under the [accepted ADR 0010 disposition](../../decisions/0010-mcp-browser-execution-profile.md#accepted-personal-custom-scope-disposition-2026-11-04).
- The user approved the connected implementation and verification and explicitly selected keeping `mcp-auth.fileVersion: 1`. New tables/fields are folded into v1 creation. Managed isolated tests create their disposable schema; existing initialized v1 development databases are not upgraded by this change.
- No development reset, init, reinstall, environment/port edit, deployment, provider operation, commit or push was performed. Broader blocked parents, full ATPs and release gates are not closed by this record.
- [Final source attribution](./artifacts/2026-11-04-b59ffc1c-custom-scope-source-hashes-final.json) retains original-byte hashes for 51 affected source/test/config/guide paths and the tracked source diff digest. [Earlier diagnostic attribution](./artifacts/2026-11-04-b59ffc1c-custom-scope-source-hashes.json) remains historical: only `mcp-auth/src/service/customScope.ts` changed afterward, adding the bounded transaction retry. Final runtime, repetitions, typecheck, style and browser proof use the final bytes; all 51 hashes were rechecked unchanged after those runs. Specifications, evidence and derived charts are outside that source manifest.

## Delivered behavior

Personal CRUD uses the authenticated caller's explicit user ID and ordinary active-instance Model scope. Definitions have stable random `mcp:custom:<id>` identifiers and nonempty exact `{ name, controller, action }` tool bindings. The picker uses the existing compiled, permission-visible business catalog, not a parallel tool registry.

Consent shows the original request and one effective all/read/custom choice. The server independently checks both requested and registered-client ceilings. Grants retain original and effective scopes, exact custom bindings and any read-only ceiling. Tokens report actual granted scope. Listing and known-name direct calls share the exact compiler gate; current Action authorization remains independent and uses `innerAccess: false`.

Refresh inherits or narrows without absorbing additional tools. Tool-set edits/deletion revoke linked code/access/refresh grants; name/description edits preserve them. The definition/linkage transaction and immutable grant snapshot protect concurrent authorization and later runtime resolution. Private frontend queries remain model-owned, nonpersisted, nondehydrated and post-hydration.

## Final bounded verification

All artifact basenames below have prefix `2026-11-04-b59ffc1c-custom-scope-` in [artifacts](./artifacts/).

| Check | Observed result | Artifact suffix |
| --- | --- | --- |
| Isolated OpenAPI generation for `cabloy-mcp` | Exit 0; generated API/schema/metadata consumers are present. The wrapper log contains only its banner, not a detailed lifecycle transcript. | `contract.log` |
| Root frontend typecheck | Exit 0. | `tsc-zova.log` |
| Final root backend typecheck after transaction retry correction | Exit 0; supersedes the pre-retry `tsc-vona-03.log` applicability. | `tsc-vona-04.log` |
| Affected 51-path format, TypeScript/TSX lint and `git diff --check` | All exit 0. Evidence Markdown is excluded by the existing formatter configuration and maintained manually, not claimed as formatter-covered. | `style-final.log` |
| Admin paired SSR/REST build | Exit 0. | `build-admin-sanitized.log` |
| Web paired SSR/REST build | Exit 0. | `build-web-sanitized.log` |
| Backend dependency synchronization after both builds | Exit 0. | `deps-sanitized.log` |
| Public docs build | Exit 0; chunk-size warning remains. The existing suite-local MCP guide is outside the VitePress build's rendering scope, so this is not rendering proof for that guide. | `docs-sanitized.log` |
| Focused browser authorization/scope flows, rerun after backend correction | **11 passed**, exit 0: three new personal-scope scenarios and eight existing all/read/login-recovery regressions. Earlier `e2e-03-sanitized.log` is retained as pre-retry proof. | `e2e-04.log` |
| Focused managed backend/compiler/auth regression | **83 passed / 0 failed**, exit 0 on corrected frozen source. | `runtime-09.log` |
| Finite fresh managed personal-scope repetitions | Three invocations, each **4 passed / 0 failed**, exit 0; each retains the original both-success contention and no-stale-grant assertions. This is bounded regression evidence, not an exhaustive schedule proof. | `runtime-10.log`, `runtime-11.log`, `runtime-12.log` |
| Final specification authority audit | Exit 0; 69 definitions, complete exact-ID chain. Static structure only, not runtime/approval proof. | `spec-final.log` |
| Derived English implementation charts | Generation and freshness check both exit 0; expanded register is 1/13 verified. | `charts-final.log`, `charts-check-final.log` |

The final browser run covers personal create/edit/delete persistence after reload; all-to-custom consent and actual token/grant scope; allowed read and rejected excluded direct call; disabled write-custom under a read request; forged selection rejection without consuming pending consent; and retained SSR/login-recovery checks. The intentional forged decision logs HTTP 400. An asset request aborted during navigation also logs a premature-close diagnostic; all 11 browser assertions, including collected browser/hydration-error assertions, passed.

The backend selection is exactly these seven files, each under `src/suite/cabloy-mcp/modules/`:

```text
mcp-test/test/businessTools.test.ts
cabloy-mcp/test/businessHttp.test.ts
mcp-auth/test/authorization.test.ts
mcp-auth/test/authorizationGrant.test.ts
mcp-auth/test/registration.test.ts
mcp-auth/test/passport.test.ts
mcp-auth/test/customScope.test.ts
```

Commands actually used:

```bash
npm run contract:generate:isolated -- cabloy-mcp --skip-expired-claim-reaping
npm run test -- -- --ci --skip-expired-claim-reaping <the seven explicit paths above>
npm run tsc:vona
npm run tsc:zova
npm run build:zova:admin
npm run build:zova:web
npm run deps:vona
npm run docs:build
npm run test:e2e -- mcp-authorization --skip-expired-claim-reaping \
  '--grep=MCP personal custom scopes:|MCP browser authorization: (omitted scope|explicit mcp:read)|MCP browser authorization recovery:' \
  --reporter=line --trace=off --retries=0
```

The test-path placeholder is explanatory, not a runnable literal. All managed invocations used run-specific resources, not the development database. Test-owned persisted fixtures are precisely cleaned in `finally`; failed managed runs remain runner-retained rather than manually reset. Successful producer completion does not independently attest remote resource deletion.

## Failures retained and corrections

- `runtime-01-plain.log`: 25 compiler tests passed; 19 HTTP cases were cancelled after before-hook failure. New raw SQL updates attempted to bind an array/boolean directly to SQLite. Raw JSON/boolean writes are now explicitly serialized. The same startup exposed a duplicate helper-generated index name; the second composite index now starts with `requestedScope`, giving it a distinct name.
- `tsc-vona-01.log`: exit 1, nine stale generic CRUD scaffold-test errors. Replaced with four connected real-login/catalog personal-scope tests. Later root typechecks pass.
- `runtime-02.log`: 43 passed / 1 failed. The new personal HTTP helper omitted the normal API prefix and received catalog HTTP 404.
- `e2e-01-sanitized.log`: eight existing regressions passed; three new cases failed at creation because a lint auto-fix produced iterator/set `.toSorted()`. Explicit `Array.from(...).toSorted()` fixes both unsupported receiver forms without changing subset semantics.
- `runtime-03.log`: 81 passed / 2 failed. All four personal auth/scope tests passed, including approval/edit contention. The HTTP helper prefix and an older bulk-insert test fixture lacking the new non-null grant fields were then corrected.
- `e2e-02-sanitized.log`: nine passed / two failed only on expected error-message spelling. The public transport intentionally normalizes internal `Tool unavailable` to `Invalid params` for code `-32602`. Tests now assert that existing safe HTTP contract, preserving status/code and denial checks; runtime gate was not weakened.
- `runtime-04.log`: 82 passed / one failed. The concurrent edit rejected instead of fulfilling in the contention case. The test was amended only to surface the original settled rejection; both operations must still succeed and stale grants must still be revoked.
- `runtime-05-diagnostic.log`, `runtime-06-diagnostic.log`, `runtime-07-diagnostic.log`: each four passed. `runtime-08-diagnostic.log`: three passed / one failed, exposing `SQLITE_BUSY` on the pending-to-code-ready update. Passing earlier attempts did not close this intermittent defect.
- Correction: only rollback-safe definition update/delete/linking transactions use `@Core.retryable` with explicit `SQLITE_BUSY` / `SQLITE_BUSY_SNAPSHOT`, three retries, 10–50 ms backoff and `ownerOnly: true`. Retry is closest to the method so it wraps complete transaction rollback/reacquisition/revalidation. Token issuance/credential release, business Actions and external effects are not retried. Corrected `runtime-09.log` passed 83/83; the finite three fresh repetitions passed 4/4 each and browser rerun passed 11/11. No assertion was weakened.
- One final evidence-check invocation omitted the second `--` required to forward the checker separator through npm and exited 2 (`INVALID_USAGE`); the corrected, explicitly scoped invocation exited 0. This command-line failure is not a data finding or acceptance pass.

## Evidence handling and current boundary

Capture pipelines retained producer, ANSI-projection and sanitizer exit statuses separately. Final backend/repetition/browser pipelines reported producer, ANSI-projection and sanitizer exits all 0; backend typecheck and documentary pipelines reported producer/sanitizer exits both 0. Final `evidence:check` passed for the two delivery/index records and 30 explicitly selected artifact logs/manifests, including all final proof and shareable failure projections. Sixteen local file link targets across this record and the suite guide resolved; anchor rendering is not claimed. ANSI removal and explicit substitutions for an escaped checkout-regex selector and external package-store path are presentation-only; original failures, counts and exit codes are retained. Raw earlier local captures are not the shareable projections. The sanitizer is bounded path recognition, not secret scanning or acceptance proof; manual inspection of the selected logs found no raw access/refresh credentials or client secrets. Synthetic fixture identities/digests and local loopback test origins are not deployment identifiers.

The connected `WBS-MCP-20-05` increment's applicable bounded checks pass with retained dirty-source attribution. Its derived status is `verified` for this personal-scope increment only. The original twelve WBS tasks still have zero verified tasks; this added task contributes one verified task to the expanded thirteen-task register. Full ATPs, unrelated blocked parents, actual external-client/deployment proof and release approval remain open. Generation/builds predate only the backend retry correction, which changes neither API/schema nor frontend assets; the final backend and browser runs cover that correction.
