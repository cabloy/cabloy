# $Dto.query/DtoQueryBase

`$Dto.query/DtoQueryBase` is used to annotate the `Query` parameters.

## Usage of DtoQueryBase

### 1. Create DTO

In VSCode, use the `Vona Create/Dto` context menu to create a DTO code skeleton:

```typescript
@Dto()
export class DtoOrderQuery {}
```

### 2. Inherit DtoQueryBase

```typescript
@Dto()
export class DtoOrderQuery extends DtoQueryBase {}
```

## DtoQueryBase Fields

Since `DtoOrderQuery` inherits from `DtoQueryBase`, it has the following member fields:

| Name    | Description             | Example                                                        |
| ------- | ----------------------- | -------------------------------------------------------------- |
| columns | List of fields to query | `*`, `id,orderNo,remark`, `["id","orderNo","remark"]`          |
| where   | Query clause            | `{ "orderNo": { "_include_":  "order001" } }`                  |
| orders  | Sorting                 | `orderNo,desc`, `[["orderNo", "desc"], ["createdAt", "desc"]]` |

## Annotating Query Parameters

Still taking the `findAll` method of the `Order` controller as an example, we can annotate the Query parameters:

```diff
+ import type { IQueryParams } from 'vona-module-a-orm';
+ import { Arg } from 'vona-module-a-web';

class ControllerOrder extends BeanBase {
  @Web.get('findAll')
  @Api.body(v.array(DtoOrderResult))
  async findAll(
+   @Arg.filter(DtoOrderQuery) params: IQueryParams<ModelOrder>,
  ): Promise<DtoOrderResult[]> {
    return this.scope.model.order.select(params);
  }
}
```

- `@Arg.filter`: This Pipe transforms the Query parameter and needs to pass in the parameter `DtoOrderQuery`
- `IQueryParams`: The data type obtained by Pipe transforming the Query parameter is `IQueryParams`, and the generic parameter `ModelOrder` needs to be passed in to match the parameter type of the `model.order.select` method

The automatically generated Swagger/Openapi is as follows:

![](../../../../../assets/img/orm/dto/dto-2.png)

## $Dto.query

If you need to add query clause for business fields in DTO, you can use `$Dto.query`

```diff
@Dto()
export class DtoOrderQuery
+ extends $Dto.query(EntityOrder, ['orderNo', 'remark']) {}
```

- `$Dto.query`: Automatically extract the field `orderNo/remark` from `EntityOrder` and then merge it with the `DtoQueryBase` member fields

The automatically generated Swagger/Openapi is as follows:

![](../../../../../assets/img/orm/dto/dto-3.png)

## Add custom fields

You can also add custom fields directly in the DTO.

```diff
@Dto()
export class DtoOrderQuery
+ extends $Dto.query(EntityOrder, ['remark']) {
+ @Api.field(v.optional())
+ orderNo?: string;
}
```

- Automatically extract the field `remark` from `EntityOrder`
- Add custom field `orderNo`

## v.openapi/v.filter

We can also specify OpenAPI parameters to support more capabilities.

### 1. Relations

For example, if the Model `Order` and Model `User` have an `n:1` relation, we can pass `userName` as the query condition in the Query parameters. Then, we need to add the `userName` field in the DTO and set the OpenAPI parameters.

```typescript
@Dto()
export class DtoOrderQuery extends $Dto.query(EntityOrder, ['orderNo', 'remark']) {
  @Api.field(
    v.openapi({
      filter: {
        table: 'testVonaUser',
        joinType: 'innerJoin',
        joinOn: ['userId', 'testVonaUser.id'],
        originalName: 'name',
      },
    }),
    v.optional(),
  )
  userName?: string;
}
```

You can also use `v.filter`:

```typescript
@Dto()
export class DtoOrderQuery extends $Dto.query(EntityOrder, ['orderNo', 'remark']) {
  @Api.field(
    v.filter({
      table: 'testVonaUser',
      joinType: 'innerJoin',
      joinOn: ['userId', 'testVonaUser.id'],
      originalName: 'name',
    }),
    v.optional(),
  )
  userName?: string;
}
```

| Name         | Description                           |
| ------------ | ------------------------------------- |
| table        | Table name of relation                |
| joinType     | Relation Type, default is `innerJoin` |
| joinOn       | Relation condition                    |
| originalName | Original field name                   |

The automatically generated Swagger/Openapi is as follows:

![](../../../../../assets/img/orm/dto/dto-4.png)

### 2. App Config

Openapi parameters can be configured in App Config.

```typescript
config.onions = {
  dto: {
    'test-vona:orderQuery': {
      fields: {
        userName: $makeMetadata(
          v.filter({
            table: 'testVonaUser',
            joinType: 'innerJoin',
            joinOn: ['userId', 'testVonaUser.id'],
            originalName: 'name',
          }),
        ),
      },
    },
  },
};
```

### 3. Orders based on relations

When querying Model `Order` which joins with Model `User`, if the fields in `orders` exist in both tables, you must specify the table name prefix. For example: `testVonaOrder.createdAt,desc`

Vona ORM has built-in relations-based orders processing logic. You only need to set the Openapi parameters in the DTO:

```diff
@Dto<IDtoOptionsOrderQuery>({
+ openapi: {
+   filter: {
+     table: 'testVonaOrder',
+   },
+ },
})
export class DtoOrderQuery
  extends $Dto.query(EntityOrder, ['orderNo', 'remark']) {
  @Api.field(
    v.filter({
      table: 'testVonaUser',
      joinType: 'innerJoin',
      joinOn: ['userId', 'testVonaUser.id'],
      originalName: 'name',
    }),
    v.optional(),
  )
  userName?: string;
}
```
