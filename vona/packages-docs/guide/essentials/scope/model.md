# Model

Modules can individually provide their own `Models`

## Create Model

### 1. Cli command

```bash
$ vona :create:bean model student --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Create/Model`
:::

## Use Model

The `Model` of the module can be obtained through the `Scope` instance.

```diff
class ServiceStudent {
  async findMany() {
+   return await this.scope.model.student.select();
  }
}
```

## Use Model cross-module

```diff
class ServiceOther {
  async findMany() {
+   return await this.$scope.demoStudent.model.student.select();
  }
}
```
