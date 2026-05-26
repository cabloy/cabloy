# Lifecycle

All beans can provide two lifecycle methods.

| Name          | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `__init__`    | The initialization method executed when creating a bean instance |
| `__dispose__` | The dispose method executed during bean instance destruction     |

- Vona provides two code snippets, you can quickly add corresponding lifecycle methods by entering `init` or `dispose`

## For Example

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
