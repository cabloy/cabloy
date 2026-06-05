# Service Guide

This page migrates the most important ideas from the legacy Vona service documentation.

## Create a service

Example: create a service named `student` in module `demo-student`.

```bash
npm run vona :create:bean service student -- --module=demo-student
```

## Service definition

Representative pattern:

```typescript
@Service()
export class ServiceStudent extends BeanBase {}
```

A service is usually the business-oriented layer that coordinates controllers, models, validation-related flows, and cross-module behavior.

## How to use a service

Vona supports both:

- dependency injection
- dependency lookup

The legacy docs recommend dependency lookup for concision, and that remains a good default in the Cabloy docs.

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
  @Use('demo-student.service.student')
  serviceStudent: ServiceStudent;
}
```

## Dependency lookup

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
    return this.$scope.demoStudent.service.student.findOne();
  }
}
```

## IOC container access

The legacy docs also highlighted direct bean access patterns.

### `_getBean`

```typescript
const serviceStudent = this.bean._getBean('demo-student.service.student');
```

### Request-scoped access

```typescript
const serviceStudent = this.ctx.bean._getBean('demo-student.service.student');
```

### `_newBean`

```typescript
const serviceStudent = this.bean._newBean('demo-student.service.student');
```

## Why this matters for AI workflows

When AI creates business logic in Vona, it should avoid flattening everything into controllers.

A better default is:

1. use the CLI to create the service shell
2. keep controllers thin
3. place business-oriented orchestration into services
4. use dependency lookup or the local scope consistently with surrounding code
