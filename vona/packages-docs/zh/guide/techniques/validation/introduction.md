# Validation参数校验

Vona 基于[Zod](https://zod.dev) 提供了非常简洁、灵活的机制对请求参数作校验。

## 1. 自动推断Zod Schema：基础类型/Dto/Entity

如果参数类型是`基础类型/Dto/Entity`，那么，系统就会自动推断出对应的 Zod Schema，从而进行校验。

比如，`findOne(@Arg.query('id') id: number)`，id 的类型是`number`，那么自动推断出来的 Schema 就是：`z.number()`

再比如，`findOne(@Arg.query() query: DtoStudentInfo)`，query 的类型是 Dto: `DtoStudentInfo`，那么自动推断出来的 Schema 就是：`z.object({...})`

- 可自动推断的类型清单

| 名称    | 说明            |
| ------- | --------------- |
| string  | z.string()      |
| number  | z.number()      |
| boolean | z.boolean()     |
| Dto     | z.object({...}) |
| Entity  | z.object({...}) |

## 2. 指定Zod Schema

还可以显式的指定 Zod Schema，从而提供更加复杂的校验规则。比如，URL 为`/?id=1`，要求 id 为`number`，并且`>=6`。那么，可以给 query 传入参数：`z.number().min(6)`

```typescript
import z from 'zod';

class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', z.number().min(6)) id: number) {}
}
```

## 3. 扩展Zod Schema的属性

还可以在现有的 Zod Schema 基础之上扩展新的属性。

比如，指定 id 为`number`，并且是`可选`，默认值为`3`

```typescript
import { v } from 'vona-module-a-openapiutils';

class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', v.default(3), v.optional()) id: number) {}
}
```

首先，系统自动推断出 schema 为`z.number()`，然后，依次附加`optional`和`default`属性，最终会生成 schema：`z.number().optional().default(3)`

因此，上述代码等价于：

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', z.number().optional().default(3)) id: number) {}
}
```

也等价于：

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('id', v.default(3), z.number().optional()) id: number) {}
}
```

## 4. 装饰器：@Arg.filter

装饰器`@Arg.filter`支持更高级的 Query 参数，包括：`columns/where/orders/pageNo/pageSize`

- 参见:
  - [$Dto.query/DtoQueryBase](../orm/dto/query/introduction.md)
  - [$Dto.queryPage/DtoQueryPageBase](../orm/dto/query-page.md)

## 5. 工具：v.array

对于 Array 类型的参数，Vona 也提供了便利的工具。比如，要求 ids 为`number[]`：

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('ids', v.array(Number)) ids: number[]) {}
}
```

等价于：

```typescript
class ControllerStudent3 {
  @Web.get()
  findOne(@Arg.query('ids', v.array(z.number())) ids: number[]) {}
}
```

再比如，从 Request body 获取 students 数组，类型为`DtoStudentInfo[]`：

```typescript
class ControllerStudent3 {
  @Web.post()
  update(@Arg.body('students', v.array(DtoStudentInfo)) students: DtoStudentInfo[]) {}
}
```

## 6. 工具：v.lazy

对于可能导致循环引用的 Class，可以使用`v.lazy`创建 lazy schema：

```typescript
@Dto()
export class DtoUserLazy {
  @Api.field(v.optional(), v.lazy(() => DtoUserLazy))
  user?: DtoUserLazy;

  @Api.field(v.optional(), v.array(v.lazy(() => DtoRoleLazy)))
  roles?: DtoRoleLazy[];
}
```

## 装饰器清单

| 名称         | 说明                    |
| ------------ | ----------------------- |
| @Arg.param   | 从Request Params中取值  |
| @Arg.query   | 从Request Query中取值   |
| @Arg.body    | 从Request Body中取值    |
| @Arg.headers | 从Request Headers中取值 |
| @Arg.fields  | 从Request Upload中取值  |
| @Arg.field   | 从Request Upload中取值  |
| @Arg.files   | 从Request Upload中取值  |
| @Arg.file    | 从Request Upload中取值  |
| @Arg.user    | 取得当前用户            |
| @Arg.filter  | 从Request Query中取值   |

## 工具清单

VonaJS 将用于扩展 Zod Schema 的工具方法都放入分组`v`中，从而减轻心智负担。

### 1. Basic Tools

| 名称           | 说明                                                        |
| -------------- | ----------------------------------------------------------- |
| v.required     | 为`不允许为空`提供自定义错误消息，否则使用Zod内置的错误消息 |
| v.optional     | optional                                                    |
| v.default      | default                                                     |
| v.object       | object                                                      |
| v.strictObject | Same as `z.strictObject(schema.shape)`                      |
| v.looseObject  | Same as `z.looseObject(schema.shape)`                       |
| v.array        | array                                                       |
| v.lazy         | 创建Lazy Schema                                             |

### 2. String Tools

| 名称          | 说明                |
| ------------- | ------------------- |
| v.email       | email               |
| v.url         | url                 |
| v.uuid        | uuid                |
| v.ipv4        | ipv4                |
| v.ipv6        | ipv6                |
| v.min         | 支持`string/number` |
| v.max         | 支持`string/number` |
| v.trim        | trim                |
| v.toLowerCase | toLowerCase         |
| v.toUpperCase | toUpperCase         |
| v.lowercase   | lowercase           |
| v.uppercase   | uppercase           |
| v.regex       | regex               |

### 3. Openapi Tools

| 名称          | 说明        |
| ------------- | ----------- |
| v.openapi     | openapi     |
| v.title       | title       |
| v.description | description |
| v.example     | example     |

### 4. Serializer Tools

| 名称                  | 说明                 |
| --------------------- | -------------------- |
| v.serializerExclude   | 排除字段             |
| v.serializerTransform | 转换字段值           |
| v.serializerSensitive | 字段脱敏处理         |
| v.serializerGetter    | 使用Getter生成字段值 |

### 5. Zod Tools

| 名称           | 说明                  |
| -------------- | --------------------- |
| v.zodRefine    | 提供Zod Refine能力    |
| v.zodTransform | 提供Zod Transform能力 |

### 6. Query Filter Tools

| 名称              | 说明                     |
| ----------------- | ------------------------ |
| v.filter          | 设置Query Filter的参数   |
| v.filterTransform | 提供Filter Transform能力 |

### 7. Special Tools

| 名称            | 说明                                                 |
| --------------- | ---------------------------------------------------- |
| v.tableIdentity | 基于当前系统配置，提供`number`或者`bigint`的校验规则 |

## Controller

关于 Controller 更完整的使用说明，参见: [Controller](../../rest-api/controller.md)

## Entity

Entity 字段也支持 Validation 参数校验，参见: [Entity](../../rest-api/entity.md)

## Dto

Dto 字段也支持 Validation 参数校验，参见: [Dto](../../rest-api/dto.md)
