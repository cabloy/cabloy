# Follow-up Checklist

After generating or extending a frontend thread, check which follow-up layers apply.

## Structural follow-up

- page/controller structure
- component wrapper usage
- route record implications
- params/query schema alignment
- [ ] resolve the route-default triad: effective `layout`, `requiresAuth`, and `ssrProfile`; confirm every omitted field intentionally inherits the active default
- [ ] static routes omit `route.name` unless a documented named-route requirement exists; ordinary business routes without `locale` params omit app-config aliases unless an explicit exception applies
- [ ] choose `ssrProfile` from the route's rendering contract (Web remains `public` by default; `session` is explicit for cookie-backed state, protected admission, personalized first paint, or private SSR data); a missing `locale` parameter alone does not determine it, and anonymous access is chosen independently with explicit `requiresAuth: false`

## Data and contract follow-up

- API service or model alignment
- SSR init-data needs
- resolve the effective SSR profile and server-side Passport/admission before classifying render-driving state as SSR-required or intentionally deferred; server HTML and the hydration-time client render must remain equivalent
- for authorized `session` SSR, prepare intended first-paint data through the model-owned query and an explicit readiness wait; verify safe query-state transfer and client reuse rather than deferring solely because the data is private
- for state intentionally omitted from SSR, such as cookie-unavailable or browser-only state, keep the same neutral shell/placeholder through hydration and begin query/load/render work only at an explicit post-hydration, admission, mounted, or interaction boundary
- `disableSuspenseOnInit` skips only the init-time suspense kick; do not treat it as a no-fetch or hydration-deferral mechanism
- use `$QueryEnsureLoaded(...)` only where loaded data is explicitly required; choose freshness helpers when the boundary requires domain-valid data
- distinguish a skipped query or unloaded `query.data` from an executed `queryFn` result: successful results cannot be `undefined`; use typed `null` only for domain-defined absence and check initialization error-boundary ownership; see [Query absence and readiness errors](../../../../repo-docs/frontend/use-state-data-best-practices.md#distinguish-skipped-queries-unloaded-data-and-expected-absence)
- OpenAPI SDK or schema-driven layer impact
- backend contract reminder if frontend depends on generated backend contract output
- if backend metadata will consume newly added frontend render resources, run every affected paired Zova SSR/REST build first and then `npm run deps:vona` as the default synchronization step
- with healthy local dependency state, `deps:vona` is normally sufficient; do not delete `vona/node_modules` as a routine prerequisite
- do not treat `build:rest:*` alone as sufficient, because the SSR bundle and REST output must move together
- if backend still sees stale shared types after `npm run deps:vona`, restart an affected Vona/TypeScript process if one is present; if the generated `.zova-rest` output is not already known to be correct, make a quick confirmation, then use the conditional local-dependency-drift recovery only when the output is correct and stale behavior remains; do not hand-edit generated output

## Interaction and UI follow-up

- props contract
- `v-model`
- generic typing
- style / theme / icon implications

## Metadata follow-up

- `:tools:metadata`
- route/component/icon regeneration-sensitive changes
- edition-specific generated output review
- for a `this.scope.locale` missing-key or type error: inspect `src/config/locale/`; if it is absent, run `npm run zova :init:locale <module>` (which refreshes metadata in its normal path), add the key to all required locale files, and run `npm run zova :tools:metadata <module>` if generated typing remains stale; do not cast around the error or add a local locale compatibility helper

## Verification follow-up

- relevant format, lint, and type checks using the smallest supported scope
- a few affected critical user flows through existing E2E scenarios, selected by spec, tag, or `--grep`
- for raw HTTP preparation or assertions, verify content negotiation, response shape, and unwrapping ownership; see [HTTP response contracts](../../../../repo-docs/frontend/scripts.md#check-http-response-contracts)
- focused regressions for actual defects; no exhaustive upfront fake matrices or custom source-evaluation harnesses
- affected-flavor artifact preparation when runtime verification needs updated output
- applicable route, SSR/hydration, authentication, authorization, and contract checks; do not replace server-side enforcement with UI coverage
- report unavailable or unauthorized runtime proof explicitly; do not create substitute test machinery

## Escalation rule

If the request clearly changes backend contract output or requires SDK regeneration from backend changes, mentally escalate to a fullstack workflow instead of pretending it is frontend-only.
