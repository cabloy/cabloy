# 局部守卫

## 创建守卫

比如，在模块 demo-student 中创建一个局部守卫: `admin`，用于判断当前用户名是否为`admin`，如果不是则抛出异常。

### 1. Cli命令

```bash
$ vona :create:bean guard admin --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Guard`
:::

## 守卫定义

```typescript
export interface IGuardOptionsAdmin extends IDecoratorGuardOptions {}

@Guard<IGuardOptionsAdmin>()
class GuardAdmin {
  async execute(_options: IGuardOptionsAdmin, next: Next): Promise<boolean> {
    const user = this.ctx.user;
    if (!user || user.name !== 'admin') this.app.throw(403);
    // next
    return next();
  }
}
```

- `getCurrentUser`: 取得当前用户

## 使用守卫

### 1. 标注控制器方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.guard('demo-student:admin')
  async findMany() {}
}
```

- `@Aspect.guard`: 此装饰器用于使用局部守卫，只需传入守卫的名称
  - admin 守卫属于模块`demo-student`，因此完整的名称是`demo-student:admin`

### 2. 标注控制器类

可以针对控制器类使用守卫，从而类中所有方法都会应用此守卫。

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.guard('demo-student:admin')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## 守卫参数

可以为守卫定义参数，通过参数更灵活的配置守卫逻辑。

比如，为 admin 守卫定义`name`参数，用于控制需要判断的用户名。

### 1. 定义参数类型

```diff
export interface IGuardOptionsAdmin extends IDecoratorGuardOptions {
+ name: string;
}
```

### 2. 提供参数缺省值

```diff
@Guard<IGuardOptionsAdmin>({
+ name: 'admin',
})
```

### 3. 使用参数

```diff
export interface IGuardOptionsAdmin extends IDecoratorGuardOptions {
  name: string;
}

@Guard<IGuardOptionsAdmin>({
  name: 'admin',
})
export class GuardAdmin extends BeanBase implements IGuardExecute {
  async execute(options: IGuardOptionsAdmin, next: Next): Promise<boolean> {
    const user = this.ctx.user;
-   if (!user || user.name !== 'admin') this.app.throw(403);
+   if (!user || user.name !== options.name) this.app.throw(403);
    // next
    return next();
  }
}
```

### 4. 使用时指定参数

可以针对某个 API 单独指定局部守卫的参数。

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.guard('demo-student:admin', { name: 'other-name' })
  async findMany() {}
}
```

- 在使用守卫时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置守卫参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  guard: {
    'demo-student:admin': {
      name: 'other-name',
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
