# Error Exception

Modules can individually provide their own `Error` exceptions.

## Initialize code skeleton

### 1. Cli command

```bash
$ vona :init:error demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Init/Error`
:::

## Define Error

It takes two steps to define `Error`. Taking the module `demo-student` as an example:

### 1. Define Errors

`src/module/demo-student/src/config/errors.ts`

```diff
export const errors = {
+ ErrorTest: 1001,
} as const;
```

Convention: Error Code > 1000.

### 2. Define Error language resources

English: `src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ ErrorTest: 'This is a error test',
};
```

Chinese: `src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ ErrorTest: '这是一个错误测试',
};
```

## Use Error

You can directly throw the module's `Error` exception through the `Scope` instance.

```diff
class ControllerStudent {
  async test() {
+   this.scope.error.ErrorTest.throw();
  }
}
```

## Use Error cross-module

```diff
class ControllerOther {
  async test() {
+   this.$scope.demoStudent.error.ErrorTest.throw();
  }
}
```
