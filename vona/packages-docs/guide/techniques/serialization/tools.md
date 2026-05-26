# Tools

VonaJS provides a set of utility functions to make serialization capabilities more convenient.

## Tool List

| Name                  | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| @core.serializer      | Enable Serialization                                                    |
| v.serializerTransform | For using Serializer Transform, see: [Serialization](./introduction.md) |
| v.serializerExclude   | Exclude fields                                                          |
| v.serializerReplace   | Mask the field values                                                   |
| v.serializerGetter    | Generate new field values ​​using getter mechanisms                     |
| v.serializerCustom    | Transform field values ​​using custom function                          |

## @core.serializer

For example, enable serialization for the `findOne` API.

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

For example, to convert the `name` field value in `EntityStudent` to uppercase.

we directly use the Serializer Transform `upper` created in [Serialization](./introduction.md)

```diff
class EntityStudent {
  @Api.field(
+   v.serializerTransform('demo-student:upper'),
  )
  name: string;
}
```

Configuration can be modified in App Config.

`src/backend/config/config/config.ts`

- Method 1: Directly modify Openapi parameters

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

- Method 2: Construct a new schema

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

For example, exclude the `name` field in `EntityStudent`

```diff
class EntityStudent {
  @Api.field(
+   v.serializerExclude(),
  )
  name: string;
}
```

### 3. App Config

Configuration can be modified in App Config.

`src/backend/config/config/config.ts`

- Method 1: Directly modify Openapi parameters

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

- Method 2: Construct a new schema

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

For example, to mask the value of the `name` field in `EntityStudent`

For example, the original value of `name` is `tom`, this result after mask is `t***m`

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

Configuration can be modified in App Config.

`src/backend/config/config/config.ts`

- Method 1: Directly modify OpenAPI parameters

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

- Method 2: Construct a new schema

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

For example, the `fullName` field in `EntityStudent` is composed of the `firstName` and `lastName` fields.

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

Configuration can be modified in App Config.

`src/backend/config/config/config.ts`

- Method 1: Directly modify OpenAPI parameters

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

- Method 2: Construct a new schema

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

For example, convert the `name` field value in `EntityStudent` to uppercase.

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

Configuration can be modified in App Config.

`src/backend/config/config/config.ts`

- Method 1: Directly Modify OpenAPI Parameters

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

- Method 2: Construct a New Schema

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
