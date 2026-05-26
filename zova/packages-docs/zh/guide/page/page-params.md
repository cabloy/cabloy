# 页面Params

Zova 对页面`Params`进行了强化，提供了 Typescript 类型化支持。

## 添加Params代码骨架

为页面`counter`添加 Params 代码骨架。

### 1. Cli命令

```bash
$ zova :refactor:pageParams counter --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/page/pageName]: `Zova Refactor/Add Page Params`
:::

## 添加Zod Schema

添加字段 Schema。

```diff
export const ControllerPageCounterSchemaParams = z.object({
+ id: z.number().optional().default(0),
});
```

## 路由name

为了支持 Params，需要在路由记录上使用`name`字段，并且重新生成模块的`.metadata`

### 1. 路由记录

`src/module/demo-student/src/routes.ts`

```diff
export const routes: IModuleRoute[] = [
  {
+   name: 'counter',
-   path: 'counter',
+   path: 'counter/:id?',
    component: ZPageCounter,
  },
];
```

### 2. 重新生成模块的.metadata

需要重新生成模块的.metadata，以便让路由记录的变更生效。

- Cli 命令

```bash
$ zova :tools:metadata demo-student
```

- 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Tools/Generate .metadata`
:::

## 使用Params

Zova 在`controller` bean 的基类中注入了`$params`对象，从而可以直接通过`this.$params`访问 Params 参数，并且支持类型提示。

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
+       <div>{this.$params.id}</div>
      </div>
    );
  }
}
```

## 传入Params

在调用页面跳转的方法时也可以传入 Params 参数，并且支持类型提示。

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            const url = this.$router.getPagePath('/demo/student/counter/:id?', {
              params: {
+               id: 1,
              },
            });
            this.$router.push(url);
          }}
        >
          Go To
        </button>
      </div>
    );
  }
}
```
