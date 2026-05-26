# Zod Transform

You can use `Zod Transform` to implement more flexible transform logic.

## Create Zod Transform

For example, create a Zod Transform `nameCapitalize` in the module demo-student to capitalize the first character of a student's name.

### 1. Cli command

```bash
$ vona :create:bean zodTransform nameCapitalize --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Bean/Zod Transform`
:::

## Zod Transform Definition

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

- `TypeZodTransformNameCapitalizeData`: Input parameter type
- `TypeZodTransformNameCapitalizeResult`: Result type
- `IZodTransformOptionsNameCapitalize`: Defines Zod Transform parameters
- `execute`: Transform the input parameters

## Using Zod Transform

```diff
import { v } from 'vona-module-a-openapiutils';

@Controller()
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodTransform('demo-student:nameCapitalize')) student: DtoStudentCreate) {}
}
```

- `v.zodTransform`: This function is used to use Zod Transform. Simply pass the Zod Transform name
  - The `nameCapitalize` Zod Transform belongs to the `demo-student` module, so the full name is `demo-student:nameCapitalize`

## Zod Transform Parameters

You can define parameters for Zod Transform, allowing for more flexible configuration of Zod Transform logic.

For example, define the `lowercase` parameter for the `nameCapitalize` Zod Transform to specify whether to convert the first character to lowercase.

### 1. Defining parameter types

```diff
export interface IZodTransformOptionsNameCapitalize extends IDecoratorZodTransformOptions {
+ lowercase: boolean;
}
```

### 2. Providing default values ​​for parameters

```diff
@ZodTransform<IZodTransformOptionsNameCapitalize>({
+ lowercase: false,
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify Zod Transform parameters when using.

```diff
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodTransform('demo-student:nameCapitalize', { lowercase: true })) student: DtoStudentCreate) {}
}
```

### 5. App Config

Zod Transform parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
