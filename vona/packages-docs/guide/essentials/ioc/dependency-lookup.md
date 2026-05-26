# Dependency Lookup

In addition to `Dependency Injection`, Vona also provides `Dependency Lookup`. In Vona, it is recommended to use dependency lookup, because dependency lookup can make the code more concise and intuitive.

## Dependency Lookup in current module

In the module demo-student, lookup the ServiceStudent provided by this module. The code is as follows:

```typescript
class ControllerStudent {
  async findMany() {
    return await this.scope.service.student.findMany();
  }
}
```

Get the scope object of this current module through `this.scope` to lookup the service provided by this module.

## Dependency Lookup Cross-module

In other modules, lookup the ServiceStudent provided by the module demo-student, the code is as follows:

```typescript
class ControllerOther {
  async findMany() {
    return await this.$scope.demoStudent.service.student.findMany();
  }
}
```

Get the scope object of the module demo-student through `this.$scope.demoStudent` to lookup the service provided by the module demo-student.

## Lookup global service beans

In the module demo-student, lookup the global service bean `BeanJwt` provided by the module a-jwt. The code is as follows:

```typescript
class ControllerStudent {
  async test() {
    return await this.bean.jwt.create({});
  }
}
```

Get the app container through `this.bean` to lookup the global service bean.
