# 生命周期

所有 Bean 都可以提供两个生命周期方法。

| 名称          | 说明                                           |
| ------------- | ---------------------------------------------- |
| `__init__`    | 在创建bean实例时执行的初始化方法，并且支持异步 |
| `__dispose__` | 在bean实例销毁时执行的销毁方法                 |

- Zova 提供了两个代码片段，你可以通过输入`init`和`dispose`快速添加相应的生命周期方法

## 举例：$computed

```typescript
export class Counter {
  count: number = 0;
  count2: string;

  protected async __init__() {
    this.count2 = this.$computed(() => {
      return `=== ${this.count} ===`;
    });
  }
}
```

## 举例：$watch

```typescript
export class Counter {
  count: number = 0;

  protected async __init__() {
    this.$watch(
      () => this.count,
      () => {
        console.log('changed: ', this.count);
      },
    );
  }
}
```
