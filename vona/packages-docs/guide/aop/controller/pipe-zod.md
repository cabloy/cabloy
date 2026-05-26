# Zod Integration

VonaJS has a large number of built-in argument pipes, which provide a very concise and flexible mechanism for request parameter validation based on [Zod](https://zod.dev)

- See: [Validation](../../techniques/validation/introduction.md)

## Example

Let's take the `ArgNumber` argument pipe created earlier as an example. The same functionality can be achieved using the built-in argument pipe as follows:

```diff
class ControllerStudent {
  @Web.get(':id')
- async findOne(@ArgNumber() @Arg.param('id') id: any) {}
+ async findOne(@Arg.param('id') id: number) {}
}
```

Simply set the type of `id` to `number`

You can also explicitly specify the Zod Schema `z.number()`

```diff
import z from 'zod';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', z.number()) id: number) {}
}
```

Specify a minimum value:

```diff
import z from 'zod';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', z.number().min(1)) id: number) {}
}
```

Equivalent to:

```diff
import { v } from 'vona-module-a-openapiutils';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', v.min(1)) id: number) {}
}
```
