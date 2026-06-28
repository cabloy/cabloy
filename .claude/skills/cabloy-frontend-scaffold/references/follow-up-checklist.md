# Follow-up Checklist

After generating or extending a frontend thread, check which follow-up layers apply.

## Structural follow-up

- page/controller structure
- component wrapper usage
- route record implications
- params/query schema alignment

## Data and contract follow-up

- API service or model alignment
- SSR init-data needs
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

## Verification follow-up

- `npm run tsc`
- `npm run build:zova`
- flavor-specific checks
- route or SSR verification

## Escalation rule

If the request clearly changes backend contract output or requires SDK regeneration from backend changes, mentally escalate to a fullstack workflow instead of pretending it is frontend-only.
