# Backend Essentials

## Why this page exists

The backend docs already explain many Vona workflows in detail, but the core backend mental model spans several pages.

This page provides one compact entrypoint for that model.

Use it when you want to understand how backend code is organized before diving into feature-specific guides.

For the broader backend entry page that groups the main families, also see [Backend (Vona)](/backend/introduction).

## The three core clusters

The backend essentials family is easiest to understand as three connected clusters:

### 1. IoC and bean containers

Vona backend code is built around framework-managed beans rather than ad hoc class instantiation.

The key concepts are:

- app container
- ctx container
- new-bean creation
- dependency injection
- dependency lookup
- direct bean access
- bean identifiers and onion names
- bean scenes
- bean lifecycle hooks
- BeanBase built-in members

Read next:

- [Backend Foundation](/backend/foundation)
- [Service Guide](/backend/service-guide)
- [Class Placement Rule](/ai/class-placement-rule)
- [Backend Startup Guide](/backend/startup-guide)

### 2. Scope and module resource access

The most practical backend access model is module scope.

That includes:

- local module access through `this.scope`
- cross-module access through `this.$scope`
- resource categories such as service, model, entity, config, constant, locale, and error
- explicit leaves such as [Config Guide](/backend/config-guide) and [Error Guide](/backend/error-guide)

A useful refinement is that `constant` and `locale` should be treated as first-class scope resources too, not as secondary extras.

A practical split is:

- `config` and `error` help define backend policy and failure behavior
- `constant` and `locale` help define stable module vocabulary and translatable text surfaces
- all of them still fit the same scope-based access model rather than requiring ad hoc imports everywhere

This is one of the reasons backend code can stay concise without flattening everything into imports or manual container wiring.

Read next:

- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)

### 3. Modularization across suite / module / package

Vona backend architecture is also organized around structural units, not just source folders.

The main units are:

- suite
- module
- package

Those boundaries matter because they shape:

- naming
- dependency declarations
- generated file placement
- module-scope resource access
- backend CLI workflows

Read next:

- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Package Map](/reference/package-map)

## Suggested reading path

If you are new to backend architecture, read in this order:

1. [Backend Foundation](/backend/foundation)
2. [Backend CLI](/backend/cli)
3. [Backend Scripts](/backend/scripts)
4. [Service Guide](/backend/service-guide)
5. [Model Guide](/backend/model-guide)
6. [Entity Guide](/backend/entity-guide)
7. [DTO Guide](/backend/dto-guide)
8. [Runtime and Flavors](/backend/runtime-and-flavors)
9. [Backend Startup Guide](/backend/startup-guide)

## How this page relates to the rest of the backend docs

This page is a compact family hub, not the deep technical home for each backend topic.

A practical split is:

- [Backend (Vona)](/backend/introduction) is the broader backend entry page
- [Backend Foundation](/backend/foundation) explains the architecture-first model
- [Service Guide](/backend/service-guide) explains the most practical access patterns
- [Backend CLI](/backend/cli) and [Backend Scripts](/backend/scripts) explain workflow entrypoints
- [Package Map](/reference/package-map) grounds the structure in the real monorepo

## Implementation checks for backend-architecture changes

When changing backend code, ask:

1. is this capability best reached through local module scope, cross-module scope, injection, or direct bean access?
2. does the change belong to a module, a suite, or a shared package boundary?
3. is there already a CLI workflow or bean type that should be reused instead of manual scaffolding?
4. does the change belong to the architecture spine first, or only to one feature-specific guide?

That helps AI keep backend changes aligned with Vona’s real architecture instead of only copying local code patterns.
