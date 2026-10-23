# Dev shared-listener MCP qualification (2026-10-23)

The original qualification below is historical. [The later correction](#shared-ingress-authority-correction-2026-10-23) supersedes its middleware-mode and shared local-peer/Host/Origin restrictions and supplies current-source proof.

## Authority, revision and scope

The user approved implementation of [ADR 0002's bounded amendment](../decisions/0002-mcp-transport.md#accepted-dev-shared-listener-amendment-2026-10-23), including the preceding correction to socket-style optional instance selection. This is the [WBS-MCP-20-01/30-01/40-01 local contribution](../pdp-wbs.md#approved-dev-shared-listener-contribution-2026-10-23), with prospective procedure in [the test plan](../test-plan.md#dev-shared-listener-proof-2026-10-23). It contributes only partial `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-03` coverage under `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01` and the linked SRS transport/catalog/API/dispatch contracts. Parent tasks remain blocked, full ATPs open and verified **0/12**.

Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, base `47d41c84fef28e704d593b324e0542e8e9385dbd`; clean before this increment, now attributable dirty source. The base alone does not reproduce the result. Changes are limited to the eight module source/registration/test paths fingerprinted below, the existing public guide, six upstream spec records, this evidence/index/progress and derived charts. No framework, Commerce, frontend, dependency, environment, persistence, version or seed delta. No manual reset, shared dev startup, process takeover, real AI call, commit or push.

CLI generation actually completed with exit 0:

```sh
npm run vona :create:bean middlewareSystem mcp -- --module=mcp-test
npm run vona :init:monkey mcp-test
npm run vona :tools:metadata mcp-test
npm run vona :create:test devHttp -- --module=mcp-test
```

The generated registration remains generator-owned. Middleware metadata restricts automatic activation to `dev` and `test`; production exclusion is source/configuration inspection, not a production deployment test. It intercepts only `/mcp` before ordinary logging/instance middleware and delegates other paths. Business/DTO imports are deferred until the application is configured. The standalone listener delegates to the same extracted exchange owner but retains its managed identity checks, fixed default scope and separate listener lifecycle.

## Observed managed HTTP results

Both commands use the root isolated runner: run-specific disposable SQLite/Redis/runtime/listener resources, concurrent runner default, suite-local `{ concurrency: false }`, synthetic immutable catalog, Commerce excluded. Actual HTTP requests own separate framework request/executor scopes; no global origin/proxy mutation or separate test application/listener. The local lock coordinates the existing test-owned service interception. No business records are persisted by these tests.

```sh
PROJECT_DISABLED_SUITES=a-commerce npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts

PROJECT_DISABLED_SUITES=a-commerce SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/catalog.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/config.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
```

Final same-listener run: **exit 0, 4 passed / 0 failed / 0 cancelled / 0 skipped**, graceful application shutdown. Retained result projection:

```text
PASS shares discovery, modern/legacy three-tool flows and ordinary catalog routes on one listener
PASS uses optional instanceName and framework query/header fallback without leaking default fixture data
PASS rejects unsafe local ingress and releases a cancelled exchange without closing the listener
PASS drains actual app-owned tool work without closing the shared listener
```

Assertions prove:

- Native modern discovery and legacy initialization; exactly the unchanged three tools. Both protocol paths complete category → returned category ID → search → returned product ID → detail with structured/text equivalence, matching IDs, price 9999 cents and available 11.
- Absent/empty explicit selector uses framework resolution; explicit `shareTest`, configured query/header resolution and empty explicit selector plus header fallback return an empty category list. A default product ID yields the existing safe not-found tool result in the foreign instance. Unknown explicit instance is rejected with 423; framework null scope with 403; subsequent default reads still work. This is fixture ownership, not persisted ORM tenant-isolation proof.
- Invalid Host/Origin, credentials and unknown/duplicate query controls are denied. Duplicate configured instance headers are rejected with 400 and an over-limit configured header with 431 **before** removing it from the normalized ingress-check copy. Original request remains available to the framework resolver. Existing pure ingress tests cover nonlocal-peer and forwarding/override denial; no remote-machine HTTP probe was run.
- Partial-body disconnect releases the receive slot only after settlement; overlap receives 429, with no queue. A real `ServiceCatalog.selectPublic` operation is held by a test-owned barrier, then MCP close returns a rejection/cancellation signal but remains unresolved with active work until the barrier releases and the real read finishes. Test interception is restored in `finally`. Afterwards admission is 503, while the ordinary catalog route still returns 200 and the shared listener remains open. The monkey's application-close hook calls this idempotent drain; final managed application shutdown also succeeds.

Separate standalone/business/config/guard regression: **exit 0, 41 passed / 0 failed / 0 cancelled / 0 skipped**, graceful application shutdown. This includes retained modern/legacy argument/projection/instance behavior, actual receive and execution deadlines, held-work cancellation/drain, output bound, isolated-launcher identity restrictions and pure ingress limits. These shared-business bytes remained unchanged through final same-listener qualification; later changes were dev-ingress checks and its test only.

## Canonical standalone launcher and native client

Executed the unchanged root command as a child of a temporary inline Node client procedure:

```sh
npm run mcp:test:local -- --seconds 60
```

Read installed native SDK 1.29.0 declarations/implementation before using `new Client(info, { capabilities })`, `new StreamableHTTPClientTransport(new URL(url))`, `await client.connect(transport)`, `listTools()`, `callTool({ name, arguments })`, and `await client.close()`. Capabilities included roots/listChanged, sampling and elicitation. The client extracted only the allocated loopback URL from the readiness message, listed exactly the three tools, traversed categories → returned Electronics ID → category-filtered search → returned product ID → matching detail, and asserted structured/text equivalence on all three calls. Local schema references resolved without Commerce schema identifiers. No real AI/model call or credential configuration.

The client closed before normal TTL expiry; the parent awaited the root process without termination or takeover. Observed minimized outcome:

```json
{"launcherExit":0,"signal":null,"graceful":true,"cleanupFailure":false,"tools":3,"journeyPassed":true,"structuredTextEquivalent":true,"readyToRootExitMs":63055}
```

Total procedure elapsed 75627 ms. The serving window was 60 seconds; ready-to-root-exit includes application shutdown and managed runner completion. Root exit 0 and graceful shutdown were observed, not exhaustive independent inspection of every disposable resource. The compatibility alias still references the identical root launcher; no separate alias process was started. Module-local SDK resolution initially returned `MODULE_NOT_FOUND`; the procedure located the already installed 1.29.0 root pnpm-store ESM files after checking their API, without installation or dependency changes. Both launcher streams passed the repository sanitizer in memory before minimized inspection; no raw runtime dump or disposable probe is retained.

## Failures and corrections retained

1. Initial same-listener run: exit 1, **2 passed / 1 failed**. Ordinary catalog assertion returned `404 !== 200`; the test omitted the configured global API prefix. Corrected the test URL to `${app.config.server.globalPrefix}/mcp/test/catalog/categories`, without changing router behavior. Runner retained claim `vona/.vona-test-claim/20261023124022-bab1af6f.json`; no manual cleanup. Subsequent intermediate run passed 4/4.
2. The added configured-header regression initially failed module semantics with `TS2464` at test lines 243 and 253: optional configured header used as a computed property. Added an explicit `assert.ok(instanceHeader)` narrowing. No runtime pass is inferred from this failed static attempt. Corrected semantics/style and intermediate HTTP run passed.
3. The added foreign-detail check initially failed **3 passed / 1 failed**, exit 1: exact whole-result comparison omitted modern SDK `_meta` and `resultType: 'complete'`. Corrected assertions to verify `isError`, safe content and absent structured product, preserving SDK metadata. Held real-work drain already passed in that run. Runner retained claim `vona/.vona-test-claim/20261023125028-971c557e.json`; no manual cleanup. Final run above passed 4/4.

Intentional truncated-body disconnect can emit the shared Node parser's `HPE_INVALID_EOF_STATE` diagnostic. Tests still observe actual settlement and graceful shutdown; the shared server's parser/error settings were not changed to suppress it. SDK JSON-mode notification warnings are not evidence of notification/stream support. Raw local logs are not durable acceptance artifacts; this minimized record retains observed failures, outcomes and scope without machine-local paths or request/credential dumps.

## Scoped static and documentation checks

Final module semantics exited 0:

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/mcp-test/tsconfig.json
```

`oxfmt --check` and `oxlint --disable-nested-config` exited 0 on exactly the six authored changed TypeScript paths below (excluding generator-owned metadata). `git diff --check` passed at the source checkpoint. No full-monorepo typecheck or broad review was substituted for module verification.

`npm run docs:build` exited 0, client/server bundles and all pages rendered. It reported a chunk-size warning above 500 kB, not a failed build. The existing guide's navigation target remains unchanged; its new development section distinguishes the effective shared listener URL and optional scope from the allocated standalone URL/TTL. No new ordinary dev-server or real-AI-client evidence is claimed.

## Final source fingerprints

SHA-256 of original source bytes; all paths repository-relative. The connected-source digest is SHA-256 over lexically sorted records `path + NUL + file bytes + NUL`, for these eight paths only: `acd982dd270640d4cbb3d94e4b76afdb03a9327815635c0023c589a164334d5d`.

| Path | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/package.json` | `045c4ab151700dd9212ef54b1c35983fc73c1b4250a827bb75b45b3774899c5e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/.metadata/index.ts` | `c54ddebdaa87d7185102f25b126626e19309e08826db25544a3a5548cfb2a699` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/bean/middlewareSystem.mcp.ts` | `f385d669281053588cc43f55c776a72acfaea26c0634469c3335a9809e53c228` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/monkey.ts` | `30ec2168bd633de2f85e80107cf8a1809cee1eac382c63f03afecf6121680377` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/businessTransport.ts` | `58fc84977de9d2482c41644dfc536037b57804ac8993a22e3389d053e926d96e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/devTransport.ts` | `b9a9a169ea013c9654585119aa2e85eb3d104dc8c73eab67295252b4d64af8db` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/localTransport.ts` | `68f15fc476381827bfc5c20f23720ecbf0f5fb31a9192b6937f33a00419182e2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | `264a25f01814e32624f26b339d87ff65e4ecc633a92271a80ca3367a983d96c4` |

## Documentary closure checks

`npm run spec:check -- cabloy-mcp` exited 0: complete planning structure and exact-ID chain, 68 definitions. `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` exited 0; both English derived charts remain 0/12 verified. These are structure/freshness checks, not new design acceptance or full ATP proof.

`npm run evidence:check -- -- repo-specs/cabloy-mcp/evidence/dev-shared-listener.md` exited 0 under the tool's supported path coverage. This authored minimized record uses repository-relative paths; manual inspection found no credential, customer/payment data or machine-local path retained. Path checking is not secret scanning or acceptance proof. An attempted `oxfmt --write` on this evidence Markdown exited 2 because repository ignore rules exclude it; no formatting was performed and the chained checks did not run in that attempt. They were then run separately with the passing results above. Authored TypeScript format/lint results remain separately scoped. Final whitespace inspection uses `git diff --check`.

This qualifies only the named local/dev contribution, not production host/token binding, OAuth, registry, full system ingress or release. Historical independent real-client evidence remains historically scoped, not transferred to the shared listener. Next action is to use the existing-listener public walkthrough; no additional feature or runtime call is automatically authorized.

## Shared-ingress authority correction (2026-10-23)

The user subsequently requested removal of middleware `mode` while retaining dev/test-only `mcp-test`, then removal of the shared entry's local-source restriction because business APIs own authorization. [The accepted superseding amendment](../decisions/0002-mcp-transport.md#accepted-shared-ingress-authority-simplification-2026-10-23) and [proof amendment](../test-plan.md#superseding-shared-ingress-proof-amendment-2026-10-23) govern this correction. Base remains `47d41c84fef28e704d593b324e0542e8e9385dbd` plus attributable dirty source. Original mode/locality assertions and fingerprints above remain historical, not current-byte proof.

The shared entry no longer reads the socket peer or imposes a local Host/Origin allowlist. `checkProtocolIngress` checks genuine raw headers without fabricated loopback metadata; the configured framework instance header is allowed as a bounded singleton. The same implementation's `checkFixtureIngress` wrapper retains the standalone peer/exact Host/Origin/selector policy and denial precedence. The standalone adapter, business exchange, generated registration, monkey and module manifest are unchanged since original qualification. Module-level dev/test inclusion remains; middleware has no separate mode gate. Fixed action dispatch retains `innerAccess: false`; current catalog reads remain explicitly public and anonymous. No client credential forwarding/authentication, OAuth, CORS, proxy trust, listener/firewall/port change, production activation or deployment is added. Credential/cookie/forwarding rejection, protocol/framing/body/output bounds, one-active/no-queue, deadlines and actual-work/context/app-close ownership remain.

### Current managed results and retained failure

Executed through the root isolated runner, Commerce excluded, suite-local sequential execution and concurrent runner default:

```sh
PROJECT_DISABLED_SUITES=a-commerce npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts

PROJECT_DISABLED_SUITES=a-commerce SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
```

First changed-policy same-listener attempt: **exit 1, 3 passed / 1 failed**. `dev.example.test` was admitted by the new ingress but normal framework host resolution selected unconfigured instance `dev`, returning `423 !== 200`. The test had conflated ingress authority with instance validity. Corrected only this test's accepted Host/Origin requests to explicitly select existing `shareTest`; default/framework resolution tests remain unchanged. Failed claim `vona/.vona-test-claim/20261023132138-8081f0c4.json` and resources were retained by the runner, without manual cleanup. An accepted Host does not bypass ordinary instance admission.

Final same-listener run: **exit 0, 4 passed / 0 failed / 0 cancelled / 0 skipped**, graceful application shutdown:

```text
PASS shares discovery, modern/legacy three-tool flows and ordinary catalog routes on one listener
PASS uses optional instanceName and framework query/header fallback without leaking default fixture data
PASS allows nonlocal authority while retaining protocol guards and cancellation ownership
PASS drains actual app-owned tool work without closing the shared listener
```

Real HTTP accepted a nonlocal Host, unrelated HTTPS Origin, and their combination, with explicit configured instance scope. It retained forwarding/credential/query/duplicate-header/size denials, cancellation capacity and held real-service drain assertions. All sockets physically used the managed local listener; no remote-machine network probe, ordinary dev-server run or new real-AI-client proof is claimed. Source no longer checks peer locality. Normal host-based instance resolution is deliberately unchanged. The intentional truncated request still emitted `HPE_INVALID_EOF_STATE`; actual settlement and graceful shutdown passed without changing the shared parser.

Standalone HTTP plus common/strict ingress regression: **exit 0, 15 passed / 0 failed / 0 cancelled / 0 skipped**, graceful shutdown. Includes retained standalone modern/legacy returned-ID business flow, selector/authority restrictions, deadlines/output/cancellation/drain and exact guard bounds. New common-check regression accepts nonlocal Host/Origin plus configured instance header while strict fixture ingress rejects nonloopback policy; credential/forwarding/duplicate-instance/override/header-size/method denials remain. No fresh standalone native-client/TTL launch was run for this correction; its source is unchanged and the prior native-client proof remains separately historical.

### Current static and documentation checks

Both affected module native no-emit typechecks exited 0:

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/mcp-test/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

The five changed TypeScript paths (`cabloy-mcp` index/ingress/guard test and `mcp-test` dev ingress/HTTP test) were formatted and exact-path `oxlint --disable-nested-config` passed. After the sole HTTP-test correction, its `oxfmt --check`, exact-path lint and `mcp-test` native semantics passed again. Original middleware-mode removal had a separate passing format/whitespace check. No broader review or full-monorepo verification is claimed.

Final `npm run docs:build` exited 0 after adding the observed Host-to-instance clarification; client/server bundles and all pages rendered, with only the existing >500 kB chunk warning. `npm run spec:check -- cabloy-mcp` exited 0 (68 definitions); `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` exited 0 (English, 0/12 verified). `npm run evidence:check -- -- repo-specs/cabloy-mcp/evidence/dev-shared-listener.md` and `git diff --check` exited 0. These are separately scoped build/structure/freshness/path/whitespace checks, not authentication or acceptance proof. Manual inspection of this minimized amendment retains only repository-relative locations, synthetic test values, actual failures/exits and original source hashes, with no credentials or real customer/payment data.

### Correction source fingerprints

SHA-256 identifies original current bytes, with repository-relative paths. Connected-source digest uses the same sorted `path + NUL + file bytes + NUL` convention over the following eleven paths: `ad18dff71011c4e15acb682a61fd30b93bcb71c079766a8603d229c5e4fd4ad6`.

| Path | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/index.ts` | `d46bff870795fb6402cd65a8745e6ae1d9ef0288e2def49f6778bdee463c952b` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/transportIngress.ts` | `dc6220f83bc9ac9ea5e53121b5c239516eeb22f8fe3079298baf49a09ee17fde` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts` | `1ee424d2a3bd5493e0d3a2a152494464517a1e4df973a26df1d5fd2c459830dd` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/package.json` | `045c4ab151700dd9212ef54b1c35983fc73c1b4250a827bb75b45b3774899c5e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/.metadata/index.ts` | `c54ddebdaa87d7185102f25b126626e19309e08826db25544a3a5548cfb2a699` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/bean/middlewareSystem.mcp.ts` | `cce89314f7296409c42d8acea5e968d33c41b6279a66d75c23f375d36d38aeb2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/businessTransport.ts` | `58fc84977de9d2482c41644dfc536037b57804ac8993a22e3389d053e926d96e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/devTransport.ts` | `91da09010774eaf699f68b29f4a904d6a445782bd1a5569ebcc91a1c2f5de61f` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/localTransport.ts` | `68f15fc476381827bfc5c20f23720ecbf0f5fb31a9192b6937f33a00419182e2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/monkey.ts` | `30ec2168bd633de2f85e80107cf8a1809cee1eac382c63f03afecf6121680377` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | `2679ec9c4dca77680e63a3d4d520703c401ccadb7ce2d6b9bd1fbe00cb2e6615` |

This qualifies only the approved shared-ingress correction. Parent WBS rows remain blocked, full ATPs open and verified 0/12; no production or protected-action authentication acceptance follows.
