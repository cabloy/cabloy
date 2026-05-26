# Model: State Management

To improve the runtime performance of frontend projects, Zova uses Tanstack Query on top of `$api` to manage caching of remote data.

- See: [Model: State Management](../model/introduction.md)

## Creating a Model

Create a model `menu` in the `demo-student` module.

### 1. CLI Command

```bash
$ zova :create:bean model menu --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Zova Create/Model`
:::

Follow the prompts to enter the model name `menu`, and the VSCode plugin will automatically add the model code skeleton.

## Model Definition

`src/module/demo-student/src/model/menu.ts`

```typescript
@Model()
export class ModelMenu {
  retrieveMenus() {
    return this.$useStateData({
      queryKey: ['retrieveMenus'],
      queryFn: async () => {
        return await this.$api.homeBaseMenu.retrieveMenus({
          params: { publicPath: '' },
        });
      },
    });
  }
}
```

## Using Model

Simply use `@Use` to inject the Model instance.

```typescript
import { ModelMenu } from 'zova-module-demo-student';

class ControllerTest {
  @Use()
  $$modelMenu: ModelMenu;

  protected render() {
    const { data, error } = this.$$modelMenu.retrieveMenus();
    if (error) {
      return <div>{error.message}</div>;
    }
    return <div>{data}</div>;
  }
}
```
