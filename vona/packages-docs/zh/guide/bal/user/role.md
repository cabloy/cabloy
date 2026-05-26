# 角色

## a-user: IRole

模块`a-user`提供了接口`IRole`，约定了 Role 的基础字段。

```typescript
export interface IRole {
  id: TableIdentity;
  name: string;
}
```

## a-user: bean.role

模块`a-user`提供了全局 Bean `bean.role`，为业务提供了通用的调用规范。

```typescript
// find role
const role = await this.bean.role.findOneById(roleId);
// find roles of user
const roles = await this.bean.role.findAllByUserId(userId);
```

- `bean.role`方法清单

| 名称            | 说明                   |
| --------------- | ---------------------- |
| findOneByName   | 通过`name`查找角色     |
| findOneById     | 通过`id`查找角色       |
| findOne         | 查找角色               |
| findAllByUserId | 查找某个用户的所有角色 |

## home-user适配器: ServiceRoleAdapter

模块`home-user`提供了适配器`ServiceRoleAdapter`，允许我们定制角色的操作逻辑。业务代码调用`bean.role`，`bean.role`调用`ServiceRoleAdapter`，从而实现了`开箱即用`与`灵活定制`的完美结合。

`src/suite/a-home/modules/home-user/src/service/roleAdapter.ts`

| 名称            | 说明                   |
| --------------- | ---------------------- |
| findOneByName   | 通过`name`查找角色     |
| findOne         | 查找角色               |
| findAllByUserId | 查找某个用户的所有角色 |

## 获取当前角色

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const roles = this.bean.passport.currentRoles;
    console.log(roles);
  }
}
```

## 角色: admin

在模块`home-user`的`meta.version`中自动创建`admin`角色。

- 参见：[迁移与变更](../../rest-api/version.md)

`src/suite/a-home/modules/home-user/src/bean/meta.version.ts`

```typescript
async init(options) {
  if (options.version === 1) {
    // role: admin
    await this.scope.model.role.insert({
      name: 'admin',
    });
  }
}
```

## 为用户分配角色

```typescript
await this.scope.model.roleUser.insert({
  userId,
  roleId,
});
```

- `this.scope`: 取得模块`home-user`的 scope 对象
