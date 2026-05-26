# Entity

Modules can individually provide their own `Entities`

## Create Entity

### 1. Cli command

```bash
$ vona :create:bean entity student --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Create/Entity`
:::

## Use Entity

The `Entity` of the module can be obtained through the `Scope` instance.

```diff
class ControllerStudent {
  async test() {
+   const entityStudent = this.scope.entity.student;
  }
}
```

## Use Entity cross-module

```diff
class ControllerOther {
  async test() {
+   const entityStudent = this.$scope.demoStudent.entity.student;
  }
}
```
