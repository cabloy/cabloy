# Service

模块可以单独提供自己的 Services。

## 创建Service

### 1. Cli命令

```bash
$ vona :create:bean service student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Service`
:::

## 本模块使用Service

可以通过 Scope 实例获取模块的 Service。

```diff
class ControllerStudent {
  async findMany() {
+   return await this.scope.service.student.findMany();
  }
}
```

## 跨模块使用Service

```diff
class ControllerOther {
  async findMany() {
+   return await this.$scope.demoStudent.service.student.findMany();
  }
}
```
