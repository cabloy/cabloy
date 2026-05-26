# I18n

Modules can individually provide their own `I18n` language resources.

## Initialize code skeleton

### 1. Cli command

```bash
$ zova :init:locale demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Locale`
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
class ControllerTest {
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
+ import { ScopeModuleDemoStudent } from 'zova-module-demo-student';

class ControllerOther {
+ @UseScope()
+ $$scopeDemoStudent: ScopeModuleDemoStudent;

  async test() {
+   console.log(this.$$scopeDemoStudent.locale.HelloWorld());
  }
}
```

## Override language resources

You can use `project-level` language resources to override `module-level` language resources.

English: `src/front/config/locale/en-us.ts`

```diff
export default {
  modules: {
    'demo-basic': {
+     HelloWorld: 'Hello World!!!',
    },
  },
};
```

Chinese: `src/front/config/locale/zh-cn.ts`

```diff
export default {
  modules: {
    'demo-basic': {
+     HelloWorld: '您好世界!!!',
    },
  },
};
```
