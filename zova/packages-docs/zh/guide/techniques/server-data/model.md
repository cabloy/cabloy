# Model: 状态管理

为了提升前端项目的运行性能，Zova 在`$api`基础上使用 Tanstack Query 对远程数据进行缓存管理。

- 参见：[Model: 状态管理](../model/introduction.md)

## 创建Model

在模块 demo-student 中创建一个 model`menu`

### 1. Cli命令

```bash
$ zova :create:bean model menu --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Create/Model`
:::

依据提示输入 model 的名称`menu`，VSCode 插件会自动添加 model 的代码骨架。

## Model定义

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

## 使用Model

采用`@Use`注入 Model 实例即可。

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
