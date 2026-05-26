# Local Pipe

## Create Pipe

For example, create a local pipe `number` in the module demo-student to convert the request parameter to `number` type.

### 1. Cli command

```bash
$ vona :create:bean pipe number --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Pipe`
:::

## Pipe Definition

```typescript
export type TypePipeNumberData = unknown;

export type TypePipeNumberResult = number;

export interface IPipeOptionsNumber extends IDecoratorPipeOptions {}

@Pipe<IPipeOptionsNumber>()
class PipeNumber {
  async transform(
    value: TypePipeNumberData,
    _metadata: RouteHandlerArgumentMeta,
    _options: IPipeOptionsNumber,
  ): Promise<TypePipeNumberResult> {
    const valueNew = Number(value);
    if (Number.isNaN(valueNew)) this.app.throw(400);
    return valueNew;
  }
}
```

- `TypePipeNumberData`: Input parameter type
- `TypePipeNumberResult`: Result type
- `IPipeOptionsNumber`: Defines pipe parameters
- `transform`: Parameter evaluation and conversion

## Using Pipe

### 1. Annotating controller actions

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get(':id')
+ @Aspect.pipe('demo-student:number')
  async findOne(id: number) {}
}
```

- `@Aspect.pipe`: This decorator is used to use local pipe. Simply pass the pipe name
  - The number pipe belongs to the `demo-student` module, so the full name is `demo-student:number`

### 2. Annotating controller class

You can use pipe for controller classes so that all actions in the class will apply this pipe.

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.pipe('demo-student:number')
class ControllerStudent {
  @Web.get(':id')
  async findOne(id: number) {}
}
```

## Pipe Parameters

You can define parameters for pipe, allowing for more flexible configuration of pipe logic.

For example, define the `errorCode` parameter for the number pipe. If the incoming request parameter is not of type number, an exception is thrown with the error code `errorCode`

### 1. Defining parameter types

```diff
export interface IPipeOptionsNumber extends IDecoratorPipeOptions {
+ errorCode: number;
}
```

### 2. Providing default values ​​for parameters

```diff
@Pipe<IPipeOptionsNumber>({
+ errorCode: 400,
})
```

### 3. Using Parameters

```diff
export interface IPipeOptionsNumber extends IDecoratorPipeOptions {
  errorCode: number;
}

@Pipe<IPipeOptionsNumber>({
  errorCode: 400,
})
export class PipeNumber extends BeanBase implements IPipeTransform<TypePipeNumberData, TypePipeNumberResult> {
  async transform(value: TypePipeNumberData, _metadata: RouteHandlerArgumentMeta, options: IPipeOptionsNumber): Promise<TypePipeNumberResult> {
    const valueNew = Number(value);
-    if (Number.isNaN(valueNew)) this.app.throw(400);
+    if (Number.isNaN(valueNew)) this.app.throw(options.errorCode);
    return valueNew;
  }
}
```

### 4. Specify parameters when using

You can specify local pipe parameters for a specific API.

```diff
class ControllerStudent {
  @Web.get(':id')
+ @Aspect.pipe('demo-student:number', { errorCode: 500 })
  async findOne(id: number) {}
}
```

- When using pipe, just provide the parameter value directly

### 5. App Config

Pipe parameters can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  pipe: {
    'demo-student:number': {
      errorCode: 500,
    },
  },
};
```

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
