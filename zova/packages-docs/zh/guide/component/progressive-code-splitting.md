# 渐进式代码拆分

Zova 提供了灵活的文件结构，可以根据业务的复杂度进行渐进式代码拆分，从而始终保持代码的简洁、优雅，更利于代码的持续迭代与维护。

## 三级迭代

对组件代码进行渐进式拆分可以参考以下三级迭代：

| 名称   | 说明                                              |
| ------ | ------------------------------------------------- |
| 单文件 | Controller(1)                                     |
| 三文件 | Controller(1) + Render(1) + Style(1)              |
| 多文件 | Controller(1) + Render(n) + Style(n) + Service(n) |

## 单文件

在业务开发的初始阶段，代码比较少，可以采用单文件。

```typescript
class ControllerCard {
  protected render() {
    return null;
  }
}
```

## 三文件

当代码开始变多时，可以将 Render 和 Style 独立出来。

### 创建第一个Render Bean

先将 Render 独立出来。

### 1. Cli命令

```bash
$ zova :refactor:firstRender component/card --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Create First Render Bean`
:::

### 创建第一个Style Bean

再将 Style 独立出来。

### 1. Cli命令

```bash
$ zova :refactor:firstStyle component/card --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Create First Style Bean`
:::

## 多文件

当代码继续变多时，可以继续调整文件结构，创建更多 Render 文件和 Style 文件，也可以创建多个 Service 文件，将状态管理独立出来。

### 创建更多Render Bean

### 1. Cli命令

```bash
$ zova :refactor:anotherRender component/card another --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Create Another Render Bean`
:::

### 创建更多Style Bean

### 1. Cli命令

```bash
$ zova :refactor:anotherStyle component/card another --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Create Another Style Bean`
:::

### 创建更多Service Bean

创建一个 Service`another`，将状态管理独立出来。

### 1. Cli命令

```bash
$ zova :create:bean service component/card/another --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Create/Service`
:::
