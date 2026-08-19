---
name: cabloy-frontend-scaffold
description: Use this skill whenever the user wants the Zova frontend path in this Cabloy repo: create or extend pages, components, api or model beans, route/query/params work, metadata refresh, SSR-sensitive frontend work, or component props, v-model, and generic refactors. Trigger for questions about which npm run zova create or refactor command to use and what frontend follow-up is required after generation, especially when the user wants the Zova way instead of generic Vue advice. Prefer it for frontend-first requests, even if backend context exists in the story. Do not use it for pure Vona scaffolding or backend/frontend contract-sync diagnosis.
---

# Cabloy Frontend Scaffold

Use this skill when the user wants to add or extend a Zova frontend feature thread.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. stay frontend-first unless the request clearly becomes a broader fullstack contract or backend workflow
3. prefer Zova CLI generation and refactor tools over manual scaffolding
4. always perform a frontend follow-up review so route metadata, API/model integration, SSR behavior, style/theme/icon implications, and metadata regeneration are not forgotten
5. add a backend-contract reminder only when the frontend change clearly depends on backend OpenAPI or DTO contract changes
6. finish with verification guidance that matches the scope of the change

## Step 1: Detect repo and task scope

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then classify the request:

- **frontend-only** if the task is about Zova pages, components, API services, models, routing, params/query, metadata, icons, styles, or SSR behavior
- **fullstack** only if the task clearly requires backend contract changes, SDK regeneration, or broader cross-stack contract work

Default to frontend-first. Only escalate mentally to a broader fullstack workflow when the frontend task obviously crosses the contract boundary.

### Decide a form layout or ask

When the task changes a schema-driven form, inspect the generated baseline, operation-specific DTO/schema, nearby Cabloy forms, the active edition and UI adapter, field relationships, and the user's stated workflow before choosing a layout.

Proceed autonomously when that evidence establishes the form purpose and field relationships. Choose the smallest fitting structure: no explicit layout for a short conventional form, flow for compact filters, Grid for responsive related fields, a group for one meaningful business boundary, or tabs for genuinely independent domains or workflows. State the consequential business assumptions with the implementation.

Ask one focused business question only when the layout would encode an unresolved semantic or authority decision: whether areas are independent or one workflow, which audience or task has priority, whether a form is a compact filter or a full entry workflow, or whether staged responsibilities are intended. Do not ask merely because several visual arrangements are technically valid.

If the user is still deciding a new business-domain boundary or suite/module naming, use the root `cabloy-domain-planning` skill before scaffolding.

If the task is really a broad cross-stack workflow, consider whether the root `cabloy-workflow` skill is the better primary router.

## Step 2: Start from Zova CLI and repo entrypoints

Inspect these surfaces before proposing implementation:

- the repository or workspace `package.json` that owns the scripts
- `npm run zova`
- Zova command families such as `create:*`, `init:*`, `refactor:*`, `tools:*`, `openapi:*`, and `bin:*`
- `cabloy-docs/frontend/` for the relevant frontend thread

For deeper reference material, read:

- `references/frontend-thread-map.md`
- `references/follow-up-checklist.md`

## Step 3: Choose the correct frontend scaffolding path

### Path A: create a new frontend structural piece

Use `create:*` when the user needs a new structural piece such as:

- page
- component
- api
- model
- module
- mock
- bean

Typical examples:

- `npm run zova :create:page ...`
- `npm run zova :create:component ...`
- `npm run zova :create:bean api ...`
- `npm run zova :create:bean model ...`

### Path B: add framework capabilities to an existing page or component

Use `refactor:*` when the user is extending an existing Zova structure rather than creating a new one.

Typical examples:

- `npm run zova :refactor:pageQuery ...`
- `npm run zova :refactor:pageParams ...`
- `npm run zova :refactor:componentProps ...`
- `npm run zova :refactor:componentModel ...`
- `npm run zova :refactor:componentGeneric ...`

Choose this path when the user already has a page or component and wants to add framework-native structure to it.

### Path C: refresh metadata or generated contract output

Use `tools:*` or `openapi:*` when the task is about generation rather than hand-authored frontend code.

Typical examples:

- `npm run zova :tools:metadata ...`
- `npm run zova :openapi:config ...`
- `npm run zova :openapi:generate ...`

## Step 4: Inspect the generated or transformed frontend thread

After generation or refactor, inspect what the CLI created and keep it as the baseline.

Typical frontend thread pieces may include:

- page or component controller
- wrapper component
- route record implications
- API service or model bean
- query/params schema additions
- generated metadata-dependent artifacts

Do not throw away the generated structure and rewrite it from scratch unless the generator clearly does not match the task.

## Step 5: Apply frontend follow-up logic deliberately

Frontend scaffolding is rarely complete after generation alone. Treat this follow-up review as mandatory.

### Route and metadata follow-up

Before finalizing every new or changed route, resolve the effective route defaults rather than relying on an unexamined omission:

- **layout** — omitted `meta.layout` inherits the logical default layout;
- **authentication** — omitted `requiresAuth` remains protected by the current guard, and only `requiresAuth: false` opts out;
- **SSR profile** — omitted `meta.ssrProfile` inherits the active flavor's `SSR_PROFILE`, while route metadata overrides it.

For Zova page routes, also apply these authoring defaults:

- routes with dynamic params require `route.name`; static routes should omit `route.name` unless a documented named-route requirement exists;
- ordinary business routes without `locale` params should omit app-config aliases unless a documented system, compatibility, or user-facing URL exception requires one;
- routes without `locale` params should use `ssrProfile: 'session'` when they participate in the locale-sensitive page surface, while anonymous admission remains an explicit `requiresAuth: false` decision.

Verify the active edition and flavor before applying concrete SSR defaults, and do not add all three fields redundantly when intentional inheritance is the desired behavior.

Check whether the feature needs:

- page route review
- params/query schema alignment
- effective layout, authentication, and SSR-profile default resolution
- static-name and ordinary-alias exception review
- alias or guard review
- metadata regeneration

### Data and contract follow-up

Check whether the feature needs:

- API service updates
- model-managed remote state
- SSR init-data updates
- OpenAPI SDK regeneration
- schema-driven UI or `$apiSchema` review
- SSR hydration-equivalence review: classify state as SSR-required or intentionally deferred; keep server HTML and the hydration-time client render equivalent; defer private, cookie-unavailable, or browser-only query/load/render branches to an explicit post-hydration, admission, mounted, or interaction boundary
- distinguish `$useStateData(...)` query ownership from readiness waits: `disableSuspenseOnInit` only skips its init-time suspense kick and does not prevent query creation or fetches; choose `$QueryEnsureLoaded(...)` or freshness helpers only at the later boundary that needs them
- reverse fullstack handoff when newly added frontend resources will later be consumed by backend metadata or backend tooling

If the frontend change introduces resources such as a custom form-field renderer, table-cell renderer, or other generated metadata that backend `ZovaRender.field(...)` / `ZovaRender.cell(...)` will consume, do not treat the task as frontend-only cleanup.

In that case, surface this operational sequence:

1. refresh metadata when needed
2. build the affected flavor output
3. run `deps:vona`
4. if backend-side shared types still look stale, escalate to the contract-loop recovery path instead of continuing source-level debugging

### Component and interaction follow-up

Check whether the feature needs:

- props contract review
- `v-model` review
- generic component conversion
- style/theme/icon updates
- wrapper usage review
- async-loading or controllerRef implications

### Verification

Check whether the feature needs:

- typecheck
- build
- metadata regeneration verification
- SSR or route-path verification
- hydration-time initial-render equivalence when SSR, private state, browser-only state, or async model state changes
- edition-specific flavor, SSR site baseline, and project-asset verification

### SSR theme review reminder

If the frontend change is SSR theme-sensitive, apply this short review before finishing:

- detect the active edition marker and UI library before assuming SSR theme behavior
- do not assume Cabloy Basic and Cabloy Start use the same adapter-level SSR theme handoff
- in Web SSR without cookie-backed theme resolution, do not treat server reads of `$theme.dark`, `$theme.darkMode`, or `$token` as final browser truth
- keep theme-finalization logic inside the active theme handler or client boot path instead of duplicating it in page or component code
- verify both server handoff and client hydration behavior for the active adapter

### Optional backend-contract reminder

Stay frontend-first, but if the frontend task clearly depends on backend contract output, add a reminder such as:

- backend OpenAPI output may need refresh or inspection
- backend DTO/controller response shape may be the real source of truth
- frontend SDK or schema-driven layers should be regenerated from contract output rather than hand-patched
- newly added frontend resources that backend metadata will consume may require a reverse handoff through the relevant Zova build first and then `npm run deps:vona`

Do not turn the skill into a backend workflow. Only surface the reminder when the contract boundary is clearly involved.

## Step 6: Use docs to avoid missing layers

Use the docs to decide what the generated frontend thread still needs.

Especially relevant pages include:

- `cabloy-docs/frontend/page-guide.md`
- `cabloy-docs/frontend/page-query-guide.md`
- `cabloy-docs/frontend/page-params-guide.md`
- `cabloy-docs/frontend/page-route-guide.md`
- `cabloy-docs/frontend/route-alias-guide.md`
- `cabloy-docs/frontend/navigation-guards-guide.md`
- `cabloy-docs/frontend/component-guide.md`
- `cabloy-docs/frontend/form-layout-guide.md` for schema-driven field placement, Grid/flow selection, groups, tabs, or embedded filter actions
- `cabloy-docs/frontend/component-props-guide.md`
- `cabloy-docs/frontend/component-v-model-guide.md`
- `cabloy-docs/frontend/generic-component-guide.md`
- `cabloy-docs/frontend/api-guide.md`
- `cabloy-docs/frontend/model-architecture.md`
- `cabloy-docs/frontend/model-state-guide.md`
- `cabloy-docs/frontend/openapi-sdk-guide.md`
- `cabloy-docs/frontend/api-schema-guide.md`
- `cabloy-docs/frontend/sdk-guide.md`
- `cabloy-docs/frontend/ssr-overview.md`
- `cabloy-docs/frontend/ssr-init-data.md`
- `cabloy-docs/frontend/ssr-client-only.md`
- `cabloy-docs/frontend/ssr-seo-meta.md`
- `cabloy-docs/frontend/ssr-env.md`
- `cabloy-docs/frontend/css-in-js-guide.md`
- `cabloy-docs/frontend/theme-guide.md`
- `cabloy-docs/frontend/icon-engine-guide.md`

## Step 7: Verification guidance

Always end with a verification path that matches the scope of the frontend change.

Typical shared checks include:

- `npm run tsc`
- `npm run build:zova`

If the task is inside `zova/` rather than the monorepo root wrapper path, use the smallest correct `zova/` script surface for the affected flavor or generation path.

Narrower checks may include:

- metadata refresh verification
- page route verification
- component wrapper or `v-model` behavior verification
- SSR or flavor-specific build verification
- edition-specific frontend script verification

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. frontend-first or clearly fullstack-sensitive classification
3. recommended Zova CLI path
4. form-layout decision, consequential business assumptions, and any user-confirmed boundary when the task is layout-sensitive
5. required frontend follow-up layers to check
6. optional backend-contract reminder if applicable
7. verification steps

Keep the response practical. The value of this skill is turning Cabloy frontend requests into the right generation + refactor + verification workflow, not writing more prose than necessary.
