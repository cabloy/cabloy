# Backend Foundation

This guide explains the core architectural role of Vona in the Cabloy monorepo.

## What Vona is in Cabloy

Vona is the backend half of the Cabloy fullstack architecture.

It is designed for building `SSR`, `SPA`, `Web`, and `Admin` experiences in one broader system while keeping frontend and backend concerns separated enough to evolve independently.

## Fullstack mechanism

The core fullstack pattern remains the same:

- Zova provides the frontend framework
- Vona provides the backend framework
- the backend and frontend cooperate through generated artifacts, runtime integration, and shared conventions

Important integration channels include:

- backend-generated Swagger/OpenAPI metadata for frontend SDK generation
- frontend-generated route, icon, and component types that can feed backend-side usage and tooling
- shared monorepo scripts that make both sides visible to humans and AI systems

## Why Vona matters for backend and fullstack development

Vona combines backend productivity, DTO generation, CRUD-oriented workflows, multi-tenancy, and broad infrastructure support. In the monorepo docs, the key point is this:

Vona is not only a backend framework. Its conventions already encode a large amount of fullstack knowledge that contributors and automation should reuse instead of re-deriving manually.

That is why the docs, skills, and rules in this repo prefer:

- `npm run vona`
- CLI-driven generation
- source-truth route and module inspection
- verification against current scripts and code

## High-value backend capabilities

The most important enduring Vona capabilities include:

- modular architecture for suites and modules
- IOC container and dependency lookup
- AOP support across controller, internal, and external aspects
- a structured request-path model for middleware, guards, interceptors, pipes, and filters
- DTO inference and generation
- CRUD-oriented workflows
- multi-tenancy
- authentication, captcha, and user-access infrastructure
- multi-database and multi-datasource support
- transaction support
- caching, including two-layer cache
- playground support for quick verification

## The backend essentials model

The backend essentials model is built around three connected ideas:

- IoC containers and bean identity
- scope as the module resource facade
- suite / module / package boundaries as architectural units

For the broader backend hub, also see [Backend (Vona)](/backend/introduction). For the compact essentials-family hub, also see [Backend Essentials](/backend/backend-essentials).

## IoC containers and bean access

Vona uses framework-managed beans instead of expecting ordinary code to construct everything manually.

A useful distinction is:

- the **app container** owns global backend beans
- the **ctx container** owns request-scoped access
- **new-bean creation** allows fresh bean instances when a workflow really needs them

That means backend code can choose among:

- dependency injection
- dependency lookup
- direct bean access
- explicit new-bean creation

A practical rule is:

- prefer dependency lookup for concise business code
- use injection when the surrounding code already follows that pattern
- use direct bean access when you truly need container-level control

## Access-style comparison

| Access style         | Best for                                                            | Representative shape                                     |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------- |
| Dependency injection | explicit wiring in the current class                                | `@Use('demo-student.service.student')`                   |
| Dependency lookup    | ordinary module-oriented business code                              | `this.scope.service.student`                             |
| Direct bean access   | container-aware control through the app container or request scope  | `this.bean._getBean(...)`, `this.ctx.bean._getBean(...)` |
| Fresh bean creation  | workflows that should not reuse the ordinary resolved bean instance | `this.bean._newBean(...)`                                |

## Dependency injection vs dependency lookup vs direct bean access

These three access styles solve related but different problems.

### Dependency injection

Dependency injection is explicit and type-friendly.

Representative pattern:

```typescript
class ControllerStudent {
  @Use('demo-student.service.student')
  serviceStudent: ServiceStudent;
}
```

### Dependency lookup

Dependency lookup is often the most concise default.

Representative patterns:

```typescript
this.scope.service.student.findOne();
this.$scope.demoStudent.service.student.findOne();
```

### Direct bean access

Direct bean access exposes the container layer more explicitly.

Representative patterns:

```typescript
this.bean._getBean('demo-student.service.student');
this.ctx.bean._getBean('demo-student.service.student');
this.bean._newBean('demo-student.service.student');
```

A practical distinction is:

- `this.bean._getBean(...)` uses app-level container access
- `this.ctx.bean._getBean(...)` uses request-scoped container access
- `this.bean._newBean(...)` creates a fresh bean instance instead of reusing the ordinary resolved one

The important conceptual split is:

- injection wires a dependency into the current class
- lookup navigates the module resource facade
- direct bean access reaches the container more explicitly

## Bean identifier, onion name, and bean scenes

Legacy Vona essentials docs made bean identity more explicit, and that identity layer is still useful.

The most important terms are:

- **bean identifier**: for most scene-based beans, a dotted identity such as `{moduleName}.{sceneName}.{beanName}`
- **onion name**: a colon-based framework name such as `{moduleName}:{beanName}`
- **bean scene**: the operational family a bean belongs to, such as service, model, startup, queue, or broadcast

This matters because naming is not cosmetic. It affects:

- injection by identifier
- config override paths
- inspect tooling
- CLI-created bean organization

A practical naming rule is:

- most scene-based beans use the fully qualified `module.scene.bean` form such as `demo-student.service.student`
- onion name uses the shorter `module:bean` form such as `demo-student:student`
- bean scene is the middle grouping layer that turns one module into operational families like `service`, `model`, `entity`, `dto`, or `startup`
- the built-in global `bean` scene is an intentional exception and uses the plain bean name in the global shorthand surface

If you need to create a **new backend bean scene** rather than only adding another bean to an existing scene, see [Backend Bean Scene Authoring](/backend/bean-scene-authoring).

For deciding whether backend base classes belong in `src/lib`, `src/service`, or the global bean shorthand surface, also see [Class Placement Rule](/ai/class-placement-rule).

## Module-local helper functions

When you extract reusable helper functions for one backend module, initialize the module `src/lib` directory and place those helpers there.

A practical rule is:

- keep shared pure helpers in `src/lib`
- export them from `src/lib/index.ts` when multiple module files should reuse them
- avoid leaving reusable helper logic duplicated or buried inside `entity`, `dto`, `service`, or `controller` files
- if the logic needs bean lifecycle, injection, selector lookup, or other container-managed behavior, do not treat it as a plain helper; re-evaluate `src/service` or another bean scene instead

This complements the class placement rule:

- `src/lib` is the normal home for pure reusable helper logic
- `src/service` or other bean scenes remain the fit for container-managed runtime behavior

## BeanBase built-ins

A large part of the backend essentials model is that ordinary backend beans already inherit a useful working surface from `BeanBase`.

Representative built-ins include:

- `app`
- `ctx`
- `bean`
- `scope`
- `$scope`
- `$logger`
- `$loggerChild(...)`
- locale-oriented helpers such as `$text`

This matters because backend code usually should not reassemble those access points manually. The framework already places them on the base bean surface.

## Bean lifecycle vocabulary

Backend bean behavior also includes lifecycle concepts.

Representative lifecycle hooks include:

- `__init__`
- `__dispose__`

That lifecycle vocabulary matters because some backend capabilities are more than static helpers. They may need initialization, teardown, or startup-scoped behavior.

## Scope as the module resource facade

The most practical backend access model is scope.

Scope groups a module’s resources behind one structured facade, including areas such as:

- service
- model
- entity
- config
- constant
- locale
- error

The key distinction is:

- `this.scope` means local module resources
- `this.$scope.<module>` means cross-module resources
- `app.scope(...)` means explicit app-level scope lookup outside the local class shorthand

This is one of the reasons Vona backend code can stay concise without flattening everything into arbitrary imports.

## Suite / module / package boundaries

Vona architecture is not only about classes and beans. It is also about structural boundaries.

The core units are:

- **suite**
- **module**
- **package**

These units matter because they shape:

- generation targets from the CLI
- naming and identifiers
- dependency declarations
- resource access patterns
- documentation and ownership boundaries

That is why backend modularization should be treated as architecture, not just folder layout.

For the current monorepo shape, also see [Package Map](/reference/package-map).

## Relationship to Cabloy Basic and Cabloy Start

Most of these backend concepts are shared across both editions.

The differences usually appear at the integration boundary, for example:

- which frontend modules consume the backend output
- which Zova flavors are paired with the backend
- which edition-specific assets or routes are present

So the rule is:

- explain the backend capability once
- annotate edition-specific integration points only where they actually diverge

## Suggested next pages

Use these groups to move from the architecture-first model into the deeper backend families.

### Essentials and workflow entry pages

- [Backend (Vona)](/backend/introduction)
- [Backend Essentials](/backend/backend-essentials)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Service Guide](/backend/service-guide)

### Contract and data leaves

- [Controller Guide](/backend/controller-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)

### Runtime and distributed leaves

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Worker Guide](/backend/worker-guide)
- [Queue Guide](/backend/queue-guide)
