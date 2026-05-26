# $Dto.update

`$Dto.update` is used to annotate the `Update` parameters.

## Parameters

| Name    | Description                  |
| ------- | ---------------------------- |
| columns | List of fields to be updated |
| include | Static relations             |
| with    | Dynamic relations            |

## 1. General Usage

```typescript
$Dto.update(() => ModelOrder);
```

```typescript
$Dto.update(() => ModelOrder, { columns: ['orderNo', 'remark'] });
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
$Dto.update(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
  include: {
    products: true,
  },
});
```

## 3. Dynamic Relation

```typescript
$Dto.update(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
  with: {
    products: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      columns: ['name', 'price', 'quantity', 'amount'],
    }),
  },
});
```
