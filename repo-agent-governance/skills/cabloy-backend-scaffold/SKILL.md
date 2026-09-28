---
name: cabloy-backend-scaffold
description: This skill should be used when the user needs the Vona backend scaffold/extend path in this Cabloy repo, especially to choose the right `npm run vona` generator or CRUD command and the required backend follow-up after generation. Trigger most strongly on backend requests involving modules, beans, controllers, services, models, entities, DTOs, CRUD, meta.version, field indexes, validation, or backend tests. Do not use it for frontend-first Zova work, stale generated consumer diagnosis, workflow-routing questions, or master-detail / nested-detail aggregation workflows that belong in `cabloy-master-detail`.
---

# Cabloy Backend Scaffold

Use this skill when the user wants to add or extend a Vona backend feature thread.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. stay backend-first unless the request clearly becomes a larger fullstack workflow
3. prefer Vona CLI generation and CRUD tools over manual scaffolding
4. always perform a backend follow-up review so migration, field indexes, DTO/OpenAPI contracts, and tests are not forgotten
5. add a frontend-contract reminder only when the backend change likely affects OpenAPI consumers or generated SDK flows
6. finish with verification guidance that matches the scope of the change

## Step 1: Detect repo and task scope

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- only `__CABLOY_BASIC__` present → this is Cabloy Basic
- only `__CABLOY_START__` present → this is Cabloy Start
- both markers present → treat the repository as ambiguous or invalid and stop before making edition-specific assumptions
- neither marker present → inspect the owning package scripts and nearby repository structure, then ask before making an edition-specific assumption

Then classify the request:

- **backend-only** if the task is about Vona modules, beans, models, entities, DTOs, CRUD, migration, tests, or backend contracts
- **fullstack** only if the task clearly requires frontend SDK regeneration, frontend page/component work, or a broader cross-stack contract loop

Default to backend-first. Only escalate mentally to a broader fullstack workflow when the backend change obviously crosses the contract boundary.

If the user is still deciding a new business-domain boundary or suite/module naming, use the root `cabloy-domain-planning` skill before scaffolding.

If the task is really a broad cross-stack workflow, consider whether the root `cabloy-workflow` skill is the better primary router.

If the request is not ordinary standalone backend scaffolding but a parent-owned detail aggregation workflow, such as master-detail, nested-detail, aggregate-only detail, standalone-capable detail, or `:tools:masterDetail`, prefer the dedicated `cabloy-master-detail` skill first.

## Step 2: Start from Vona CLI and repo entrypoints

Inspect these surfaces before proposing implementation:

- the repository or workspace `package.json` that owns the scripts
- `npm run vona`
- Vona command families such as `create:*`, `init:*`, `tools:*`, and `bin:*`
- `repo-docs/backend/` for the relevant backend thread

For deeper reference material, read:

- `references/backend-thread-map.md`
- `references/follow-up-checklist.md`

## Step 3: Choose the correct scaffolding path

### Path A: create one backend bean or module piece

Use `create:*` when the user needs one structural piece such as:

- module
- bean
- controller
- service
- model
- entity
- dto
- test

Typical examples:

- `npm run vona :create:module ...`
- `npm run vona :create:bean controller ...`
- `npm run vona :create:bean dto ...`
- `npm run vona :create:test ...`

### Path B: create a full CRUD thread

Use `tools:*` when the user needs a whole backend thread rather than one isolated file.

Typical example:

- `npm run vona :tools:crud ...`

Choose this path when the user asks for a CRUD feature, an admin-style backend resource thread, or a connected set of controller/service/model/entity/dto/test files.

### Path C: initialize supporting module resources

Use `init:*` when the task is really about module support files rather than business logic itself.

Typical areas include:

- config
- locale
- constant
- asset
- types

## Step 4: Inspect the generated backend thread

After generation, inspect what the CLI created and keep it as the baseline.

Typical backend thread pieces include:

- controller
- service
- model
- entity
- dto
- migration/meta files
- locale files
- tests

Do not throw away the generated structure and rewrite it from scratch unless the generator clearly does not match the task.

### Generated renderer decision

When refining generated entity fields, choose form and table controls from business semantics, not only from the primitive TypeScript type:

- keep ordinary Cabloy Basic text fields, such as generated `name` and `description`, on the implicit default `Input` renderer; do not mechanically add `basic-input:formFieldInput`
- add explicit `ZovaRender.field(...)` when semantics require a specialized control, such as an enum/select, resource relation, date/time, boolean choice, money, image, or file
- add `ZovaRender.cell(...)` when that field also needs specialized table presentation
- reuse a shared renderer first, configure it with field-level options next, and create a custom renderer only when the shared surface cannot express the required behavior; follow `cabloy-resource-field-update` for the edition-aware renderer branch

## Step 5: Apply backend follow-up logic deliberately

Backend scaffolding is rarely complete after file generation alone. Treat this follow-up review as mandatory.

Check which of these concerns apply:

### Contract and validation

Check whether the feature needs:

- request validation
- DTO design
- OpenAPI metadata
- inferred DTO generation

### Conditional RBAC metadata

When the active edition and installed modules provide `@Passport.rbac(...)` and the task adds or changes a decorated action:

- verify the decorator, RBAC catalog, and any policy-catalog/editor consumer in the active source before making availability claims
- provide locale-aware `summary` metadata at both the controller and action levels; these scopes are independent and must be authored explicitly
- add locale-aware `description` metadata only when the business or administrative experience needs explanatory text
- keep action keys, controller bean names, action names, routes, and other authorization/integration identifiers stable and nonlocalized
- treat summary/description as presentation metadata, not authorization identity or enforcement
- verify the explicit server-side catalog/editor projection; do not assume OpenAPI metadata is automatically displayed by a policy editor

For the authoring example and metadata boundary, read [Controller Guide](../../../repo-docs/backend/controller-guide.md#rbac-presentation-metadata) and [Controller AOP Guide](../../../repo-docs/backend/controller-aop-guide.md#rbac-presentation-metadata).

### Persistence and schema lifecycle

Check whether the feature needs:

- migration/version updates
- `meta.version`
- field indexes
- relation definitions
- datasource or cache considerations, including cross-Model query-cache dependencies

For normal resource persistence, preserve Vona's default active-instance scope:

- in the current tenancy model, a tenant corresponds to an instance and ordinary model CRUD handles the current `iid`
- do not expose caller-controlled `iid` or tenant selection in ordinary resource DTOs or controller logic
- treat a record absent from an ordinary scoped model lookup as absent; do not use raw cross-instance probes merely to choose between `403` and not-found behavior
- use `disableInstance`, plain builders, or raw SQL only for an explicit global/system or otherwise authorized contract
- model a future multi-merchant requirement as a separate boundary within an instance, with its own ownership and authorization rules

For the canonical explanation, read [Multi-Instance and Instance Resolution](../../../repo-docs/backend/multi-instance-and-instance-resolution.md) and [Model Guide](../../../repo-docs/backend/model-guide.md).

### Cross-module resource lookup

Choose the narrowest lookup form before evaluating module dependency intent:

- use `this.scope` for resources owned by the current `BeanBase` module
- use `this.$scope.<fixedModule>` when the target module is statically known and the typed shorthand is available
- use `app.scope('<module-name>')` in tests or standalone code with an application reference instead of BeanBase shorthands
- use `this.app.scope(moduleName)` or `app.scope(moduleName)` when the module name is genuinely selected at runtime; do not replace a fixed module target with a dynamic string lookup merely for style

Then distinguish runtime lookup from a true module dependency:

- lookup resolves a resource from a module already composed into the application; it does not by itself require a `vonaModule.dependencies` entry or create a circular dependency edge
- add `vonaModule.dependencies` only when the feature genuinely requires the target module's availability, dependency-first ordering, or minimum compatible version
- do not add a dependency declaration merely because code looks up another module's service, model, config, locale, or other resource
- scope lookup cannot make an absent module available; validate application/suite composition separately when the target must exist

For the canonical decision guide, read [Vona Module Dependencies](../../../repo-docs/backend/module-dependencies.md), with [Backend Foundation](../../../repo-docs/backend/foundation.md#scope-lookup-vs-module-dependencies) and [Package Map](../../../repo-docs/reference/package-map.md) as companions.

### Verification

For persisted test data, classify each record as a durable module seed or a test-local fixture. Durable seed data belongs in the owning module's `meta.version.ts` `seed()` hook, runs from a newly recreated managed database, and is read-only to tests; test-local resources must be tracked and deleted in `finally` in reverse dependency order.

Check whether the feature needs:

- unit tests
- `db:reset` or migration verification
- controller action testing
- broader `test` / `tsc` / `build` checks

### Optional frontend-contract reminder

Stay backend-first, but if the backend change likely affects frontend contract consumers, add a reminder such as:

- OpenAPI output may have changed
- frontend SDK or schema-driven layers may need regeneration
- the active edition and frontend flavor may matter for the regeneration path

Do not turn the skill into a full frontend workflow. Only surface the reminder when the contract boundary is clearly involved.

## Step 6: Use docs to avoid missing layers

Use the docs to decide what the generated backend thread still needs.

Especially relevant pages include:

- `repo-docs/backend/controller-guide.md`
- `repo-docs/backend/service-guide.md`
- `repo-docs/backend/model-guide.md`
- `repo-docs/backend/entity-guide.md`
- `repo-docs/backend/dto-guide.md`
- `repo-docs/backend/crud-workflow.md`
- `repo-docs/backend/migration-and-changes.md`
- `repo-docs/backend/field-indexes.md`
- `repo-docs/backend/unit-testing.md`
- `repo-docs/backend/validation-guide.md`
- `repo-docs/backend/openapi-guide.md`
- `repo-docs/backend/dto-infer-generation.md`

## Step 7: Verification guidance

Always end with a verification path that matches the scope of the backend change.

Typical shared checks include:

- `npm run test`
- `npm run tsc`
- `npm run build`

Narrower checks may include:

- module test updates
- route/controller action verification
- migration reset flow
- CRUD workflow test coverage

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. backend-first or clearly fullstack-sensitive classification
3. recommended Vona CLI path
4. required backend follow-up layers to check
5. optional frontend-contract reminder if applicable
6. verification steps

Keep the response practical. The value of this skill is turning Cabloy backend requests into the right generation + refinement + verification workflow, not writing more prose than necessary.
