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

That same access model also appears for model, entity, config, locale, and other scope resources.

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

For reusable module-local helper functions, prefer the module `src/lib` directory. If the logic needs container-managed runtime behavior rather than plain helper placement, re-evaluate whether it belongs in service-scene instead. For the fuller rule, also see [Backend Foundation](/backend/foundation).

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
