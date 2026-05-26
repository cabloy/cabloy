# Entity

模块可以单独提供自己的 Entities。

## 创建Entity

### 1. Cli命令

```bash
$ vona :create:bean entity student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Entity`
:::

## 本模块使用Entity

可以通过 Scope 实例获取模块的 Entity。

```diff
class ControllerStudent {
  async test() {
+   const entityStudent = this.scope.entity.student;
  }
}
```

## 跨模块使用Entity

```diff
class ControllerOther {
  async test() {
+   const entityStudent = this.$scope.demoStudent.entity.student;
  }
}
```
