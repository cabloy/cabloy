# Zod Refine

可以使用`Zod Refine`实现更灵活的验证规则。

## 创建Zod Refine

比如，在模块 demo-student 中创建一个 Zod Refine: `nameExists`，判断学生名是否已经存在。

### 1. Cli命令

```bash
$ vona :create:bean zodRefine nameExists --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Zod Refine`
:::

## Zod Refine定义

```typescript
export interface TypeZodRefineNameExistsData {
  name: string;
}

export interface IZodRefineOptionsNameExists extends IDecoratorZodRefineOptions {}

@ZodRefine<IZodRefineOptionsNameExists>()
class ZodRefineNameExists {
  async execute(
    value: TypeZodRefineNameExistsData,
    refinementCtx: TypeRefinementCtx,
    _options: IZodRefineOptionsNameExists,
  ) {
    const student = await this.scope.model.student.getByName(value.name);
    if (student) {
      refinementCtx.addIssue({
        code: 'custom',
        message: 'Student Exists',
        path: ['name'],
      });
    }
  }
}
```

- `TypeZodRefineNameExistsData`: 入参类型
- `IZodRefineOptionsNameExists`: 定义 Zod Refine 参数
- `execute`: 对入参进行判断，如果学生已存在，则调用`refinementCtx.addIssue`生成自定义错误消息

## 使用Zod Refine

```diff
import { v } from 'vona-module-a-openapiutils';

@Controller()
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodRefine('demo-student:nameExists')) student: DtoStudentCreate) {}
}
```

- `v.zodRefine`: 此工具函数用于使用 Zod Refine，只需传入 Zod Refine 的名称
  - `nameExists` zod refine 属于模块`demo-student`，因此完整的名称是`demo-student:nameExists`

## Zod Refine参数

可以为 Zod Refine 定义参数，通过参数更灵活的配置 Zod Refine 逻辑。

比如，为 `nameExists` zod refine 定义`errorMessage`参数，用于提供自定义错误消息。

### 1. 定义参数类型

```diff
export interface IZodRefineOptionsNameExists extends IDecoratorZodRefineOptions {
+ errorMessage: string;
}
```

### 2. 提供参数缺省值

```diff
@ZodRefine<IZodRefineOptionsNameExists>({
+ errorMessage: 'Student Exists',
})
```

### 3. 使用参数

```diff
export interface TypeZodRefineNameExistsData { name: string }

export interface IZodRefineOptionsNameExists extends IDecoratorZodRefineOptions {
  errorMessage: string;
}

@ZodRefine<IZodRefineOptionsNameExists>({
  errorMessage: 'Student Exists',
})
class ZodRefineNameExists {
  async execute(value: TypeZodRefineNameExistsData, refinementCtx: TypeRefinementCtx, options: IZodRefineOptionsNameExists) {
    const student = await this.scope.model.student.getByName(value.name);
    if (student) {
      refinementCtx.addIssue({
        code: 'custom',
-       message: 'Student Exists',
+       message: options.errorMessage,
        path: ['name'],
      });
    }
  }
}
```

### 4. 使用时指定参数

可以在使用时指定 Zod Refine 参数。

```diff
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodRefine('demo-student:nameExists', { errorMessage: 'Student Exists!!!' })) student: DtoStudentCreate) {}
}
```

### 5. App Config

可以在 App Config 中配置 Zod Refine 参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  zodRefine: {
    'demo-student:nameExists': {
      errorMessage: 'Student Exists!!!',
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
