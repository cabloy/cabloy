# $Dto.get

`$Dto.get`用于标注返回结果。

## 参数

| 名称    | 描述               |
| ------- | ------------------ |
| columns | 需要查询的字段列表 |
| include | 静态关系           |
| with    | 动态关系           |

## 1. 一般用法

```typescript
$Dto.get(() => ModelOrder);
```

```typescript
$Dto.get(() => ModelOrder, { columns: ['id', 'orderNo', 'remark'] });
```

## 2. 静态关系

以 Order/Product 为例，演示`1:n`关系。

### Model关系定义

先在 Model Order 中定义与 Model Product 的`1:n`关系。

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

### 动态推断与生成DTO

```typescript
$Dto.get(() => ModelOrder, {
  include: {
    products: true,
  },
});
```

## 3. 动态关系

```typescript
$Dto.get(() => ModelOrder, {
  with: {
    products: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
});
```

## 4. 基于静态关系的聚合

以 Order/Product 为例，演示`1:n`关系。

### Model关系定义

先在 Model OrderStats 中定义与 Model Product 的`1:n`关系。

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

### 动态推断与生成DTO

```typescript
$Dto.get(() => ModelOrderStats, {
  include: {
    productStats: true,
  },
});
```

## 5. 基于动态关系的聚合

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

## 6. 基于静态关系的分组

以 Order/Product 为例，演示`1:n`关系。

### Model关系定义

先在 Model OrderStats 中定义与 Model Product 的`1:n`关系。

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

### 动态推断与生成DTO

```typescript
$Dto.get(() => ModelOrderStats, {
  include: {
    productsGroups: true,
  },
});
```

## 7. 基于动态关系的分组

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
