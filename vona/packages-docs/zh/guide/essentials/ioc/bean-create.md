# Create Bean

可以通过 Cli 命令或者菜单命令创建 Bean Class。

## 举例：创建Service Bean

在模块 demo-student 中创建一个 Service Bean：`student`

### 1. Cli 命令

```bash
$ vona :create:bean service student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Service`
:::

## 举例：创建全局Service Bean

在模块 demo-student 中创建一个全局 Service Bean：`test`

### 1. Cli 命令

```bash
$ vona :create:bean bean test --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Service Global`
:::
