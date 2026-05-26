# I18n国际化

模块可以单独提供自己的 I18n 语言资源。

## 初始化代码骨架

### 1. Cli命令

```bash
$ vona :init:locale demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Locale`
:::

## 定义语言资源

以模块`demo-student`为例，定义模块的语言资源：

英文：`src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ HelloWorld: 'Hello World',
};
```

中文：`src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ HelloWorld: '您好世界',
};
```

## 使用语言资源

可以通过 Scope 实例提供的`locale`对象获取模块的语言资源。

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

## 跨模块使用语言资源

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

## 覆盖语言资源

可以使用`项目级别`的语言资源覆盖`模块级别`的语言资源。

英文：`src/backend/config/locale/en-us.ts`

```diff
locale.modules = {
  'demo-student': {
+   HelloWorld: 'Hello World!!!',
  },
};
```

中文：`src/backend/config/locale/zh-cn.ts`

```diff
locale.modules = {
  'demo-student': {
+   HelloWorld: '您好世界!!!',
  },
};
```
