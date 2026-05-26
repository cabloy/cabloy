# Dto

## 创建Dto

比如，在模块 demo-student 中创建一个 Dto: `studentCreate`

### 1. Cli命令

```bash
$ vona :create:bean dto studentCreate --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Dto`
:::

## Dto定义

```typescript
@Dto<IDtoOptionsStudentCreate>()
export class DtoStudentCreate {}
```

## @Api.field

一般而言，在定义字段时，需要指定字段的类型、验证规则、Swagger/Openapi 元数据。

Dto 中`@Api.field`的使用方式与 Entity 一致。

- 参见：[Entity](./entity.md)

### 举例

- `name`: `string, min(3), title: 'Name'(支持I18n)`
- `description`: `string, 可选, title: 'Description'(支持I18n)`

```typescript
class DtoStudentCreate {
  @Api.field(v.title($locale('Name')), v.min(3))
  name: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;
}
```

## Dto Options

| 名称        | 说明                                         |
| ----------- | -------------------------------------------- |
| independent | 是否独立显示在Swagger/Openapi中，默认为false |
| openapi     | 与Swagger/Openapi相关的元数据                |
| fields      | 定义Fields options                           |

- independent: 如果 Controller Action 引用了 dto，那么该 dto 就会自动输出到 Swagger/Openapi 中。如果指定`independent: true`，那么该 dto 就总会输出到 Swagger/Openapi 中

### 1. 举例：openapi

为 dto 提供 description 信息，从而在 Swagger/Openapi 中显示。

```typescript
@Dto({
  openapi: { description: 'Create Student' },
})
class DtoStudentCreate {}
```

- 支持 I18n 国际化

创建语言资源:

`src/module/demo-student/src/config/locale/en-us.ts`

```typescript
export default {
  CreateStudent: 'Create Student',
};
```

`src/module/demo-student/src/config/locale/zh-cn.ts`

```typescript
export default {
  CreateStudent: '创建学生',
};
```

使用`$locale`函数进行语言翻译。

```typescript
import { $locale } from '../.metadata/locales.ts';

@Dto({
  openapi: { description: $locale('CreateStudent') },
})
class DtoStudentCreate {}
```

### 2. 举例：fields

将字段`name`的 openapi 信息改为：`title: 'Student Name'`

```typescript
@Dto({
  fields: {
    name: { title: 'Student Name' },
  },
})
class DtoStudentCreate {}
```

或者：

```typescript
import z from 'zod';

@Dto({
  fields: {
    name: z.string().openapi({ title: 'Student Name' }),
  },
})
class DtoStudentCreate {}
```

## App Config

可以在 App Config 中配置 Dto options。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  dto: {
    'demo-student:studentCreate': {
      openapi: {
        description: 'Create Student',
      },
      fields: {
        name: { title: 'Student Name' },
      },
    },
  },
};
```

## Mapped Class

在上面为`DtoStudentCreate`定义了两个字段：`name`和`description`。事实上这两个字段在`EntityStudent`中也有定义。为了实现代码复用，提升开发效率，Vona 提供了 4 个 Mapped 工具函数，用于从现有 Class 中派生出目标 Class。

### 1. $Class.pick

从`EntityStudent`中提取`name`和`description`两个字段，生成 Dto `DtoStudentCreate`

```typescript
class DtoStudentCreate extends $Class.pick(EntityStudent, ['name', 'description']) {}
```

### 2. $Class.partial

将`DtoStudentCreate`中所有字段改为可选，生成 Dto `DtoStudentUpdate`

```typescript
class DtoStudentUpdate extends $Class.partial(DtoStudentCreate) {}
```

将`DtoStudentCreate`中的字段`name`改为可选，生成 Dto `DtoStudentUpdate`

```typescript
class DtoStudentUpdate extends $Class.partial(DtoStudentCreate, ['name']) {}
```

### 3. $Class.omit

将`EntityStudent`中的字段`id`排除，生成 Dto `DtoStudentOther`

```typescript
class DtoStudentOther extends $Class.omit(EntityStudent, ['id']) {}
```

### 4. $Class.mixin

将多个 Class 中的字段进行合并，生成新的 Dto `DtoStudentOther`

```typescript
class DtoStudentOther extends $Class.mixin(EntityStudent, DtoStudentCreate, DtoStudentUpdate) {}
```

### 5. 组合

可以将多个 Mapped 工具函数组合使用。

```typescript
class DtoStudentUpdate extends $Class.partial(
  $Class.pick(EntityStudent, ['name', 'description']),
) {}
```

## DTO推断与生成

Vona ORM 提供 DTO 动态推断与生成能力，减少重复的类型定义工作，提升开发效率。

- 参见：[DTO推断与生成](../techniques/orm/dto/introduction.md)
