# 扩展数据

在使用`push/pushAsync`方法推送任务时，可以传入扩展数据。

## 举例

```diff
class ControllerStudent {
  async test() {
    const data = { a: 1, b: 2 };
    this.scope.queue.add.push(data, {
+     extraData: {
+       request: {
+         headers: {
+           'x-custom': 'xxxx',
+         },
+       },
+     },
    });
  }
}
```

- `extraData.request.headers`: 传入 header 值

在执行任务时，可以直接取得`header`值：

```diff
@Queue()
class QueueAdd {
  async execute(data, _options) {
+   console.log(this.ctx.headers['x-custom']);
  }
}
```

## Headers透传

VonaJS 提供了一个约定：对于以`x-vona-data-`为前缀的 Headers，会自动追加至`扩展数据`，从而透传至任务中。
