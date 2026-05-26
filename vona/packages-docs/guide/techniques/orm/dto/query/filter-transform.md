# Filter Transform

For custom fields, Vona ORM provides built-in Transform rules. Take `DtoOrderQuery` as an example:

- `orderNo` is a string, so the system automatically converts it to the conditional statement `'orderNo': { _includesI_: 'some input' }`
- `userName` is also a string, so the system automatically converts it to the conditional statement `'name': { _includesI_: 'some input' }`

To support more complex business needs, you can provide a custom Filter Transform.

## Create Filter Transform

For example, create a Filter Transform: `dateRange` in the module demo-student to convert the date range into a conditional statement.

For example, the current time zone is `Asia/Tokyo (+9:00)`. The incoming field `createdAt` has a value of `2025-12-01~2025-12-02`, and the converted conditional statement is:

```typescript
createdAt >= '2025-11-30T15:00:00.000Z' and createdAt < '2025-12-02T15:00:00.000Z'
```

### 1. Cli command

```bash
$ vona :create:bean filterTransform dateRange --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Bean/Filter Transform`
:::

## Filter Transform Definition

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

- `IFilterTransformOptionsDateRange`: Defines Filter Transform parameters
- `where`: Convert the date range into a conditional statement
  - If returns `undefined`, ignore this conditional statement
- `this.ctx.tz`: Get the current time zone, such as `Asia/Tokyo`

## Using Filter Transform

### 1. General Usage

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

- `v.filterTransform`: This function is used to use Filter Transform. Simply pass the Filter Transform name
  - The `dateRange` Filter Transform belongs to the `demo-student` module, so the full name is `demo-student:dateRange`

### 2. App Config

`createdAt` parameters can be configured in App Config.

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

## Filter Transform Parameters

You can define parameters for Filter Transform, allowing for more flexible configuration of Filter Transform logic.

For example, define the `separator` parameter for the `dateRange` Filter Transform to provide custom separator.

### 1. Defining parameter types

```diff
export interface IFilterTransformOptionsDateRange extends IDecoratorFilterTransformOptions {
+ separator: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@FilterTransform<IFilterTransformOptionsDateRange>({
+ separator: '~',
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify Filter Transform parameters when using.

- General Usage

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

`createdAt` parameters can be configured in App Config.

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

Filter Transform parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
