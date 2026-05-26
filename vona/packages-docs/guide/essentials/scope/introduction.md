# Module Scope

In Vona, the actual business code development is done in modules. As a relatively independent business unit, the module contains various types of resources: `Config`, `Constant`, `Locale I18n`, `Error exception`, `Service`, `Model`, `Entity`, etc. In order to uniformly manage these resources and facilitate the definition and use of resources, Vona provides the `Scope` object.

## Why is Vona's IOC container code more concise?

The reason is to prioritize the use of the `dependency lookup` strategy, resulting in fewer decorator functions and fewer type annotations. Accessing module's resources by the `Scope` object is one of the mechanisms for implementing `dependency lookup` strategies.

## this.scope: Obtain scope instance of the current module

All beans inherit from the base class `BeanBase`, thus the `Scope` instance of the module to which the current bean belongs can be directly obtained.

```typescript
class ControllerStudent extends BeanBase {
  async test() {
    console.log(this.scope);
  }
}
```

The `Scope` instance of the module to which the current bean belongs can be obtained through `this.scope`

## this.$scope: Obtain scope instance cross-module

```typescript
class ControllerOther extends BeanBase {
  async test() {
    console.log(this.$scope.demoStudent);
  }
}
```

The `Scope` instance of the module `demo-student` can be obtained through `this.$scope.demoStudent`

```typescript
class ControllerOther extends BeanBase {
  async test() {
    console.log(this.$scope.user);
  }
}
```

If the `providerId` of the module name is `a`, such as `a-user`, then it can be simplified to `user`

## app.scope

If you do not inherit from the base class `BeanBase`, `this.scope` and `this.$scope` cannot be used. Instead, you can use the general method:

`src/backend/play/index.ts`

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const scopeDemoStudent = app.scope('demo-student');
+   const scopeUser = app.scope('a-user');
  });
}
```

## Members of the Scope object

| Name     | Description               |
| -------- | ------------------------- |
| config   | Config of Module          |
| constant | Constant of Module        |
| locale   | I18n of Module            |
| error    | Error exception of Module |
| service  | Services of Module        |
| model    | Models of Module          |
| entity   | Entities of Module        |
