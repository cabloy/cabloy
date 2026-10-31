# Service Guide

This guide explains how services work in Vona within the Cabloy monorepo.

## Why services matter

A service is usually the business-oriented layer that coordinates controllers, models, validation-related flows, and cross-module behavior.

In practice, the service guide is also the most useful page for understanding backend access patterns.

## Create a service

Example: create a service named `student` in module `training-student`.

```bash
npm run vona :create:bean service student -- --module=training-student
```

## Service definition

Representative pattern:

```typescript
@Service()
export class ServiceStudent extends BeanBase {}
```

## The three main access styles

Vona backend code commonly uses three access styles:

- dependency injection
- dependency lookup
- direct bean access

A practical rule is:

- prefer dependency lookup as the default for concise business code
- use injection when the surrounding code already follows explicit wiring
- use direct bean access when you need container-level behavior or a fresh bean instance

## Dependency injection

### By class type

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  @Use()
  serviceStudent: ServiceStudent;
}
```

### By bean identifier

```typescript
import type { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  @Use('training-student.service.student')
  serviceStudent: ServiceStudent;
}
```

This is the clearest place where bean identifiers become visible in ordinary backend code.

## Dependency lookup

Dependency lookup is usually the best default because it keeps the code concise and follows the module resource facade.

### Within the current module

```typescript
class ControllerStudent {
  findOne() {
    return this.scope.service.student.findOne();
  }
}
```

### Across modules

```typescript
class ControllerStudent {
  findOne() {
    return this.$scope.trainingStudent.service.student.findOne();
  }
}
```

A useful distinction is:

- `this.scope` means local module resources
- `this.$scope.<module>` means cross-module resources

That same access model also appears for model, entity, config, locale, and other scope resources. Cross-module scope lookup alone does not require a `vonaModule.dependencies` entry; see [Backend Foundation](/backend/foundation#scope-lookup-vs-module-dependencies) for the distinction between lookup and a true module dependency.

## Direct bean access

Direct bean access patterns are also available.

### Global container access: `_getBean`

```typescript
const serviceStudent = this.bean._getBean('training-student.service.student');
```

### Request-scoped access

```typescript
const serviceStudent = this.ctx.bean._getBean('training-student.service.student');
```

### Fresh bean creation: `_newBean`

```typescript
const serviceStudent = this.bean._newBean('training-student.service.student');
```

A practical split is:

- `this.bean._getBean(...)` reaches the app-level container more explicitly
- `this.ctx.bean._getBean(...)` uses request-scoped access
- `this.bean._newBean(...)` creates a fresh bean instance when the workflow should not reuse the ordinary resolved bean

A practical “when to use which” rule is:

- use `this.scope.service.student` when the dependency belongs to the current module and ordinary business code is enough
- use `this.$scope.trainingStudent.service.student` when the dependency clearly belongs to another module
- use `this.bean._getBean(...)` when you need explicit app-container access by bean identifier
- use `this.ctx.bean._getBean(...)` when the workflow should resolve through request-scoped access
- use `this.bean._newBean(...)` when you need a fresh bean instance instead of the ordinary resolved one

## Relationship to scope and bean scenes

Services are one bean scene inside the larger backend essentials model.

That means service access should be understood together with:

- bean identifiers such as `training-student.service.student`
- local module scope vs cross-module scope
- other scope resource categories such as model and entity

For deciding whether a backend base class should stay a helper, move into service-scene, or remain part of the global bean shorthand surface, also see [Class Placement Rule](/ai/class-placement-rule).

### Choosing between lib, scope service, and global bean

Choose placement by responsibility and runtime ownership, not merely whether a function accepts or accesses `app`.

| Responsibility                                                                                                 | Preferred placement                    | Example                                                                                               |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Pure computation or conversion                                                                                 | Module `src/lib`                       | Normalize values or transform a schema without runtime state                                          |
| Generic infrastructure adaptation without owning business policy or requiring bean-managed lifecycle/injection | Module `src/lib`                       | An adapter that receives `app` to connect framework facilities                                        |
| Module-owned business policy or context-dependent orchestration                                                | Module `src/service` with `@Service()` | Select allowed business actions, evaluate current-user permissions, or coordinate resource operations |
| An intentionally global shorthand API                                                                          | Global bean in `src/bean`              | A shared capability deliberately exposed as `this.bean.xxx`                                           |

Accepting `app` does not make an adapter pure, but it does not by itself require converting that adapter into a service either. If the implementation needs container-managed lifecycle or injection, reconsider service placement even when its responsibility is infrastructure rather than business policy.

For example, a generic adapter may accept an application reference and callbacks. Keep that adaptation in `lib`, while a module scope service owns the business allowlist and permission-aware callbacks supplied to it. The service can use `BeanBase` facilities such as `this.app` and `this.ctx`, and callers can use the [scope lookup patterns](#dependency-lookup) above.

Cross-module reuse alone does not justify a global bean: services already support cross-module scope lookup. Global bean placement is an intentional shorthand API decision, not a prerequisite for application or context access. For ordinary module services, use a normal `src/service/*.ts` file; the special runtime-anchor `*_.ts` rules in [Class Placement Rule](/ai/class-placement-rule) concern a different registration role.

When moving a factory or callback into a service, preserve its operation/request context boundary. Resolve request-dependent permissions when the operation or callback runs; do not retain a request's context, authorization result, or request-specific object in longer-lived service or application state. Service placement does not itself establish a new context or make such state safe to share.

The A / B1 / B2 rule classifies backend base classes; it is not a blanket requirement to move every application-dependent function into a service. For the broader module and runtime access model, see [Backend Foundation](/backend/foundation).

Read this guide together with:

- [Backend Foundation](/backend/foundation)
- [Backend Essentials](/backend/backend-essentials)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Backend Startup Guide](/backend/startup-guide)

## Practical implications for service-layer implementation

When creating business logic in Vona, avoid flattening everything into controllers.

A better default is:

1. use the CLI to create the service shell
2. keep controllers thin
3. place business-oriented orchestration into services
4. choose deliberately among local scope, cross-module scope, injection, and direct bean access

That keeps backend access patterns aligned with Vona’s actual architecture instead of using one access style everywhere by habit.

## Where to read next

If your next question is how service orchestration hands off to the persistence and contract layers in one real module, continue with:

- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
