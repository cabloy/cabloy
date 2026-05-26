# Module Scope

In Zova, the actual business code development is done in modules. As a relatively independent business unit, the module contains various types of resources: `Config`, `Constant`, `Locale I18n`, `Error exception`, `Api`, etc. In order to uniformly manage these resources and facilitate the definition and use of resources, Zova provides the `Scope` object.

## Why is Zova's IOC container code more concise?

The reason is to prioritize the use of the `dependency lookup` strategy, resulting in fewer decorator functions and fewer type annotations. Accessing module's resources by the `Scope` object is one of the mechanisms for implementing `dependency lookup` strategies.

## this.scope: Obtain scope instance of the current module

All beans inherit from the base class `BeanBase`, thus the `Scope` instance of the module to which the current bean belongs can be directly obtained.

```typescript
class ControllerTest extends BeanBase {
  async test() {
    console.log(this.scope);
  }
}
```

- The `Scope` instance of the module to which the current bean belongs can be obtained through `this.scope`

## Members of the Scope object

| Name      | Description               |
| --------- | ------------------------- |
| config    | Config of Module          |
| constant  | Constant of Module        |
| locale    | I18n of Module            |
| error     | Error exception of Module |
| api       | Api of Module             |
| apiSchema | Api Schema of Module      |

## How to obtain Scope Instance cross-module?

So, how to obtain `Scope` instances of other modules?

The `Scope` object itself is also a bean, so you can directly use `dependency injection` to obtain `Scope` instances of other modules.

```typescript
import { UseScope } from 'zova';
import { ScopeModuleHomeBase } from 'zova-module-home-base';

class ControllerTest {
  @UseScope()
  $$scopeHomeBase: ScopeModuleHomeBase;

  async test() {
    console.log(this.$$scopeHomeBase);
  }
}
```

- Type of `Scope` object imported from module `home-base`
- Use the `@UseScope` decorator function
- The system will automatically find the `Scope` instance of the module `home-base` and inject it into the variable `$$scopeHomeBase`

::: info
Based on the support of the compiler, `@UseScope` will automatically switch to asynchronous loading mode. Specifically, the system will asynchronously load the module `home-base`, then obtain the Scope instance of the module, and then inject it
:::
