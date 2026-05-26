# $Dto.create

`$Dto.create`用于标注 Create 参数。

## 参数

| 名称    | 描述               |
| ------- | ------------------ |
| columns | 需要创建的字段列表 |
| include | 静态关系           |
| with    | 动态关系           |

## 1. 一般用法

```typescript
$Dto.create(() => ModelOrder);
```

```typescript
$Dto.create(() => ModelOrder, { columns: ['orderNo', 'remark'] });
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
$Dto.create(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
  include: {
    products: true,
  },
});
```

## 3. 动态关系

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
