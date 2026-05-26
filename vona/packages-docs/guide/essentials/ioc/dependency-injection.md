# Dependency Injection

Vona injects Bean instances through `@Use` decorator function.

## Injection methods

1. `Module Injection`: Can be directly injected based on `Class type`
2. `Cross-Module Injection`: Can be injected based on `Bean identifier`, which helps achieve loose coupling between modules and supports circular references

## Based on Class type

Inject the ServiceStudent provided by the module demo-student in the current module. The code is as follows:

```typescript
import { ServiceStudent } from '../service/student.ts';

export class ControllerStudent {
  @Use()
  student: ServiceStudent;
}
```

## Based on Bean identifier

Inject the ServiceStudent provided by the module demo-student into other modules, as shown in the code below:

```typescript
import type { ServiceStudent } from 'vona-module-demo-student';

export class ControllerStudent {
  @Use('demo-student.service.student')
  student: ServiceStudent;
}
```

Since the imported `ServiceStudent` is of `type`, the Bean identifier of the Service needs to be specified.
