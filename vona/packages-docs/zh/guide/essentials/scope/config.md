# Config配置

模块可以单独提供自己的 Config 配置。

## 初始化代码骨架

### 1. Cli命令

```bash
$ vona :init:config demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Config`
:::

## 定义Config

以模块`demo-student`为例，定义模块的 Config 配置：

`src/module/demo-student/src/config/config.ts`

```diff
export function config(_app: VonaApplication) {
  return {
+   title: 'Hello World',
  };
}
```

直接定义所需要的配置字段即可，系统会自动提取 Config 的类型信息。

## 使用Config

可以通过 Scope 实例获取模块的 Config 配置。

```diff
class ControllerStudent {
  async test() {
+   console.log(this.scope.config.title);
  }
}
```

## 跨模块使用Config

```diff
class ControllerOther {
  async test() {
+   console.log(this.$scope.demoStudent.config.title);
  }
}
```

## 覆盖Config配置

可以使用`项目级别`的 Config 配置覆盖`模块级别`的 Config 配置。

`src/backend/config/config/config.ts`

```diff
// modules
config.modules = {
  'demo-student': {
+   title: 'Hello World!!',
  },
};
```
