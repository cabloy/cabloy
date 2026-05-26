# 页面Query

Zova 对页面`Query`进行了强化，提供了 Typescript 类型化支持。

## 添加Query代码骨架

为页面`counter`添加 Query 代码骨架。

### 1. Cli命令

```bash
$ zova :refactor:pageQuery counter --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/page/pageName]: `Zova Refactor/Add Page Query`
:::

## 添加Zod Schema

添加字段 Schema。

```diff
export const ControllerPageCounterSchemaQuery = z.object({
+ name: z.string().optional(),
+ age: z.number().optional(),
});
```

## 使用Query

Zova 在`controller` bean 的基类中注入了`$query`对象，从而可以直接通过`this.$query`访问 Query 参数，并且支持类型提示。

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
+       <div>{this.$query.name}</div>
+       <div>{this.$query.age}</div>
      </div>
    );
  }
}
```

## 传入Query

在调用页面跳转的方法时也可以传入 Query 参数，并且支持类型提示。

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            const url = this.$router.getPagePath('/demo/student/counter', {
              query: {
+               name: 'tom',
+               age: 18,
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
