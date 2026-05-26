# Zod Refine

You can use `Zod Refine` to implement more flexible validation rules.

## Create Zod Refine

For example, create a Zod Refine `nameExists` in the module demo-student to check if the student name already exists.

### 1. Cli command

```bash
$ vona :create:bean zodRefine nameExists --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Bean/Zod Refine`
:::

## Zod Refine Definition

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

- `TypeZodRefineNameExistsData`: Input parameter type
- `IZodRefineOptionsNameExists`: Defines Zod Refine parameters
- `execute`: Validates the input parameter. If the student already exists, `refinementCtx.addIssue` is called to generate a custom error message

## Using Zod Refine

```diff
import { v } from 'vona-module-a-openapiutils';

@Controller()
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodRefine('demo-student:nameExists')) student: DtoStudentCreate) {}
}
```

- `v.zodRefine`: This function is used to use Zod Refine. Simply pass the Zod Refine name
  - The `nameExists` Zod Refine belongs to the `demo-student` module, so the full name is `demo-student:nameExists`

## Zod Refine Parameters

You can define parameters for Zod Refine, allowing for more flexible configuration of Zod Refine logic.

For example, define the `errorMessage` parameter for the `nameExists` Zod Refine to provide custom error message.

### 1. Defining parameter types

```diff
export interface IZodRefineOptionsNameExists extends IDecoratorZodRefineOptions {
+ errorMessage: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@ZodRefine<IZodRefineOptionsNameExists>({
+ errorMessage: 'Student Exists',
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify Zod Refine parameters when using.

```diff
class ControllerStudent {
  @Web.post()
+ async create(@Arg.body(v.zodRefine('demo-student:nameExists', { errorMessage: 'Student Exists!!!' })) student: DtoStudentCreate) {}
}
```

### 5. App Config

Zod Refine parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
