# I18n

Modules can individually provide their own `I18n` language resources.

## Initialize code skeleton

### 1. Cli command

```bash
$ vona :init:locale demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Init/Locale`
:::

## Define language resources

Taking the module `demo-student` as an example, define the `I18n` language resources of the module:

English: `src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ HelloWorld: 'Hello World',
};
```

Chinese: `src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ HelloWorld: '您好世界',
};
```

## Use language resources

The `I18n` language resources of the module can be obtained through the `locale` object of the `Scope` instance.

```diff
class ControllerStudent {
  async test() {
    // use current locale
+   const message1 = this.scope.locale.HelloWorld();
    // use locale en-us
+   const message2 = this.scope.locale.HelloWorld.locale('en-us');
    // use locale zh-cn
+   const message3 = this.scope.locale.HelloWorld.locale('zh-cn');
    console.log(message1, message2, message3);
  }
}
```

## Use language resources cross-module

```diff
class ControllerOther {
  async test() {
    // use current locale
+   const message1 = this.$scope.demoStudent.locale.HelloWorld();
    // use locale en-us
+   const message2 = this.$scope.demoStudent.locale.HelloWorld.locale('en-us');
    // use locale zh-cn
+   const message3 = this.$scope.demoStudent.locale.HelloWorld.locale('zh-cn');
    console.log(message1, message2, message3);
  }
}
```

## Override language resources

You can use `project-level` language resources to override `module-level` language resources.

English: `src/backend/config/locale/en-us.ts`

```diff
locale.modules = {
  'demo-student': {
+   HelloWorld: 'Hello World!!!',
  },
};
```

Chinese: `src/backend/config/locale/zh-cn.ts`

```diff
locale.modules = {
  'demo-student': {
+   HelloWorld: '您好世界!!!',
  },
};
```
