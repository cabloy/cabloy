# Serialization序列化/数据脱敏

VonaJS 提供了`序列化`能力，可以对 API 的响应数据进行转换，比如：排除密码字段，对 Email 和 Mobile 进行脱敏处理，等等。

先介绍通用的序列化机制，再介绍一组工具函数。通过工具函数可以更加便利的使用序列化能力。

## 创建Serializer Transform

比如，在模块 demo-student 中创建一个 Serializer Transform: `upper`，将字段值转化为大写。

### 1. Cli命令

```bash
$ vona :create:bean serializerTransform upper --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Serializer Transform`
:::

## Serializer Transform定义

```typescript
export type TypeSerializerTransformUpperValue = string;

export type TypeSerializerTransformUpperData = unknown;

export type TypeSerializerTransformUpperResult = TypeSerializerTransformUpperValue;

export interface ISerializerTransformOptionsUpper extends IDecoratorSerializerTransformOptions {}

@SerializerTransform<ISerializerTransformOptionsUpper>()
export class SerializerTransformUpper extends BeanBase {
  async transform(
    value: TypeSerializerTransformUpperValue,
    _data: TypeSerializerTransformUpperData,
    _options: ISerializerTransformOptionsUpper,
  ): Promise<TypeSerializerTransformUpperResult> {
    return value.toUpperCase();
  }
}
```

- `TypeSerializerTransformUpperValue`: 定义字段类型
- `TypeSerializerTransformUpperData`: 定义外层 object 对象类型
- `TypeSerializerTransformUpperResult`: 定义结果类型
- `ISerializerTransformOptionsUpper`: 定义 Serializer Transform 参数
- `transform`: 将字段值转为大写

## 使用Serializer Transform

比如学生 API`findOne`方法返回的结果类型是`EntityStudent`。下面将`EntityStudent`的`name`字段转为大写。

### 1. 开启序列化

需要为 API 开启序列化。

```diff
+ import { Core } from 'vona-module-a-core';

class ControllerStudent {
  @Web.get(':id')
  @Api.body(v.optional(), v.object(EntityStudent))
+ @Core.serializer()
  async findOne(id) {
    return await this.scope.service.student.findOne(id);
  }
}
```

- `@Core.serializer`: 开启序列化

### 2. 字段装饰器

```diff
class EntityStudent {
+ @Api.field(v.serializerTransform('demo-student:upper'))
  name: string;
}
```

- `v.serializerTransform`: 传入 Serializer Transform 名称`demo-student:upper`

## Filter参数

可以为 Serializer Transform 传入 Filter 参数。系统先执行 Filter 函数，根据结果来控制当前 Serializer Transform 是否需要执行。

比如，如果当前用户名是`admin`则不执行`upper`的转换逻辑。

```diff
class EntityStudent {
  @Api.field(
    v.serializerTransform('demo-student:upper', {
+     filter(this: VonaContext) {
+       return this.user.name !== 'admin';
+     },
    }),
  )
  name: string;
}
```

## Serializer Transform参数

可以为 Serializer Transform 定义参数，通过参数更灵活的配置转换逻辑。

比如，为 Serializer Transform `upper`定义`first`参数，用于控制是否只将首字母转为大写。

### 1. 定义参数类型

```diff
export interface ISerializerTransformOptionsUpper extends IDecoratorSerializerTransformOptions {
+ first?: boolean;
}
```

### 2. 提供参数缺省值

```diff
@SerializerTransform<ISerializerTransformOptionsUpper>({
+ first: false,
})
```

### 3. 使用参数

```diff
export interface ISerializerTransformOptionsUpper extends IDecoratorSerializerTransformOptions {
  first?: boolean;
}

@SerializerTransform<ISerializerTransformOptionsUpper>({
  first: false,
})
class SerializerTransformUpper {
  async transform(
    value: TypeSerializerTransformUpperValue,
    _data: TypeSerializerTransformUpperData,
    options: ISerializerTransformOptionsUpper,
  ): Promise<TypeSerializerTransformUpperResult> {
-   return value.toUpperCase();
+   return options.first ? toUpperCaseFirstChar(value) : value.toUpperCase();
  }
}
```

### 4. 使用时指定参数

可以指定`v.serializerTransform`的参数。

```diff
class EntityStudent {
  @Api.field(
    v.serializerTransform('demo-student:upper', {
+     first: true,
    }),
  )
  name: string;
}
```

### 5. App Config

可以在 App Config 中配置 Serializer Transform 参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  serializerTransform: {
    'demo-student:upper': {
      first: true,
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config配置` > `参数缺省值`
