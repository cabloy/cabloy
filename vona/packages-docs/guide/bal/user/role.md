# Role

## a-user: IRole

The module `a-user` provides the interface `IRole`, which defines the basic fields of a Role.

```typescript
export interface IRole {
  id: TableIdentity;
  name: string;
}
```

## a-user: bean.role

The module `a-user` provides the global Bean `bean.role`, providing a common calling convention for business logic.

```typescript
// find role
const role = await this.bean.role.findOneById(roleId);
// find roles of user
const roles = await this.bean.role.findAllByUserId(userId);
```

- `bean.role` Method List

| Name            | Description                      |
| --------------- | -------------------------------- |
| findOneByName   | Finds a role by `name`           |
| findOneById     | Finds a role by `id`             |
| findOne         | Finds a role                     |
| findAllByUserId | Finds all roles for a given user |

## home-user adapter: ServiceRoleAdapter

The `home-user` module provides the adapter `ServiceRoleAdapter`, which allows us to customize the operation logic of roles. Business code calls `bean.role`, and `bean.role` calls `ServiceRoleAdapter`, thus achieving a perfect combination of `out-of-the-box` and `flexible customization`

`src/suite/a-home/modules/home-user/src/service/roleAdapter.ts`

| Name            | Description                      |
| --------------- | -------------------------------- |
| findOneByName   | Finds a role by `name`           |
| findOne         | Finds a role                     |
| findAllByUserId | Finds all roles for a given user |

## Get the current role

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const roles = this.bean.passport.currentRoles;
    console.log(roles);
  }
}
```

## Role: admin

Automatically creates the `admin` role in the `meta.version` of the `home-user` module.

- See: [Migration and Changes](../../rest-api/version.md)

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

## Assign Roles to Users

```typescript
await this.scope.model.roleUser.insert({
  userId,
  roleId,
});
```

- `this.scope`: Gets the scope object of the module `home-user`
