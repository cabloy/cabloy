# Service

Modules can individually provide their own `Services`

## Create Service

### 1. Cli command

```bash
$ vona :create:bean service student --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Create/Service`
:::

## Use Service

The `Service` of the module can be obtained through the `Scope` instance.

```diff
class ControllerStudent {
  async findMany() {
+   return await this.scope.service.student.findMany();
  }
}
```

## Use Service cross-module

```diff
class ControllerOther {
  async findMany() {
+   return await this.$scope.demoStudent.service.student.findMany();
  }
}
```
