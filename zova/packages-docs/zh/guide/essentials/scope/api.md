# Api

模块可以集中管理后端 Api 调用，把 Api 调用包装为`Api`资源，从而方便在任何模块访问。

## 创建Api

### 1. Cli命令

```bash
$ zova :create:bean api test --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Create/Api`
:::

依据提示输入 api 的名称，比如`test`，VSCode 插件会自动添加 api 的代码骨架。

## 定义Api

`src/module/demo-student/src/api/test.ts`

```diff
@Api()
class ApiTest {
  echo() {
+   return this.$fetch.get<any, ApiTestEchoResult>('/test/echo');
  }
}
```

关于`$fetch`的用法，参见：[Fetch](../../techniques/server-data/fetch.md)

## 使用Api

可以通过 Scope 实例直接访问 Api。

```diff
class ControllerTest {
  async test() {
+   const res = await this.scope.api.test.echo();
  }
}
```

## 跨模块使用Api

```diff
+ import { ScopeModuleDemoStudent } from 'zova-module-demo-student';

class ControllerOther {
+ @UseScope()
+ $$scopeDemoStudent: ScopeModuleDemoStudent;

  async test() {
+   const res = await this.$$scopeDemoStudent.api.test.echo();
  }
}
```
