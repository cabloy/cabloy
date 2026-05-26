# Argument Pipe

In actual development, we rarely use local and global pipes. Instead, we use argument pipes.

## Create Argument Pipe

Argument pipe do not exist independently; they are created based on local pipe. The following uses the local pipe `number` as an example to demonstrate how to create an argument pipe.

```diff
+ import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';

@Pipe()
class PipeNumber {
  async transform(value: TypePipeNumberData) {
    const valueNew = Number(value);
    if (Number.isNaN(valueNew)) this.app.throw(400);
    return valueNew;
  }
}

+ export const ArgNumber = createArgumentPipe('demo-student:number');
```

- `createArgumentPipe`: Pass in the local pipe name and create the argument pipe decorator

## Using Argument Pipe

Use the argument pipe directly on the method parameters.

```diff
class ControllerStudent {
  @Web.get(':id')
+ async findOne(@ArgNumber() @Arg.param('id') id: any) {}
}
```

- `@Arg.param`: Built-in argument pipe
- Argument pipes order: `@Arg.param` > `@ArgNumber`

## Specifying Parameters When Using

You can specify pipe parameters when using pipes.

```diff
class ControllerStudent {
  @Web.get(':id')
- async findOne(@ArgNumber() @Arg.param('id') id: any) {}
+ async findOne(@ArgNumber({ errorCode: 500 }) @Arg.param('id') id: any) {}
}
```

::: info
Why use `id: any`?

This is to demonstrate the use of the argument pipe. If you use `id: number`, you already have the ability to validate number-type parameters, eliminating the need to use `@ArgNumber()`
:::
