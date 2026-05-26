# Service

## Create Service

For example, we create a Service `student` in the module demo-student.

### 1. Cli command

```bash
$ vona :create:bean service student --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Create/Service`
:::

## Service Definition

```typescript
@Service()
export class ServiceStudent extends BeanBase {}
```

## Use Service

The use of Service can be explained from different dimensions.

- [Dependency Injection](../essentials/ioc/dependency-injection.md), [Dependency Lookup](../essentials/ioc/dependency-lookup.md)

- [Module Scope: Service](../essentials/scope/service.md)

## 1. Dependency injection

Inject `ServiceStudent` into `ControllerStudent` of module demo-student, the code is as follows:

- Based on Class type

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  @Use()
  serviceStudent: ServiceStudent;
}
```

- Based on Bean identifier

```typescript
import type { ServiceStudent } from '../service/student.ts';

export class ControllerStudent {
  @Use('demo-student.service.student')
  serviceStudent: ServiceStudent;
}
```

Since the imported `ServiceStudent` is a `type`, the Bean identifier of Service needs to be specified.

## 2. Dependency lookup

- Lookup in this module

```typescript
class ControllerStudent {
  findOne() {
    return this.scope.service.student.findOne();
  }
}
```

- Lookup cross-module

```typescript
class ControllerStudent {
  findOne() {
    return this.$scope.demoStudent.service.student.findOne();
  }
}
```

## 3. Dependency lookup (API)

### \_getBean

1. Lookup based on Bean class

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._getBean(ServiceStudent);
  }
}
```

this.bean === this.app.bean, which is the app container.

2. Lookup based on Bean identifier

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._getBean('demo-student.service.student');
  }
}
```

### Request scope

If we want to create a request-scope Bean instance, then we only need to invoke the `_getBean` method of the ctx container.

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent1 = this.ctx.bean._getBean(ServiceStudent);
    const serviceStudent2 = this.ctx.bean._getBean('demo-student.service.student');
    // serviceStudent1 === serviceStudent2
  }
}
```

### \_newBean

1. Create a new instance based on the Bean class

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._newBean(ServiceStudent);
  }
}
```

2. Create a new instance based on the Bean identifier

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._newBean('demo-student.service.student');
  }
}
```
