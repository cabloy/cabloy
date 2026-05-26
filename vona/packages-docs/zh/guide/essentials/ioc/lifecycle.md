# 生命周期

所有 Bean 都可以提供两个生命周期方法。

| 名称          | 说明                             |
| ------------- | -------------------------------- |
| `__init__`    | 在创建bean实例时执行的初始化方法 |
| `__dispose__` | 在bean实例销毁时执行的销毁方法   |

- Vona 提供了两个代码片段，你可以通过输入`init`和`dispose`快速添加相应的生命周期方法

## 举例

```typescript
export class ServiceKnex {
  private _knex: Knex | undefined;

  protected __init__() {
    this._knex = knex();
  }

  protected async __dispose__() {
    if (this._knex) {
      await this._knex.destroy();
      this._knex = undefined;
    }
  }
}
```
