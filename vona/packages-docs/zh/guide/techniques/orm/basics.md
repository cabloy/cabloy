# ORM基础

先引入 Vona ORM 的基础概念：

1. `Entity`：定义实体的基础字段
2. `Model`：定义实体之间的关系，并提供操作数据库的方法和工具。通过`Model`提供的方法，可以将多个`Entity`基于关系自动推断出需要的类型结构
3. `迁移与变更`：用于数据库架构的变更与数据初始化

这些 ORM 基础概念在介绍`API`时已经加以说明，参见：

- [API: Entity](../../rest-api/entity.md)
- [API: Model](../../rest-api/model.md)
- [API: Dto](../../rest-api/dto.md)
- [API: 迁移与变更](../../rest-api/version.md)
