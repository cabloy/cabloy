# Filter Transform

对于自定义字段，Vona ORM 提供了内置的 Transform 规则。以`DtoOrderQuery`为例：

- `orderNo`是 string 类型，系统自动转换为条件语句`'orderNo': { _includesI_: 'some input' }`
- `userName`也是 string 类型，系统自动转换为条件语句`'name': { _includesI_: 'some input' }`

为了支持更复杂的业务需求，可以提供自定义 Filter Transform。

## 创建Filter Transform

比如，在模块 demo-student 中创建一个 Filter Transform: `dateRange`，将日期范围转换为条件语句。

比如，当前时区为`Asia/Tokyo (+9:00)`。传入字段`createdAt`值为`2025-12-01~2025-12-02`，转换后的条件语句为:

```typescript
createdAt >= '2025-11-30T15:00:00.000Z' and createdAt < '2025-12-02T15:00:00.000Z'
```

### 1. Cli命令

```bash
$ vona :create:bean filterTransform dateRange --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Filter Transform`
:::

## Filter Transform定义

```typescript
import { DateTime } from 'luxon';

export interface IFilterTransformOptionsDateRange extends IDecoratorFilterTransformOptions {}

@FilterTransform<IFilterTransformOptionsDateRange>()
export class FilterTransformDateRange extends BeanBase implements IFilterTransformWhere {
  async where(
    info: IPipeOptionsFilterTransformInfo,
    _options: IFilterTransformOptionsDateRange,
  ): Promise<any | undefined> {
    const { value } = info;
    const [dateStartStr, dateEndStr] = value.split('~');
    const dateStart = DateTime.fromISO(dateStartStr, { zone: this.ctx.tz });
    const dateEnd = DateTime.fromISO(dateEndStr, { zone: this.ctx.tz }).plus({ day: 1 });
    return {
      _gte_: dateStart.toJSDate(),
      _lt_: dateEnd.toJSDate(),
    };
  }
}
```

- `IFilterTransformOptionsDateRange`: 定义 Filter Transform 参数
- `where`: 转换查询条件
  - 如果返回`undefined`就忽略该查询条件
- `this.ctx.tz`: 获取当前时区，比如`Asia/Tokyo`

## 使用Filter Transform

### 1. 一般用法

```diff
import { v } from 'vona-module-a-openapiutils';

class DtoStudentQuery {
  @Api.field(
+   v.filterTransform('demo-student:dateRange'),
    v.optional(),
  )
  createdAt?: string;
}
```

- `v.filterTransform`: 此工具函数用于使用 Filter Transform，只需传入 Filter Transform 的名称
  - `dateRange` Filter Transform 属于模块`demo-student`，因此完整的名称是`demo-student:dateRange`

### 2. App Config

可以在 App Config 中配置 createdAt 参数。

```typescript
config.onions = {
  dto: {
    'demo-student:studentQuery': {
      fields: {
        createdAt: $makeSchema(
          v.filterTransform('demo-student:dateRange'),
          v.optional(),
          z.string(),
        ),
      },
    },
  },
};
```

## Filter Transform参数

可以为 Filter Transform 定义参数，通过参数更灵活的配置 Filter Transform 逻辑。

比如，为 `dateRange` Filter Transform 定义`separator`参数，用于指定日期范围的分隔符。

### 1. 定义参数类型

```diff
export interface IFilterTransformOptionsDateRange extends IDecoratorFilterTransformOptions {
+ separator: string;
}
```

### 2. 提供参数缺省值

```diff
@FilterTransform<IFilterTransformOptionsDateRange>({
+ separator: '~',
})
```

### 3. 使用参数

```diff
export interface IFilterTransformOptionsDateRange extends IDecoratorFilterTransformOptions {
  separator: string;
}

@FilterTransform<IFilterTransformOptionsDateRange>({
  separator: '~',
})
export class FilterTransformDateRange extends BeanBase implements IFilterTransformWhere {
  async where(info: IPipeOptionsFilterTransformInfo, options: IFilterTransformOptionsDateRange): Promise<any | undefined> {
    const { value } = info;
-   const [dateStartStr, dateEndStr] = value.split('~');
+   const [dateStartStr, dateEndStr] = value.split(options.separator);
    const dateStart = DateTime.fromISO(dateStartStr, { zone: this.ctx.tz });
    const dateEnd = DateTime.fromISO(dateEndStr, { zone: this.ctx.tz }).plus({ day: 1 });
    return {
      _gte_: dateStart.toJSDate(),
      _lt_: dateEnd.toJSDate(),
    };
  }
}
```

### 4. 使用时指定参数

可以在使用时指定 Filter Transform 参数。

- 一般用法

```diff
class DtoStudentQuery {
  @Api.field(
+   v.filterTransform('demo-student:dateRange', { separator: ' - ' }),
    v.optional(),
  )
  createdAt?: string;
}
```

- App Config

可以在 App Config 中配置 createdAt 参数。

```diff
config.onions = {
  dto: {
    'demo-student:studentQuery': {
      fields: {
+       createdAt: $makeSchema(
+         v.filterTransform('demo-student:dateRange', { separator: ' - ' }),
+         v.optional(),
+         z.string(),
+       ),
      },
    },
  },
};
```

### 5. App Config

可以在 App Config 中配置 Filter Transform 参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  filterTransform: {
    'demo-student:dateRange': {
      separator: ' - ',
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
