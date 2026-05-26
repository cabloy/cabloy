# Built-in Filter

## Global Filter: a-error:error

Filters are commonly used for error handling and logging. To simplify usage, VonaJS provides a built-in global filter: `a-error:error`. `a-error:error` can meet daily business needs. If you need more in-depth customization, you can create local or global filters.

## Disabling Logging

You can disable logging for certain errors for a specific API. The following example uses the `create` method of the `demo-student` module.

### 1. Disabling Built-in Errors

Disabling errorCode: `422`

```diff
import { Aspect } from 'vona-module-a-aspect';

class ControllerStudent {
  @Web.post()
+ @Aspect.filterGlobal('a-error:error', { logs: { 422: false } })
  async create(){}
}
```

Simplified:

```diff
import { Core } from 'vona-module-a-core';

class ControllerStudent {
  @Web.post()
+ @Core.error({ logs: { 422: false } })
  async create(){}
}
```

### 2. Disabling Custom Errors

For example, in the demo-student module, there is a custom Error: `ErrorTest`

- For how to create custom Errors, see: [Error Exception](../../essentials/scope/error.md)

Since the error code for `ErrorTest` is `1001`, we can disable errorCode: `demo-student:1001`

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

Simplified:

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

Filter parameters can be configured in App Config to apply to all APIs.

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
