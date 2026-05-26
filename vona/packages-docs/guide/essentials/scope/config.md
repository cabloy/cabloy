# Config

Modules can individually provide their own `Config` configuration.

## Initialize code skeleton

### 1. Cli command

```bash
$ vona :init:config demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Init/Config`
:::

## Define Config

Taking the module `demo-student` as an example, define the `Config` configuration of the module:

`src/module/demo-student/src/config/config.ts`

```diff
export function config(_app: VonaApplication) {
  return {
+   title: 'Hello World',
  };
}
```

Just define the required configuration fields directly, and the system will automatically extract the type information of config.

## Use Config

The `Config` configuration of the module can be obtained through the `Scope` instance.

```diff
class ControllerStudent {
  async test() {
+   console.log(this.scope.config.title);
  }
}
```

## Use Config cross-module

```diff
class ControllerOther {
  async test() {
+   console.log(this.$scope.demoStudent.config.title);
  }
}
```

## Override Config

You can use `project-level` Config to override `module-level` Config.

`src/backend/config/config/config.ts`

```diff
// modules
config.modules = {
  'demo-student': {
+   title: 'Hello World!!',
  },
};
```
