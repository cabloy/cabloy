# Validation

Vona provides a very concise and flexible mechanism for verifying request parameters based on [Zod](https://zod.dev)

## 1. Automatically infer Zod Schema: Basic type/Dto/Entity

If the parameter type is `Basic type/Dto/Entity`, then the system will automatically infer the corresponding Zod Schema for verification.

For example, `findOne(@Arg.query('id') id: number)`, the type of id is `number`, then the automatically inferred Schema is: `z.number()`

For another example, `findOne(@Arg.query() query: DtoStudentInfo)`, the type of query is Dto: `DtoStudentInfo`, then the automatically inferred Schema is: `z.object({...})`

- List of automatically inferred types

| Name    | Description     |
| ------- | --------------- |
| string  | z.string()      |
| number  | z.number()      |
| boolean | z.boolean()     |
| Dto     | z.object({...}) |
| Entity  | z.object({...}) |

## 2. Specify Zod Schema

We can also explicitly specify Zod Schema to provide more complex validation rules. For example, if the URL is `/?id=1`, we require id to be `number` and `>=6`. Then, we can pass parameters to query: `z.number().min(6)`

```typescript
import z from 'zod';

class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', z.number().min(6)) id: number) {}
}
```

## 3. Extending Zod Schema properties

We can also extend new properties based on the existing Zod Schema.

For example, we want to specify id as `number`, and it is `optional`, with a default value of `3`

```typescript
import { v } from 'vona-module-a-openapiutils';

class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', v.default(3), v.optional()) id: number) {}
}
```

First, the system automatically infers the schema For `z.number()`, then, append the `optional` and `default` attributes in sequence, and finally generate the schema: `z.number().optional().default(3)`

Therefore, the above code is equivalent to:

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', z.number().optional().default(3)) id: number) {}
}
```

Also equivalent to:

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', v.default(3), z.number().optional()) id: number) {}
}
```

## 4. Decorator: @Arg.filter

The decorator `@Arg.filter` supports more advanced query parameters, including `columns/where/orders/pageNo/pageSize`

- See:
  - [$Dto.query/DtoQueryBase](../orm/dto/query/introduction.md)
  - [$Dto.queryPage/DtoQueryPageBase](../orm/dto/query-page.md)

## 5. Tool: v.array

For Array type parameters, Vona also provides convenient tools. For example, we require `ids` to be `number[]`:

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('ids', v.array(Number)) ids: number[]) {}
}
```

Equivalent to:

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('ids', v.array(z.number())) ids: number[]) {}
}
```

For another example, we get the students array from the Request body, which is of type `DtoStudentInfo[]`:

```typescript
class ControllerStudent3 {
  @Web.post()
  update(@Arg.body('students', v.array(DtoStudentInfo)) students: DtoStudentInfo[]) {}
}
```

## 6. Tool: v.lazy

For classes that may cause circular references, you can use `v.lazy` to create a lazy schema:

```typescript
@Dto()
export class DtoUserLazy {
  @Api.field(v.optional(), v.lazy(() => DtoUserLazy))
  user?: DtoUserLazy;

  @Api.field(v.optional(), v.array(v.lazy(() => DtoRoleLazy)))
  roles?: DtoRoleLazy[];
}
```

## Decorator List

| Name         | Description                             |
| ------------ | --------------------------------------- |
| @Arg.param   | Gets the value from the request params  |
| @Arg.query   | Gets the value from the request query   |
| @Arg.body    | Gets the value from the request body    |
| @Arg.headers | Gets the value from the request headers |
| @Arg.fields  | Gets the value from the request upload  |
| @Arg.field   | Gets the value from the request upload  |
| @Arg.files   | Gets the value from the request upload  |
| @Arg.file    | Gets the value from the request upload  |
| @Arg.user    | Gets the current user                   |
| @Arg.filter  | Gets the value from the request query   |

## Tool List

VonaJS puts all the utility methods for extending Zod Schema into the group `v`, thus reducing the mental burden.

### 1. Basic Tools

| Name           | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| v.required     | Provide a custom error message for `required`; otherwise, use Zod's built-in error message |
| v.optional     | optional                                                                                   |
| v.default      | default                                                                                    |
| v.object       | object                                                                                     |
| v.strictObject | Same as `z.strictObject(schema.shape)`                                                     |
| v.looseObject  | Same as `z.looseObject(schema.shape)`                                                      |
| v.array        | array                                                                                      |
| v.lazy         | Create a lazy schema                                                                       |

### 2. String Tools

| Name          | Description              |
| ------------- | ------------------------ |
| v.email       | email                    |
| v.url         | url                      |
| v.uuid        | uuid                     |
| v.ipv4        | ipv4                     |
| v.ipv6        | ipv6                     |
| v.min         | Supports `string/number` |
| v.max         | Supports `string/number` |
| v.trim        | trim                     |
| v.toLowerCase | toLowerCase              |
| v.toUpperCase | toUpperCase              |
| v.lowercase   | lowercase                |
| v.uppercase   | uppercase                |
| v.regex       | regex                    |

### 3. Openapi Tools

| Name          | Description |
| ------------- | ----------- |
| v.openapi     | openapi     |
| v.title       | title       |
| v.description | description |
| v.example     | example     |

### 4. Serializer Tools

| Name                  | Description                            |
| --------------------- | -------------------------------------- |
| v.serializerExclude   | Exclude fields                         |
| v.serializerTransform | Transform field values                 |
| v.serializerSensitive | Desensitize fields                     |
| v.serializerGetter    | Generate field values ​​using a getter |

### 5. Zod Tools

| Name           | Description                           |
| -------------- | ------------------------------------- |
| v.zodRefine    | Provides `Zod Refine` capabilities    |
| v.zodTransform | Provides `Zod Transform` capabilities |

### 6. Query Filter Tools

| Name              | Description                              |
| ----------------- | ---------------------------------------- |
| v.filter          | Set the parameters for the Query Filter  |
| v.filterTransform | Provides `Filter Transform` capabilities |

### 7. Special Tools

| Name            | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| v.tableIdentity | Based on the current system configuration, provides `number` or `bigint` validation rules |

## Controller

For a more complete guide on using Controller, see: [Controller](../../rest-api/controller.md)

## Entity

The fields of Entity also support Validation. See: [Entity](../../rest-api/entity.md)

## Dto

The fields of Dto also support Validation. See: [Dto](../../rest-api/dto.md)
