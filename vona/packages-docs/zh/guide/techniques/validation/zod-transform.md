# Zod Transform

可以使用`Zod Transform`实现更灵活的转换逻辑。

## 创建Zod Transform

比如，在模块 demo-student 中创建一个 Zod Transform: `nameCapitalize`，将学生名的首字符改为大写。

### 1. Cli命令

```bash
$ vona :create:bean zodTransform nameCapitalize --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Zod Transform`
:::

## Zod Transform定义

```typescript
import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export interface TypeZodTransformNameCapitalizeData {
  name: string;
}

export type TypeZodTransformNameCapitalizeResult = TypeZodTransformNameCapitalizeData;

export interface IZodTransformOptionsNameCapitalize extends IDecoratorZodTransformOptions {}

@ZodTransform<IZodTransformOptionsNameCapitalize>()
class ZodTransformNameCapitalize {
  async execute(
    value: TypeZodTransformNameCapitalizeData,
    _options: IZodTransformOptionsNameCapitalize,
  ): Promise<TypeZodTransformNameCapitalizeResult> {
    return { ...value, name: toUpperCaseFirstChar(value.name) };
  }
}
```

- `TypeZodTransformNameCapitalizeData`: 入参类型
- `TypeZodTransformNameCapitalizeResult`: 结果类型
- `IZodTransformOptionsNameCapitalize`: 定义 Zod Transform 参数
- `execute`: 对入参进行转换

## 使用Zod Transform

```diff
import { v } from 'vona-module-a-openapiutils';

@Controller()
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodTransform('demo-student:nameCapitalize')) student: DtoStudentCreate) {}
}
```

- `v.zodTransform`: 此工具函数用于使用 Zod Transform，只需传入 Zod Transform 的名称
  - `nameCapitalize` zod transform 属于模块`demo-student`，因此完整的名称是`demo-student:nameCapitalize`

## Zod Transform参数

可以为 Zod Transform 定义参数，通过参数更灵活的配置 Zod Transform 逻辑。

比如，为 `nameCapitalize` zod transform 定义`lowercase`参数，用于指定是否将首字符转为小写。

### 1. 定义参数类型

```diff
export interface IZodTransformOptionsNameCapitalize extends IDecoratorZodTransformOptions {
+ lowercase: boolean;
}
```

### 2. 提供参数缺省值

```diff
@ZodTransform<IZodTransformOptionsNameCapitalize>({
+ lowercase: false,
})
```

### 3. 使用参数

```diff
import { toLowerCaseFirstChar, toUpperCaseFirstChar } from '@cabloy/word-utils';

export interface TypeZodTransformNameCapitalizeData { name: string }

export type TypeZodTransformNameCapitalizeResult = TypeZodTransformNameCapitalizeData;

export interface IZodTransformOptionsNameCapitalize extends IDecoratorZodTransformOptions {
  lowercase: boolean;
}

@ZodTransform<IZodTransformOptionsNameCapitalize>({
  lowercase: false,
})
class ZodTransformNameCapitalize {
  async execute(
    value: TypeZodTransformNameCapitalizeData,
    options: IZodTransformOptionsNameCapitalize,
  ): Promise<TypeZodTransformNameCapitalizeResult> {
-   return { ...value, name: toUpperCaseFirstChar(value.name) };
+   return { ...value, name: options.lowercase ? toLowerCaseFirstChar(value.name) : toUpperCaseFirstChar(value.name) };
  }
}
```

### 4. 使用时指定参数

可以在使用时指定 Zod Transform 参数。

```diff
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodTransform('demo-student:nameCapitalize', { lowercase: true })) student: DtoStudentCreate) {}
}
```

### 5. App Config

可以在 App Config 中配置 Zod Transform 参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  zodTransform: {
    'demo-student:nameCapitalize': {
      lowercase: true,
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
