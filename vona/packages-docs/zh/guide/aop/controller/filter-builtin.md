# 内置过滤器

## 全局过滤器：a-error:error

过滤器通常用于对 Error 的处理和日志输出。为了简化使用，VonaJS 提供了一个内置全局过滤器: `a-error:error`。通过`a-error:error`可以满足日常的业务需求。如果需要更深入的定制，则可以创建`局部过滤器`或者`全局过滤器`

## 禁用日志输出

可以针对某个 API 禁用某些 Error 的日志输出，下面以模块 demo-student 的 create 方法为例。

### 1. 禁用内置Error

禁用 errorCode: `422`

```diff
import { Aspect } from 'vona-module-a-aspect';

class ControllerStudent {
  @Web.post()
+ @Aspect.filterGlobal('a-error:error', { logs: { 422: false } })
  async create(){}
}
```

简化写法：

```diff
import { Core } from 'vona-module-a-core';

class ControllerStudent {
  @Web.post()
+ @Core.error({ logs: { 422: false } })
  async create(){}
}
```

### 2. 禁用自定义Error

比如，在模块 demo-student 中有一个自定义 Error： `ErrorTest`

- 如何创建自定义 Error，参见: [Error错误异常](../../essentials/scope/error.md)

由于`ErrorTest`的错误码是`1001`，因此可以禁用 errorCode: `demo-student:1001`

```diff
import { Aspect } from 'vona-module-a-aspect';

class ControllerStudent {
  @Web.post()
+ @Aspect.filterGlobal('a-error:error', { logs: { 'demo-student:1001': false } })
  async create(){
    // throw demo-student:1001
+   this.scope.error.ErrorTest.throw();
  }
}
```

简化写法：

```diff
import { Core } from 'vona-module-a-core';

class ControllerStudent {
  @Web.post()
+ @Core.error({ logs: { 'demo-student:1001': false } })
  async create(){
    // throw demo-student:1001
+   this.scope.error.ErrorTest.throw();
  }
}
```

## App Config

可以在 App Config 中配置过滤器参数，从而对所有 API 生效。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  filter: {
    'a-error:error': {
      logs: {
        '422': false,
        'demo-student:1001': false,
      },
    },
  },
};
```
