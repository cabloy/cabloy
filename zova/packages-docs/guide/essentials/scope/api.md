# Api

Modules can centrally manage backend Api calls and package Api calls as `api` resources, making them easy to access in any module.

## Create Api

### 1. Cli command

```bash
$ zova :create:bean api test --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Create/Api`
:::

Enter the name of api according to the prompt, such as `test`. The VSCode extension will automatically create the code skeleton of `api`

## Define Api

`src/module/demo-student/src/api/test.ts`

```diff
@Api()
class ApiTest {
  echo() {
+   return this.$fetch.get<any, ApiTestEchoResult>('/test/echo');
  }
}
```

For the usage of `$fetch`, see: [Fetch](../../techniques/server-data/fetch.md)

## Use API

You can directly access API through Scope instance.

```diff
class ControllerTest {
  async test() {
+   const res = await this.scope.api.test.echo();
  }
}
```

## Use API cross-module

```diff
+ import { ScopeModuleDemoStudent } from 'zova-module-demo-student';

class ControllerOther {
+ @UseScope()
+ $$scopeDemoStudent: ScopeModuleDemoStudent;

  async test() {
+   const res = await this.$$scopeDemoStudent.api.test.echo();
  }
}
```
