---
name: cabloy-zova-source-reading
description: Use this skill when the user wants to read, trace, or explain Zova frontend source code rather than scaffold new code: where a page/component/model/behavior/SSR flow is implemented, how a runtime path works internally, why a plain controller field is reactive, how Zova differs from generic Vue 3 habits, or which files to read first. Trigger for requests about Zova source reading, runtime tracing, Vue-vs-Zova explanation, controller/bean/IoC mental models, or the Zova-native way to understand frontend behavior. Do not use it for normal frontend scaffolding or backend/frontend contract regeneration.
---

# Cabloy Zova Source Reading

Use this skill when the task is to understand, explain, or trace Zova frontend behavior in source code.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify whether the user needs a source-entry map, a runtime-flow trace, or a Vue-vs-Zova explanation
3. start from Zova-native public docs before diving into framework source
4. explain Zova architecture in its own terms before translating it into Vue analogies
5. separate source-confirmed runtime behavior from interpretive comparison
6. finish with verification guidance that matches the analysis scope

## Step 1: Detect the active edition

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect the repo scripts and ask before making edition-specific frontend assumptions

This matters most when the analysis becomes UI-sensitive, SSR-site-sensitive, flavor-sensitive, or module-set-sensitive.

## Step 2: Classify the analysis mode

Before reading files deeply, decide which kind of question the user is really asking.

### Mode A: source-location mode

Use this mode when the user is asking questions like:

- where should I start reading?
- which files are relevant?
- what order should I read the source in?
- where is this implemented in Zova?

### Mode B: runtime-flow mode

Use this mode when the user is asking questions like:

- how does this work internally?
- why is this field reactive?
- where does `$computed` / `$params` / `$query` come from?
- how does page/controller/component render enter the runtime?

### Mode C: Vue-vs-Zova comparison mode

Use this mode when the user is asking questions like:

- how should I understand this relative to Vue 3?
- is this just Vue with classes?
- what is the Zova way instead of the generic Vue way?
- how do controller / bean / model / render roles map to Vue concepts?

If a request spans more than one mode, answer in this order:

1. source-location mode
2. runtime-flow mode
3. Vue-vs-Zova comparison mode

That order reduces the risk of drifting into premature analogy before the source path is understood.

## Step 3: Start from public Zova docs first

Do not begin by forcing the problem into generic Vue terminology.

Start from the public frontend reading docs in `cabloy-docs/frontend/`.

### Primary reading surfaces

- `cabloy-docs/frontend/reading-zova-for-vue-developers.md`
- `cabloy-docs/frontend/zova-vs-vue3-comparison.md`
- `cabloy-docs/frontend/zova-reactivity-under-the-hood.md`
- `cabloy-docs/frontend/zova-source-reading-map.md`
- `cabloy-docs/frontend/page-guide.md`
- `cabloy-docs/frontend/component-guide.md`
- `cabloy-docs/frontend/css-in-js-guide.md`

For compact procedural summaries inside the skill bundle, also use:

- `references/analysis-modes.md`
- `references/core-reading-paths.md`

For locale-sensitive schema/form questions, also read:

- `cabloy-docs/frontend/api-schema-guide.md`
- `cabloy-docs/frontend/a-openapi-under-the-hood.md`
- `cabloy-docs/frontend/form-guide.md`
- `cabloy-docs/frontend/zova-form-under-the-hood.md`

### Core architecture surfaces

Use these when the question needs broader architectural context:

- `cabloy-docs/frontend/introduction.md`
- `cabloy-docs/frontend/foundation.md`
- `cabloy-docs/frontend/design-principles.md`
- `cabloy-docs/frontend/ioc-and-beans.md`
- `cabloy-docs/frontend/page-guide.md`
- `cabloy-docs/frontend/component-guide.md`
- `cabloy-docs/frontend/model-architecture.md`
- `cabloy-docs/frontend/page-route-guide.md`
- `cabloy-docs/frontend/behavior-guide.md`
- `cabloy-docs/frontend/ssr-architecture-overview.md`

## Step 4: Choose the shortest correct source-reading path

After reading the public docs, choose the smallest source path that answers the question.

Use these bundled references to keep the workflow compact:

- `references/analysis-modes.md`
- `references/core-reading-paths.md`

Use the public `cabloy-docs/frontend/zova-source-reading-map.md` as the fuller explanation layer, but use the bundled references first when they are enough for the current task.

### Locale-sensitive schema and form path

When a translated schema title, renderer, or validation surface remains stale after a locale change, read in this order:

1. the public API Schema Guide and A-OpenAPI Under the Hood guide;
2. the public Form Guide and Zova Form Under the Hood guide when a `ZForm` consumes the schema;
3. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/monkey.ts` to verify that the active locale replaces the selected `ModelSdk`;
4. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts` to inspect selector-scoped schema queries and `createApiSchemas(...)` facade lifetime;
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/bean/sys.sdk.ts` to verify locale headers and schema caches;
6. the generated API-schema bean and the actual page/model consumer that stores or derives the facade;
7. `zova/src/suite-vendor/a-zova/modules/a-form/` only after confirming which schema the form owner supplies, and whether automatic body iteration was replaced by a default body slot.

The key distinction is between a genuinely stale generated contract and a valid schema facade captured from an earlier locale. `$computed` is only locale-safe when its dependency path reacquires the current schema source; wrapping an old facade or transformed snapshot does not make it current.

## Step 5: Explain Zova-native meaning first

When answering, explain the Zova role first, then add Vue analogies only if they help.

### Required answer posture

1. identify the Zova-native role first
   - page controller
   - component controller
   - render bean
   - style bean
   - model bean
   - service bean
   - behavior bean
   - route/SSR integration layer

2. explain the source-confirmed runtime path second

3. only then offer Vue analogies as approximate translations

Do **not** lead with statements like:

- "this is basically just Vue setup with classes"
- "this should really be a normal Vue composable"
- "the right end state is probably `ref.value`"

Those translations can erase the actual Zova architecture.

For component-wrapper questions specifically, remember that `controllerRef` exposes the controller instance to the component consumer, not a generic DOM ref, and should not be treated as a generic Vue component-ref substitute without checking the current wrapper/controller source path.

### Split Controller, Render, and Style access

When explaining a split page or component, establish role ownership before discussing access:

- Controller owns state, actions, and lifecycle work.
- Render owns TSX composition.
- Style owns scoped CSS-in-JS setup.

The source-confirmed direct member lookup order is:

| Current bean | Direct member lookup order |
| --- | --- |
| Controller | Controller only |
| Style | Style, then Controller |
| Render | Render, then Controller, then Style |

State the shadowing caveat: an own member on the current bean takes precedence over each fallback surface. Recommend `this.member` for ordinary same-component companion access, such as Render reading Controller state or a Style-generated class.

Distinguish this normal fallback from explicit `@Use()` or bean/container access. Use explicit access only when the task needs a named or specific instance, selector or scope boundary, identity passing, lifecycle control, or other interop. Do not confuse generated type augmentation with runtime behavior: generated interfaces expose the type surface, while proxy fallback supplies missing companion members at runtime.

## Step 6: Distinguish source-confirmed behavior from interpretive comparison

Always make the boundary explicit.

### Source-confirmed behavior

This includes claims you can support directly from current source files, such as:

- where a controller is created
- where a bean becomes reactive
- where route state is refreshed
- where render is redirected
- which helper wraps which Vue API

### Interpretive comparison

This includes claims such as:

- why Zova feels more object-oriented than Vue
- how Zova growth paths differ from typical Vue growth paths
- which analogy is the closest Vue mental model

These can be useful, but they should be labeled as interpretation rather than current-source fact.

## Step 7: Stay inside the right workflow boundary

Use this skill for explanation and source reading.

Do **not** use it as the primary workflow when the real task is:

- creating or refactoring frontend structures → prefer `cabloy-frontend-scaffold`
- diagnosing backend/frontend contract drift → prefer `cabloy-contract-loop`
- choosing whether the work belongs to backend, frontend, fullstack, docs, or AI guidance → prefer `cabloy-workflow`

## Step 8: Verification guidance

Always finish with a verification path that matches the analysis task.

### For source-reading answers

Verify:

- the cited file paths exist
- the described runtime path is actually visible in current source
- the answer does not contradict the public frontend docs

### For Vue-vs-Zova explanation answers

Verify:

- the Zova-native explanation comes first
- Vue analogies are marked as approximate, not authoritative
- no claim quietly rewrites Zova back into generic Vue habits

### For edition-sensitive frontend analysis

Verify:

- the active edition marker was considered
- Basic-only or Start-only UI assumptions were not silently generalized
- SSR, theme, and flavor-sensitive statements match the active edition context

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. analysis mode
3. public docs to read first
4. source path to inspect next
5. Zova-native explanation
6. optional Vue analogy
7. verification notes or caveats

Keep the response practical. The value of this skill is to help AI and users read Zova source accurately and in the right architectural order, not to flatten Zova into generic Vue prose.
