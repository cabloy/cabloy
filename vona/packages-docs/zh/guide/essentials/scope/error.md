# Error错误异常

模块可以单独提供自己的 Error 错误异常。

## 初始化代码骨架

### 1. Cli命令

```bash
$ vona :init:error demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Error`
:::

## 定义Error

定义 Error 分为两个步骤，以模块`demo-student`为例：

### 1. 定义Errors常量

`src/module/demo-student/src/config/errors.ts`

```diff
export const errors = {
+ ErrorTest: 1001,
} as const;
```

约定：错误码 > 1000。

### 2. 定义Error语言资源

英文：`src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ ErrorTest: 'This is a error test',
};
```

中文：`src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ ErrorTest: '这是一个错误测试',
};
```

## 使用Error

可以通过 Scope 实例直接抛出模块的 Error 错误异常。

```diff
class ControllerStudent {
  async test() {
+   this.scope.error.ErrorTest.throw();
  }
}
```

## 跨模块使用Error

```diff
class ControllerOther {
  async test() {
+   this.$scope.demoStudent.error.ErrorTest.throw();
  }
}
```
