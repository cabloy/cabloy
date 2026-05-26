# $Dto.listAndCount

`$Dto.listAndCount`用于标注带分页的返回结果。

## 参数

| 名称     | 描述                          |
| -------- | ----------------------------- |
| classRef | 使用`$Dto.get`生成的DTO class |

### 1. 创建DTO

在 VSCode 中，可以通过右键菜单`Vona Create/Dto`创建 DTO 的代码骨架：

```typescript
@Dto()
export class DtoOrderSelectRes {}
```

### 2. 继承$Dto.listAndCount

```diff
+ import { DtoOrderSelectResItem } from './orderSelectResItem.ts';

@Dto()
export class DtoOrderSelectRes
+ extends $Dto.listAndCount(DtoOrderSelectResItem) {}
```

## DtoOrderSelectRes成员字段

| 名称  | 说明             |
| ----- | ---------------- |
| list  | 当前页的条目列表 |
| total | 数据总条数       |

## 标注API返回值

以 Controller Order 的 findMany 方法为例，标注 API 返回值：

```diff
class ControllerOrder extends BeanBase {
  @Web.get('findMany')
+ @Api.body(DtoOrderSelectRes)
  async findMany(
    @Arg.filter(DtoOrderQueryPage) params: IQueryParams<ModelOrder>,
+ ): Promise<DtoOrderSelectRes> {
    return this.scope.model.order.selectAndCount(params);
  }
}
```

- `@Api.body`：传入 DtoOrderSelectRes，用于标注 API 返回值

基于`DtoOrderSelectRes`生成的 Swagger/Openapi 效果如下：

![](../../../../assets/img/orm/dto/dto-7.png)
