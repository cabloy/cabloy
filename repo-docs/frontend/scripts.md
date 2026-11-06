# Frontend Scripts

This guide explains the main Zova script workflows in the Cabloy monorepo.

## Shared rule

Zova can build `SSR`, `SPA`, `Web`, and `Admin` modes in one codebase. In Cabloy, contributors should usually start from the root scripts first, then drop into `zova/package.json` only when they need edition-specific detail.

## Detect the edition first

Before choosing script examples, detect whether you are working in Cabloy Basic or Cabloy Start.

A practical rule is:

1. detect the edition first
2. then choose the correct script, flavor, and appMode path
3. only then document or automate edition-specific frontend examples

For the edition-detection workflow, see [Cabloy Editions: For AI Development](/editions/overview#for-ai-development).

## Cabloy Basic root wrappers

Cabloy Basic exposes these default Web and Admin wrappers:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
```

They map to the `cabloyBasicAdmin` and `cabloyBasicWeb` flavors. Basic also includes the Commerce aggregate-and-surface wrappers:

```bash
# Customer Web or Operator Admin development server
npm run dev:zova:commerce:web
npm run dev:zova:commerce:admin

# Both Commerce SSR/REST artifact pairs, or one surface only
npm run build:zova:commerce
npm run build:zova:commerce:web
npm run build:zova:commerce:admin
```

`npm run build:zova:all` sequentially runs the focused Basic and Commerce batch builds. `npm run init` uses it to prepare every shipped Cabloy Basic SSR/REST flavor before Vona is initialized. For normal frontend work, continue to use `build:zova` or `build:zova:commerce` when only that suite's artifacts changed.

## Zova standalone SSR development

The `dev:zova:*` commands start the Zova development server, which uses `9000` in the Cabloy Basic default environment. Use this Zova standalone SSR entry for page, route, and hydration iteration. It may be used as Vona's development proxy target, but direct access to `9000` does not prove the Vona request boundary or integrated acceptance.

## Click-to-source inspection in Cabloy Basic and Cabloy Start

Cabloy Basic and Cabloy Start enable `code-inspector-plugin` in Zova development builds. In the active edition's repository, start either `npm run dev:zova:admin` or `npm run dev:zova:web`, then open the corresponding Zova standalone SSR page. The wrappers select `cabloyBasicAdmin` / `cabloyBasicWeb` in Basic and `cabloyStartAdmin` / `cabloyStartWeb` in Start. Admin and Web share the worktree's development ports; run them sequentially, not concurrently.

Hold **Option+Shift** on macOS or **Alt+Shift** on Windows/Linux, move over an element, and click to open its authored TSX location. This works with TSX in Controllers and split Render beans; it does not require converting them into Vue SFCs. Fragments have no independent DOM node. In both editions, instrumentation skips PascalCase and member-expression component tags and retains their native TSX descendants. This avoids passing inspector attributes to wrappers such as `ClientOnly` and `VDefaultsProvider` that have no inheritable DOM root; component invocation tags are not direct location targets.

The application configuration in `zova/quasar.config.ts` uses the browser URI handler `vscode://file/{file}:{line}:{column}`. VS Code must be installed and registered for that scheme; the browser may ask for permission to open it. To use another compatible editor, change `behavior.target` to its supported URI scheme. Actual editor opening depends on that local browser/OS setup.

The integration closes the plugin's auxiliary server (`server: 'close'`) and disables its server-based locate action (`behavior.locate: false`), so source navigation adds no inspector listener. AI features are not enabled. Source locations use absolute local paths in development; do not publish development HTML or bundles. Production builds do not register the inspector or include its injected source attributes/client code.

Quasar SSR uses an explicitly resolved client entry for the inspector UI, while source attributes are generated for both development SSR and client renders. Console-warning suppression is disabled so hydration diagnostics remain visible. The dependency belongs in the authored `zova/package.original.json`; the workspace manifest is generated. Its optional terminal dependency's build script is explicitly disabled in `zova/pnpm-workspace.yaml` because source inspection does not require a native terminal.

## Proportionate frontend verification

For frontend changes, prefer a few critical user flows through the existing E2E infrastructure, together with relevant lightweight format, lint, and type checks. Select scenarios by the behavior being changed rather than running every spec or building exhaustive isolated-test matrices. Reuse the edition-aware preparation and spec/tag/`--grep` filtering below; prepare only the affected artifacts when they have changed.

Do not introduce custom source-evaluation loaders or extensive fake dependencies by default for ordinary page interactions. When an actual problem is fixed, add a focused regression test that reproduces it. Targeted unit and framework tests remain useful when they provide direct, low-cost proof; comprehensive upfront coverage is not a delivery prerequisite.

This preference does not relax applicable SSR/hydration, authentication, authorization, contract, or acceptance requirements, and UI coverage never replaces server-side enforcement. Managed E2E resource isolation remains required. If runtime verification is unavailable or not authorized, report the gap rather than adding substitute test machinery; live Provider and destructive operations retain their separate authorization boundaries.

### Wait for SSR interaction readiness

SSR HTML can make a control visible and enabled before its client event handlers are ready. Playwright actionability checks and a fulfilled `click()` do not independently prove that those handlers were attached or that a business callback ran. Before an interaction that depends on client behavior, wait for the current document's public readiness signal, then any required page-specific conditions.

During initial SSR hydration, Zova sets `data-zova-hydrated` on `<html>` from `onHydrated(...)`; its value is the active flavor's `SITE_ID`, not a boolean. For an SSR document, use the expected site ID from the target site's contract:

```ts
await page.goto(path, { waitUntil: 'load' });
await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', siteId);
// Check required visible page state before the client interaction.
```

Apply this boundary on initial SSR entry and after a full-document navigation or reload. A document `load` event or the expected URL alone does not establish hydration readiness. The marker covers the initial SSR root and currently tracked nested hydration boundaries, not every later asynchronous component or operation; see [Initial hydration completion](/frontend/ssr-overview#initial-hydration-completion).

For same-document SPA navigation, the existing marker may remain present: waiting for it again does not prove that the destination route is ready. Wait for the destination's public, observable conditions, such as required data and action eligibility. Hydration completion is separate from route admission, authentication, data freshness, and business readiness; it is not an SPA-startup signal. Do not add this wait mechanically before every click, or replace readiness with fixed sleeps, forced or repeated clicks, or Controller/IoC probes. After the action, still assert the relevant response and visible business outcome. A passing test after adding a wait supports the synchronization correction; it does not by itself prove the cause of earlier failures.

### Attribute failures and keep diagnostics focused

Business E2E should observe normal user actions, visible business outcomes, and persistence after save/reload. Do not make ordinary business journeys depend on DOM-to-Controller/IoC instance lookup, temporary method wrappers, or Query/cache internals. Internal assertions belong to an explicit architecture/framework acceptance contract or a focused regression, preferably at the smallest suitable test layer.

First identify where verification stopped: test preparation/observation, user interaction, request/response, or business-result assertions. A failed test-side probe does not establish a defect in the page Controller; conversely, a timeout alone does not prove the test mechanism is wrong. Separate observed facts, possible causes, and what remains unproved:

- A completed browser `click()` is not proof that the business asynchronous action completed.
- No matching request observed within a wait window does not prove that the callback never ran or that an eligibility guard rejected it. Check the observation boundary before drawing that conclusion.
- A source branch or a correctly connected action chain does not establish its runtime disposition or passing acceptance.

Before adding diagnostics or repeating a failed attempt, name the concrete hypothesis, the smallest check that distinguishes it from alternatives, and the expected new information. Prefer existing user-visible output and request/response observations; register relevant waits before the action and do not filter out error responses when diagnosing whether a response occurred. Narrow or reject the hypothesis from the result rather than repeatedly extending an internal probe that fails before the target behavior. Keep diagnostic output minimal and redacted; do not collect raw credentials, headers, bodies, or private framework state by default.

Do not force clicks, bypass the UI with a direct API call, remove eligibility/security guards, weaken business assertions, or increase timeouts merely to make the scenario pass. A timeout change needs evidence of the actual readiness or duration contract. Preserve required checks and report the remaining evidence gap when no justified next check is available. Diagnostic value does not authorize retries, private-artifact access, cleanup, or external operations outside the approved scope.

### Check HTTP response contracts

In Cabloy Basic and Cabloy Start, distinguish raw HTTP calls made through Playwright's `APIRequestContext` from helpers or transports that already unwrap responses. Vona's standard success wrapper depends on the effective response content type; see [Response wrapper behavior](/backend/controller-guide#response-wrapper-behavior).

- For a helper whose contract is the standard JSON envelope, explicitly request `Accept: application/json` where endpoint negotiation permits it, check the HTTP status, and validate the expected envelope and business result. Request `Content-Type` describes the submitted body, not a general response-format guarantee. Existing response types and action metadata may take precedence over `Accept`.
- HTTP `200`, `response.ok()`, and a TypeScript cast do not validate a response body. `response.json()` parses JSON but does not establish its schema. Keep status, decoding, response-shape, and business-result checks distinct; preserve strict result assertions rather than accepting any successful status.
- Support both direct bodies and envelopes only when the caller's documented contract genuinely permits both. Do not normalize arbitrary responses with `payload.data ?? payload`: it loses legitimate `data: null` and can confuse a business object's own `data` field with an envelope. Identify the supported shape and preserve its payload, including `null`. An empty body is not the same as a JSON envelope containing `data: null`.
- Handle error statuses separately from success extraction. Vona's default JSON error response carries `code` and `message` with its error HTTP status; it is not a success `data` envelope or a general HTTP-200 business-error convention. Custom endpoint/error handling must be checked against its own contract.
- Vona's `executor.performAction()` supplies JSON acceptance when absent and unwraps standard successful envelopes internally; its return value is not raw HTTP-body evidence. Zova's existing API transport also owns envelope/error processing. Do not add another unwrapping layer to generated-client callers or hand-edit generated consumers. See [Controller action tests](/backend/unit-testing#testing-controllers-through-actions).

Keep diagnostics minimal: identify whether the failure was transport/status, parsing, shape validation, or a business assertion without retaining raw bodies, credentials, or private error details. An isolated parsing correction does not prove that a previous server-side operation failed or succeeded, and does not authorize another runtime attempt.

### Debug logging and browser failure reports

In both Cabloy Basic and Cabloy Start, use the framework `this.$logger.debug(...)` at diagnostically meaningful boundaries in frontend business flows, such as action eligibility, an important asynchronous request, or its result. Prefer a few stable, non-sensitive events over per-render or per-function traces. Keep reusable request and mutation diagnostics with the owning model rather than adding a second state or lifecycle owner in the page. See [Debug events for test and E2E diagnostics](/backend/logger-guide#debug-events-for-test-and-e2e-diagnostics) for event naming, safety, and proportionality guidance shared with the backend.

For example, the model that owns a request can record these events at the corresponding stages of the existing awaited operation:

```ts
this.$logger.debug('payment.session.start.request started');
// After the request completes successfully:
this.$logger.debug('payment.session.start.request completed');
```

#### Test-mode defaults

The root managed test/E2E lifecycle starts Vona in test mode. Its logger defaults to `debug` only when the relevant client level is unset or empty; explicit levels remain authoritative. For Vona integrated SSR, `siteOptions` supplies `LOGGER_TEST_ENABLED` to the server and browser environments from `app.meta.isTest`, and also supplies the optional test-mode `LOGGER_CLIENT_DEFAULT` as a default before Site configuration overrides.

Zova enables test logging only when **both** `SSR_WITH_VONA === 'true'` and `LOGGER_TEST_ENABLED === 'true'`. In that case an unset or empty client level defaults to `debug`, even when `META_MODE` is `production`. Explicit `'false'` disables the client, `'true'` selects `info`, and a named level selects that level. Ordinary production frontend logging remains disabled without the integrated-test condition.

This handoff is not a promise that arbitrary frontend unit tests, raw Playwright commands, Zova standalone SSR, or SPA runs automatically use `debug`. Do not edit `.env` files or enable production logging merely to reproduce the managed test defaults. Use current paired SSR/REST artifacts and dependency synchronization for the active edition when frontend code has changed, as described in the acceptance sections below.

#### Collect only selected browser events

Enabling `debug` output does **not** automatically retain every browser log in an E2E report. Specs use the existing managed fixture from `repo-e2e/scripts/managedTest.ts`; configure its `browserDiagnosticEvents` option with the safe literals relevant to the flow. For example, in a spec under `repo-e2e/specs/` that exercises the payment request events above:

```ts
import { test } from '../scripts/managedTest.ts';

test.use({
  browserDiagnosticEvents: [
    'payment.session.start.request started',
    'payment.session.start.request completed',
    'payment.session.start.request failed',
  ],
});
```

Choose events actually emitted by the flow under test; the example does not require adding payment dependencies to unrelated specs. The default allowlist is empty. Matching `log`, `debug`, or `info` messages retain only the configured event literal with elapsed time and a page label, not arbitrary console text, formatter metadata, arguments, or payloads. Console errors and page errors are counted without retaining their text. History is bounded to 100 records and 32 KiB, with dropped-record counts.

When actual test status differs from expected status, the fixture attaches `browser-diagnostics` and prints a short terminal summary. It observes an existing or lazily requested browser; API-only tests do not launch a browser just to collect diagnostics. These are browser diagnostics, not a combined frontend/backend log archive. Unmanaged imports preserve the original Playwright fixtures and do not install this automatic collection.

Use these events to narrow failure attribution, not as the sole proof of request success, authorization, persistence, or user-visible completion. Preserve hydration/readiness waits and business assertions. An absent event may reflect disabled logging, the observation window, an empty or mismatched allowlist, or bounded-history eviction rather than an unexecuted callback. Do not collect raw console payloads or private application state to compensate.

## Vona integrated SSR browser acceptance

The default Basic Web and Admin sites have browser smoke commands that exercise Vona integrated SSR through Vona SSR dispatch at the managed run's dynamically allocated test listener, not through the ordinary Vona development listener (`7102` by default) or the Zova standalone SSR development-server port. Vona supplies the API origin at runtime, so no Zova `.env` change or rebuild is needed solely for the test port; see [Runtime API origins in Vona integrated SSR](/fullstack/ssr-entry-modes#runtime-api-origins-in-vona-integrated-ssr).

Prepare current SSR and REST artifacts explicitly when frontend output has changed:

```bash
# Web only
npm run build:zova:web

# Admin only
npm run build:zova:admin

# Both default Basic sites, then a managed local run
npm run build:zova
npm run deps:vona
npm run test:e2e cabloy-basic home-user-account
```

The sole managed `npm run test:e2e` command starts a fresh local Vona worker with `--workers=1 --flavor=normal --mode=test`, then runs the selected specs against Vona integrated SSR. Test-mode startup initializes test resources without a separate `db:reset`; browser commands consume already-built artifacts and do not rebuild them. In both Cabloy Basic and Cabloy Start, the root wrapper allocates run-owned test identity, database and Redis namespaces, generated/runtime/public paths, and a loopback listener independently of ordinary dev. A running same-checkout dev process alone is not a blocker. Check actual overlap with those test resources and custom external resources, and coordinate overlapping shared build/dependency writes; do not require dev shutdown or worktree/environment setup solely for these tests. See [Test isolation and development data](/reference/repo-scripts#test-isolation-and-development-data) for the ownership and preparation boundaries.

Place flat spec basenames directly after the npm script name. Use npm's `--` delimiter before Playwright options. With no names, every spec in `repo-e2e/specs` runs. Native `--grep` and `--grep-invert` remain available, and repeatable `--tag` values require all listed tags:

```bash
npm run test:e2e cabloy-basic home-user-account -- --grep @flow
npm run test:e2e a-commerce -- --tag @web --tag @smoke
```

For the complete Basic tag vocabulary and managed-runner argument boundaries, see [Repo Scripts](/reference/repo-scripts#ssr-browser-checks). `E2E_BASE_URL` must be unset: externally managed targets are unsupported.

Cabloy Basic's Chromium Basic/Commerce CI baselines configure Ubuntu, Windows, and macOS; a matrix declaration is not evidence that all six combinations passed. On native Windows, public commands work from CMD or PowerShell and require PowerShell 7 on `PATH`, local NTFS storage, reachable Redis, installed Chromium, and ready paired SSR/REST artifacts. Managed browsers inherit a registered non-breakaway Windows Job; both worker and browser membership are verified through its owning helper, and cleanup requires whole-Job drainage rather than browser close alone. Normal Windows server teardown uses authenticated cooperative shutdown; failures or interruption retain claims and resources. POSIX browsers retain independent process-group verification. See [Native Windows managed tests](/reference/repo-scripts#native-windows-managed-tests) for the prerequisites, lifecycle, and coverage limits; this is not a claim about Cabloy Start's Windows browser support.

## Cabloy Start root wrappers

Cabloy Start is the public MIT-licensed edition. Its default root wrappers use the `cabloyStartAdmin` and `cabloyStartWeb` flavors:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
```

Cabloy Start does not expose the Basic Commerce wrapper family.

## Start SSR browser acceptance

The Start Web and Admin browser baseline exercises Vona integrated SSR dispatch at the managed run's dynamically allocated loopback listener, independently of the ordinary dev listener. Prepare current SSR and REST artifacts, then use the managed local command:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e
```

Start uses one E2E command and one fresh managed local test-mode lifecycle:

```text
npm run test:e2e       fresh managed local test-mode suite run
```

Select flat spec basenames and filter scenarios or surfaces with runner tags and native Playwright arguments. Current Start scenarios use tags including `@web`, `@admin`, `@smoke`, `@layout`, `@cabloy-admin`, `@account`, `@ssr`, and `@flow`:

```bash
npm run test:e2e cabloy-start
npm run test:e2e cabloy-start -- --tag @web
npm run test:e2e cabloy-admin -- --tag @admin --tag @cabloy-admin
npm run test:e2e cabloy-start -- --grep ATP-START-FLOW-01
```

Start does not support externally managed E2E targets: `E2E_BASE_URL` must be unset. Like Basic, its root wrapper allocates run-specific test identity, database and Redis namespaces, generated/runtime/public paths, and a loopback listener, then starts one Vona worker with `--workers=1 --flavor=normal --mode=test`; Playwright does not reuse an existing process. It can run alongside ordinary same-checkout dev without requiring the configured dev port to be free. Test-mode startup initializes test state without a separate `db:reset`. Apply the same [test-resource ownership and shared-preparation checks](/reference/repo-scripts#test-isolation-and-development-data); the command does not replace the paired build/dependency-sync prerequisite or authorize shared environment/port changes.

## Zova script model

The underlying Zova package organizes scripts around app mode and flavor.

Examples from the current source include:

- `dev:ssr:admin`
- `build:ssr:admin`
- `preview:ssr:admin`
- `dev:ssr:web`
- `build:ssr:web`
- `preview:ssr:web`
- `dev:ssr:cabloyBasicAdmin`
- `build:ssr:cabloyBasicAdmin`
- `build:rest:cabloyBasicAdmin`
- `dev:ssr:cabloyStartAdmin`
- `build:ssr:cabloyStartAdmin`
- `build:rest:cabloyStartAdmin`

## Cabloy Basic

The public repository supports Basic-specific flavors:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative Zova commands are:

```bash
cd zova && npm run dev:ssr:cabloyBasicAdmin
cd zova && npm run build:ssr:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

The separate public Cabloy Start repository supports Start-specific flavors:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Representative Zova commands are:

```bash
cd zova && npm run dev:ssr:cabloyStartAdmin
cd zova && npm run build:ssr:cabloyStartAdmin
cd zova && npm run build:rest:cabloyStartAdmin
```

## Workflow guidance

When documenting or automating frontend scripts:

- start from the root wrappers for the detected edition
- detect the edition before choosing flavor-specific examples
- verify the exact flavor before writing edition-specific examples
- use REST/type generation commands deliberately when backend integration depends on them
- understand the mode/appMode/flavor model before changing script families; see [Environment and Config Guide](/frontend/environment-config-guide)
- enable or package frontend mock support deliberately when development depends on fake-server behavior; see [Mock Guide](/frontend/mock-guide)
- use [Frontend Quickstart](/frontend/quickstart) when the reader first needs the end-to-end onboarding story rather than only a script reference
