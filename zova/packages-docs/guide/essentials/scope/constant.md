# Constant

Modules can individually provide their own `Constant`

## Initialize code skeleton

### 1. Cli command

```bash
$ zova :init:constant demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Constant`
:::

## Define Constant

Taking the module `demo-student` as an example, define the `Constant` of the module:

`src/module/demo-student/src/config/constants.ts`

```diff
export const constants = {
+ gender: {
+   male: 1,
+   female: 2,
+ },
} as const;
```

Just define the required constants directly, and the system will automatically extract the type information of constants.

## Use Constant

The `Constant` of the module can be obtained through the `Scope` instance.

```diff
class ControllerTest {
  async test() {
+   console.log(this.scope.constant.gender.male);
+   console.log(this.scope.constant.gender.female);
  }
}
```

## Use Constant cross-module

```diff
+ import { ScopeModuleDemoStudent } from 'zova-module-demo-student';

class ControllerOther {
+ @UseScope()
+ $$scopeDemoStudent: ScopeModuleDemoStudent;

  async test() {
+   console.log(this.$$scopeDemoStudent.constant.gender.male);
+   console.log(this.$$scopeDemoStudent.constant.gender.female);
  }
}
```
