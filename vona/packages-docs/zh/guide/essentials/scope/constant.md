# Constant常量

模块可以单独提供自己的 Constant 常量。

## 初始化代码骨架

### 1. Cli命令

```bash
$ vona :init:constant demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Constant`
:::

## 定义Constant

以模块`demo-student`为例，定义模块的 Constant 常量：

`src/module/demo-student/src/config/constants.ts`

```diff
export const constants = {
+ gender: {
+   male: 1,
+   female: 2,
+ },
} as const;
```

直接定义所需要的常量即可，系统会自动提取 Constant 的类型信息。

## 使用Constant

可以通过 Scope 实例获取模块的 Constant 常量。

```diff
class ControllerStudent {
  async test() {
+   console.log(this.scope.constant.gender.male);
+   console.log(this.scope.constant.gender.female);
  }
}
```

## 跨模块使用Constant

```diff
class ControllerOther {
  async test() {
+   console.log(this.$scope.demoStudent.constant.gender.male);
+   console.log(this.$scope.demoStudent.constant.gender.female);
  }
}
```
