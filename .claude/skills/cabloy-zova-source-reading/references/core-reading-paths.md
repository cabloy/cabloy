# Core Reading Paths

Use this reference to choose the shortest source path after the analysis mode is known.

## Page controller and page reactivity

Read in this order:

1. the concrete page controller source
2. `zova-core/src/composables/useController.ts`
3. `zova-core/src/bean/beanContainer.ts`
4. `zova-core/src/bean/beanBase.ts`
5. `zova-core/src/bean/beanControllerPageBase.ts`
6. `zova-core/src/core/context/component.ts`
7. router integration files such as `a-router/src/monkey.ts`

Use when the question is about:

- plain controller fields
- `$computed`
- `$params` / `$query`
- page render flow

## Component controller and wrapper path

Read in this order:

1. representative wrapper metadata under `src/.metadata/component/`
2. `zova-core/src/composables/useController.ts`
3. `zova-core/src/bean/beanControllerBase.ts`
4. `zova-core/src/core/context/component.ts`
5. the concrete component controller source

Use when the question is about:

- wrapper components
- `controllerRef`
- component-local controller behavior

## Split Controller, Render, and Style companion path

Read in this order:

1. `home-layoutadmin/src/.metadata/component/layoutAdmin.ts`
2. `zova-core/src/composables/useController.ts`
3. `zova-core/src/bean/beanStyleBase.ts`
4. `zova-core/src/bean/beanControllerLike.ts`
5. `zova-core/src/bean/beanRenderLike.ts`
6. `zova-core/src/bean/beanContainer.ts`
7. `zova-core/src/core/context/component.ts`

Use when the question is about:

- Render reading Controller state or actions through `this.member`
- Style reading Controller state through `this.member`
- Render consuming a Style-generated class such as `this.cClass`
- generated typing versus runtime fallback
- companion-member shadowing or explicit `@Use()` boundaries

Expected conclusion:

- generated metadata types Style as Controller and Render as Style, but that type composition is not the runtime mechanism
- `useController(...)` creates Controller, Style, then Render in one context
- Controller has no companion fallback; Style falls back to Controller; Render falls back to Controller, then Style
- a locally declared member wins before fallback, so same-name members shadow companion members
- use direct `this.member` for normal companion access; reserve explicit identity/container access for named instances, selector/scope boundaries, lifecycle control, or interop

## Bean lifecycle and helper API path

Read in this order:

1. `zova-core/src/bean/beanBase.ts`
2. `zova-core/src/bean/beanBaseSimple.ts`
3. `zova-core/src/bean/beanContainer.ts`
4. `zova-core/src/core/context/util.ts`

Use when the question is about:

- `__init__`
- `__dispose__`
- `$watch`
- `$toRef`
- instance scope

## Route and page-shell path

Read in this order:

1. the local `routes.ts`
2. `a-router/src/monkey.ts`
3. router utility files
4. page schema sources
5. `BeanControllerPageBase`

Use when the question is about:

- route records
- params/query parsing
- layout shell implications
- route-aware controller state

## Locale-sensitive OpenAPI schema and ZForm path

Read in this order:

1. `cabloy-docs/frontend/api-schema-guide.md`
2. `cabloy-docs/frontend/a-openapi-under-the-hood.md`
3. `cabloy-docs/frontend/form-guide.md` and `cabloy-docs/frontend/zova-form-under-the-hood.md` when a form consumes the schema
4. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/monkey.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/bean/sys.sdk.ts`
7. the generated API-schema bean for the operation
8. the consumer controller/model and, only then, `a-form` controller/render sources

Use when the question is about:

- translated form titles, descriptions, validation, or renderer metadata that remain stale after a locale switch
- whether an `$apiSchema` facade, `requestBody`, or transformed schema may be stored across locale changes
- whether a stale result is generated-contract drift or consumer-side capture
- whether automatic `ZForm` rendering remains active or a default body slot intentionally replaced it

Expected conclusion:

- `a-openapi` selects a locale-scoped runtime, so `createApiSchemas(...)` facades created before a locale change can retain an earlier schema query
- the consumer must reacquire the schema through a live getter/computed owner and apply schema transforms in that same derivation
- `ZForm` resolves properties from the supplied schema; it does not refresh a stale caller-owned facade

## Model/state ownership path

Read in this order:

1. the relevant model bean
2. framework model state helper files
3. representative built-in model beans
4. consuming page/controller/service code

Use when the question is about:

- model-owned state
- cache-oriented state
- async vs sync state ownership

## Behavior path

Read in this order:

1. the public behavior wrapper/controller path
2. the concrete behavior bean
3. the behavior composer/service files
4. host-scoped injected dependencies

Use when the question is about:

- render-time interception
- behavior composition
- Behavior vs Component vs Helper

## SSR runtime path

Read in this order:

1. the SSR site or bundle entry
2. SSR runtime/context files in `zova-core`
3. relevant page/controller/model code
4. Vona SSR handoff layer if needed

Use when the question is about:

- SSR entry
- hydration handoff
- whether the bug belongs to Vona or Zova
