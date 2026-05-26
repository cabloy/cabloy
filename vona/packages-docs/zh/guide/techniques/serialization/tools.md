# 工具函数

VonaJS 提供了一组工具函数，可以更加便利的使用序列化能力。

## 工具清单

| 名称                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| @core.serializer      | 启用序列化                                                   |
| v.serializerTransform | 使用 Serializer Transform，参见: [序列化](./introduction.md) |
| v.serializerExclude   | 排除字段                                                     |
| v.serializerReplace   | 对字段值进行脱敏处理                                         |
| v.serializerGetter    | 采用 getter 机制生成新的字段值                               |
| v.serializerCustom    | 使用自定义函数对字段值进行处理                               |

## @core.serializer

比如，为 API `findOne`开启序列化。

```diff
class ControllerStudent {
  @Web.get(':id')
  @Api.body(v.optional(), v.object(EntityStudent))
+ @Core.serializer()
  async findOne(id) {
    return await this.scope.service.student.findOne(id);
  }
}
```

## v.serializerTransform

比如，将`EntityStudent`中的`name`字段值转化为大写。

直接使用[序列化](./introduction.md)中创建的 Serializer Transform `upper`

```diff
class EntityStudent {
  @Api.field(
+   v.serializerTransform('demo-student:upper'),
  )
  name: string;
}
```

可以在 App Config 中修改配置。

`src/backend/config/config/config.ts`

- 方法 1: 直接修改 Openapi 参数

```typescript
// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeMetadata(v.serializerTransform('demo-student:upper')),
      },
    },
  },
};
```

- 方法 2: 构造一个新的 schema

```typescript
import { $makeSchema, v } from 'vona-module-a-openapi';

// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeSchema(v.serializerTransform('demo-student:upper'), z.string()),
      },
    },
  },
};
```

## v.serializerExclude

比如，排除`EntityStudent`中的`name`字段。

```diff
class EntityStudent {
  @Api.field(
+   v.serializerExclude(),
  )
  name: string;
}
```

可以在 App Config 中修改配置。

`src/backend/config/config/config.ts`

- 方法 1: 直接修改 Openapi 参数

```typescript
// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeMetadata(v.serializerExclude()),
      },
    },
  },
};
```

- 方法 2: 构造一个新的 schema

```typescript
import { $makeSchema, v } from 'vona-module-a-openapi';

// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeSchema(v.serializerExclude(), z.string()),
      },
    },
  },
};
```

## v.serializerReplace

比如，将`EntityStudent`中的`name`字段值进行脱敏处理。

比如，name 原始值为`tom`，脱敏之后为`t***m`

```diff
class EntityStudent {
  @Api.field(
+   v.serializerReplace({
+     patternFrom: /(\w)(\w+)(\w)/,
+     patternTo: '$1***$3'
+   }),
  )
  name: string;
}
```

可以在 App Config 中修改配置。

`src/backend/config/config/config.ts`

- 方法 1: 直接修改 Openapi 参数

```typescript
// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeMetadata(
          v.serializerReplace({
            patternFrom: /(\w)(\w+)(\w)/,
            patternTo: '$1***$3',
          }),
        ),
      },
    },
  },
};
```

- 方法 2: 构造一个新的 schema

```typescript
import { $makeSchema, v } from 'vona-module-a-openapi';

// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeSchema(
          v.serializerReplace({
            patternFrom: /(\w)(\w+)(\w)/,
            patternTo: '$1***$3',
          }),
          z.string(),
        ),
      },
    },
  },
};
```

## v.serializerGetter

比如，`EntityStudent`中的`fullName`字段由`firstName`和`lastName`字段组合而成。

```diff
class EntityStudent {
  @Api.field(
+   v.serializerGetter((data: EntityStudent) => {
+     return `${data.firstName} ${data.lastName}`;
+   }),
  )
  fullName: string;
}
```

可以在 App Config 中修改配置。

`src/backend/config/config/config.ts`

- 方法 1: 直接修改 Openapi 参数

```typescript
// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        fullName: $makeMetadata(
          v.serializerGetter((data: EntityStudent) => {
            return `${data.firstName} ${data.lastName}`;
          }),
        ),
      },
    },
  },
};
```

- 方法 2: 构造一个新的 schema

```typescript
import { $makeSchema, v } from 'vona-module-a-openapi';

// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        fullName: $makeSchema(
          v.serializerGetter((data: EntityStudent) => {
            return `${data.firstName} ${data.lastName}`;
          }),
          z.string(),
        ),
      },
    },
  },
};
```

## v.serializerCustom

比如，将`EntityStudent`中的`name`字段值转换为大写。

```diff
class EntityStudent {
  @Api.field(
+   v.serializerCustom((value: string) => {
+     return value.toUpperCase();
+   }),
  )
  name: string;
}
```

可以在 App Config 中修改配置。

`src/backend/config/config/config.ts`

- 方法 1: 直接修改 Openapi 参数

```typescript
// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeMetadata(
          v.serializerCustom((value: string) => {
            return value.toUpperCase();
          }),
        ),
      },
    },
  },
};
```

- 方法 2: 构造一个新的 schema

```typescript
import { $makeSchema, v } from 'vona-module-a-openapi';

// onions
config.onions = {
  entity: {
    'demo-student:student': {
      fields: {
        name: $makeSchema(
          v.serializerCustom((value: string) => {
            return value.toUpperCase();
          }),
          z.string(),
        ),
      },
    },
  },
};
```
