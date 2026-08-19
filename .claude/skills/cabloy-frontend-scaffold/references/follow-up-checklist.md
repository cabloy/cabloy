# Follow-up Checklist

After generating or extending a frontend thread, check which follow-up layers apply.

## Structural follow-up

- page/controller structure
- component wrapper usage
- route record implications
- params/query schema alignment
- [ ] resolve the route-default triad: effective `layout`, `requiresAuth`, and `ssrProfile`; confirm every omitted field intentionally inherits the active default
- [ ] static routes omit `route.name` unless a documented named-route requirement exists; ordinary business routes without `locale` params omit app-config aliases unless an explicit exception applies
- [ ] routes without `locale` params use `ssrProfile: 'session'` when they participate in the locale-sensitive page surface, and anonymous access is chosen independently with explicit `requiresAuth: false`

## Data and contract follow-up

- API service or model alignment
- SSR init-data needs
- classify render-driving state as SSR-required or intentionally deferred; server HTML and the hydration-time client render must remain equivalent
- for intentionally deferred private, cookie-unavailable, or browser-only state, keep the same neutral shell/placeholder through hydration and begin query/load/render work only at an explicit post-hydration, admission, mounted, or interaction boundary
- `disableSuspenseOnInit` skips only the init-time suspense kick; do not treat it as a no-fetch or hydration-deferral mechanism
- use `$QueryEnsureLoaded(...)` only where loaded data is explicitly required; choose freshness helpers when the boundary requires domain-valid data
- OpenAPI SDK or schema-driven layer impact
- backend contract reminder if frontend depends on generated backend contract output
- if backend metadata will consume newly added frontend render resources, run the relevant Zova build first and then `npm run deps:vona`
- do not treat `build:rest:*` alone as sufficient, because the SSR bundle and rest output must move together
- if the generated `.zova-rest` artifacts are updated but backend still sees stale shared types after `npm run deps:vona`, treat it as local dependency drift and rebuild `vona/node_modules` and reinstall

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

- `npm run tsc`
- `npm run build:zova`
- flavor-specific checks
- route or SSR verification

## Escalation rule

If the request clearly changes backend contract output or requires SDK regeneration from backend changes, mentally escalate to a fullstack workflow instead of pretending it is frontend-only.
