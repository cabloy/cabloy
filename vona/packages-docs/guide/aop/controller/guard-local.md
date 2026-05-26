# Local Guard

## Create Guard

For example, create a local guard `admin` in the module demo-student to check whether the current username is `admin`. If not, an exception is thrown.

### 1. Cli command

```bash
$ vona :create:bean guard admin --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Guard`
:::

## Guard Definition

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

- `getCurrentUser`: Get the current user

## Using Guard

### 1. Annotating controller actions

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.guard('demo-student:admin')
  async findMany() {}
}
```

- `@Aspect.guard`: This decorator is used to use local guard. Simply pass the guard name
  - The admin guard belongs to the `demo-student` module, so the full name is `demo-student:admin`

### 2. Annotating controller class

You can use guard for controller classes so that all actions in the class will apply this guard.

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.guard('demo-student:admin')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## Guard Parameters

You can define parameters for guard, allowing for more flexible configuration of guard logic.

For example, define the `name` parameter for the admin guard to control the username that needs to be judged.

### 1. Defining parameter types

```diff
export interface IGuardOptionsAdmin extends IDecoratorGuardOptions {
+ name: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@Guard<IGuardOptionsAdmin>({
+ name: 'admin',
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify local guard parameters for a specific API.

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.guard('demo-student:admin', { name: 'other-name' })
  async findMany() {}
}
```

- When using guard, just provide the parameter value directly

### 5. App Config

Guard parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
