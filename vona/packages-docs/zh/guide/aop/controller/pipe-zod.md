# Zod整合

VonaJS 内置了大量参数管道，基于[Zod](https://zod.dev) 提供了非常简洁、灵活的机制对请求参数作校验。

- 参见: [参数校验](../../techniques/validation/introduction.md)

## 举例

仍以前面创建的参数管道`ArgNumber`为例。使用内置参数管道实现同样的能力，代码如下：

```diff
class ControllerStudent {
  @Web.get(':id')
- async findOne(@ArgNumber() @Arg.param('id') id: any) {}
+ async findOne(@Arg.param('id') id: number) {}
}
```

只需设置`id`的类型为`number`即可。

也可以明确指定 Zod Schema `z.number()`

```diff
import z from 'zod';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', z.number()) id: number) {}
}
```

指定最小值：

```diff
import z from 'zod';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', z.number().min(1)) id: number) {}
}
```

等价于：

```diff
import { v } from 'vona-module-a-openapiutils';

class ControllerStudent {
  @Web.get(':id')
+ async findOne(@Arg.param('id', v.min(1)) id: number) {}
}
```
