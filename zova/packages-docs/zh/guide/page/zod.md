# zod

[zod](https://zod.dev) is typeScript-first schema validation with static type inference.

Zova 对`zod`进行了封装，提供了增强版的`z`对象。

## 基本用法

生成一个 string schema。

```typescript
const name = z.string();
```

指定为可选。

```typescript
const name = z.string().optional();
```

指定缺省值。

```typescript
const name = z.string().optional().default('');
```

## 常用类型

string.

```typescript
const name = z.string();
```

number.

```typescript
const age = z.number();
```

boolean.

```typescript
const bRead = z.boolean();
```

bigint.

```typescript
const num = z.bigint();
```

date.

```typescript
const birthday = z.date();
```

object.

```typescript
const user = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
});
```

## 增强功能

### 1. 类型转换

采用`z`生成的 schema 自动执行类型转换。因为从路由路径上获取的 Params 和 Query 默认都是`字符串`类型，需要转换为实际的目标类型。

### 2. boolean处理

`z`对 boolean 进行了特殊处理，将字符串'false'、'undefined'、'null'和'0'都强制转换为`false`值。

### 3. 支持json对象

可以在 Query 中传递 json 对象。比如，在 Query 中定义一个 user 对象。

```typescript
export const QuerySchema = z.object({
  user: z
    .object({
      name: z.string(),
      age: z.number(),
    })
    .optional(),
});
```

在 render 中可以直接读取 user 对象的值。

```typescript
export class RenderCardHeader {
  render() {
    return (
      <div>
        <div>name: {this.$query.user?.name}</div>
        <div>age: {this.$query.user?.age}</div>
      </div>
    );
  }
}
```

### 4. 支持array数组

可以在 Query 中传递 array 数组。比如，在 Query 中定义一个 colors 数组。

```typescript
export const QuerySchema = z.object({
  colors: z.array(z.string()).optional(),
});
```

在 render 中可以直接读取 colors 数组的值。

```typescript
export class RenderCardHeader {
  render() {
    return (
      <div>
        <div>colors: {this.$query.colors?.join(',')}</div>
        <div>length: {this.$query.colors?.length}</div>
      </div>
    );
  }
}
```
