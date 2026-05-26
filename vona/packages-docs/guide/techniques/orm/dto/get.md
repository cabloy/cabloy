# $Dto.get

`$Dto.get` is used to annotate the return result.

## Parameters

| Name    | Description                  |
| ------- | ---------------------------- |
| columns | List of fields to be queried |
| include | Static relations             |
| with    | Dynamic relations            |

## 1. General Usage

```typescript
$Dto.get(() => ModelOrder);
```

```typescript
$Dto.get(() => ModelOrder, { columns: ['id', 'orderNo', 'remark'] });
```

## 2. Static Relation

Take Order/Product as an example to demonstrate the `1:n` relation.

### Model relation definition

First define a `1:n` relation between Model `Order` and Model `Product`

```typescript
@Model({
  entity: EntityOrder,
  relations: {
    products: $relation.hasMany(() => ModelProduct, 'orderId', {
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
})
class ModelOrder {}
```

### Dynamically inferring and generating DTO

```typescript
$Dto.get(() => ModelOrder, {
  include: {
    products: true,
  },
});
```

## 3. Dynamic Relation

```typescript
$Dto.get(() => ModelOrder, {
  with: {
    products: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
});
```

## 4. Aggregation based on static relation

Take Order/Product as an example to demonstrate the `1:n` relation.

### Model relation definition

First define a `1:n` relation between Model `OrderStats` and Model `Product`

```typescript
@Model({
  entity: EntityOrder,
  relations: {
    productStats: $relation.hasMany(() => ModelProduct, 'orderId', {
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
  },
})
export class ModelOrderStats {}
```

### Dynamically inferring and generating DTO

```typescript
$Dto.get(() => ModelOrderStats, {
  include: {
    productStats: true,
  },
});
```

## 5. Aggregation based on dynamic relation

```typescript
$Dto.get(() => ModelOrder, {
  with: {
    productStats: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
  },
});
```

## 6. Grouping based on static relation

Take Order/Product as an example to demonstrate the `1:n` relation.

### Model relation definition

First define a `1:n` relation between Model `OrderStats` and Model `Product`

```typescript
@Model({
  entity: EntityOrder,
  relations: {
    productsGroups: $relation.hasMany(() => ModelProduct, 'orderId', {
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
  },
})
export class ModelOrderStats {}
```

### Dynamically inferring and generating DTO

```typescript
$Dto.get(() => ModelOrderStats, {
  include: {
    productsGroups: true,
  },
});
```

## 7. Grouping based on dynamic relation

```typescript
$Dto.get(() => ModelOrder, {
  with: {
    productsGroups: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
  },
});
```
