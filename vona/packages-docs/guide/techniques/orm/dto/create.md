# $Dto.create

`$Dto.create` is used to annotate the `Create` parameters.

## Parameters

| Name    | Description                  |
| ------- | ---------------------------- |
| columns | List of fields to be created |
| include | Static relations             |
| with    | Dynamic relations            |

## 1. General Usage

```typescript
$Dto.create(() => ModelOrder);
```

```typescript
$Dto.create(() => ModelOrder, { columns: ['orderNo', 'remark'] });
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
$Dto.create(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
  include: {
    products: true,
  },
});
```

## 3. Dynamic Relation

```typescript
$Dto.create(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
  with: {
    products: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      columns: ['name', 'price', 'quantity', 'amount'],
    }),
  },
});
```
