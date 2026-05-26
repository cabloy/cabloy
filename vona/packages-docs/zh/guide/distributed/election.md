# Election

如果需要在后端启动一个独立服务，在 VonaJS 中该如何实现呢？

由于 VonaJS 是分布式架构，后端可以启动多个 Workers。那么，应该在哪个 Worker 中启动独立服务呢？

VonaJS 针对此场景提供了`Election`，工作原理如下：

1. 所有 Workers 都会参与竞争，获取所有权
2. 可以指定同时获取所有权的 Workers 数量
3. 取得所有权的 Workers 可以启动服务
4. 如果某个拥有所有权的 Worker 正常退出或者异常终止，那么其他 Workers 就会继续参与竞争

## 创建meta.election

比如，在模块 demo-student 中创建`meta.election`。在选中的 Worker 中启动一个定时器，每隔 2 秒输出`Hello World`

### 1. Cli命令

```bash
$ vona :create:bean meta election --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Meta/Election`
:::

## meta.election定义

```typescript
export type TypeElectionObtainResource = 'echo';

@Meta()
export class MetaElection extends BeanElectionBase<TypeElectionObtainResource> {}
```

- `TypeElectionObtainResource`: 定义 Election 资源的类型

## 创建 Module Monkey

接下来创建`Module Monkey`，响应`appStarted`和`appClose`钩子。

- 参见: [应用启动自定义](../env-config/app-start/introduction.md)

```typescript
export class Monkey extends BeanSimple implements IMonkeyAppStarted {
  async appStarted() {
    const scope = this.app.scope(__ThisModule__);
    scope.election.obtain(
      'echo',
      () => {
        // custom logic
      },
      async () => {
        // cleanup
      },
    );
  }
}
```

- `appStarted`: 调用`election.obtain`获取指定资源的所有权。当取得所有权就会调用回调函数

## Tickets

在调用`election.obtain`时，可以指定允许多个 Workers 取得所有权:

```diff
async appStarted() {
  const scope = this.app.scope(__ThisModule__);
  scope.election.obtain('echo', () => {
    // custom logic
  }, async () => {
    // cleanup
+ }, { tickets: 2 });
}
```

| 名称    | 说明                                       |
| ------- | ------------------------------------------ |
| tickets | 允许指定数量的Workers取得所有权，默认为`1` |
