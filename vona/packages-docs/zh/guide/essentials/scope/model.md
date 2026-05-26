# Model

模块可以单独提供自己的 Models。

## 创建Model

### 1. Cli命令

```bash
$ vona :create:bean model student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Model`
:::

## 本模块使用Model

可以通过 Scope 实例获取模块的 Model。

```diff
class ServiceStudent {
  async findMany() {
+   return await this.scope.model.student.select();
  }
}
```

## 跨模块使用Model

```diff
class ServiceOther {
  async findMany() {
+   return await this.$scope.demoStudent.model.student.select();
  }
}
```
