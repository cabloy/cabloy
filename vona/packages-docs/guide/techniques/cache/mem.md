# Mem Cache

`Mem Cache` is implemented based on [lru-cache](https://github.com/isaacs/node-lru-cache)

## Create Mem Cache

For example, create a Mem Cache `student` in the module `demo-student`, to cache student data.

### 1. Cli Command

```bash
$ vona :create:bean cacheMem student --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Bean/Cache Mem`
:::

## Mem Cache Definition

```typescript
export type TCacheMemStudentKey = string;
export interface TCacheMemStudentData {
  id: string;
  name: string;
}

@CacheMem({
  max: 500,
  ttl: 2 * 3600 * 1000,
})
export class CacheMemStudent extends BeanCacheMemBase<TCacheMemStudentKey, TCacheMemStudentData> {}
```

- `TCacheMemStudentKey`: Defines the type of the cache key
- `TCacheMemStudentData`: Defines the type of the cache data

## Mem Cache Parameters

Parameters can be configured for Mem Cache.

```typescript
@CacheMem({
  max: 500,
  ttl: 2 * 3600 * 1000,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
  broadcastOnSet: false,
  disableInstance: false,
  disableTransactionCompensate: false,
})
class CacheMemStudent {}
```

| Name                         | Type    | Default      | Description                                                                                                                       |
| ---------------------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| max                          | number  |              | Maximum number of items allowed in the cache                                                                                      |
| ttl                          | number  |              | Cache expiration time                                                                                                             |
| updateAgeOnGet               | boolean | true         | Whether to update the ttl when reading from the cache                                                                             |
| updateAgeOnHas               | boolean | false        | Whether to update the ttl when checking if the cache exists                                                                       |
| broadcastOnSet               | boolean | 'del'\|false | Whether to broadcast changes to other Workers when setting the cache. Set to `del` to broadcast deletion to other Workers’ caches |
| disableInstance              | boolean | false        | Whether to disable instance isolation. By default, caches between multiple instances are isolated                                 |
| disableTransactionCompensate | boolean | false        | Whether to disable transaction compensation. Enabling transaction compensation ensures cache data consistency                     |

## App Config

Mem Cache parameters can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  cacheMem: {
    'demo-student:student': {
      max: 500,
      ttl: 2 * 3600 * 1000,
      updateAgeOnGet: true,
      updateAgeOnHas: false,
      broadcastOnSet: false,
      disableInstance: false,
      disableTransactionCompensate: false,
    },
  },
};
```

## Mem Cache Enable/Disable

You can control `enable/disable` of Mem Cache.

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  cacheMem: {
    'demo-student:student': {
+     enable: true,
    },
  },
};
```

### 2. Meta

Allows Mem Cache to take effect in a specified operating environment.

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

- Example

```diff
@CacheMem({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class CacheMemStudent {}
```

## Using Mem Cache

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const student = { id: '1', name: 'tom' };
    this.scope.cacheMem.student.set(student, '1');
    const value = this.scope.cacheMem.student.get('1');
    assert.deepEqual(student, value);
  }
}
```

- `this.scope.cacheMem.student`: Gets the Mem Cache instance through the module scope

## Cache method parameters

Take the `set` method as an example to introduce the parameters of the cache method.

```typescript
this.scope.cacheMem.student.set(student, '1', {
  ttl: 2 * 3600 * 1000,
  broadcastOnSet: 'del',
  disableTransactionCompensate: true,
  db: this.ctx.db,
});
```

| Name                         | Type             | Description                                                                                                                       |
| ---------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ttl                          | number           | Cache expiration time                                                                                                             |
| broadcastOnSet               | boolean \| 'del' | Whether to broadcast changes to other Workers when setting the cache. Set to `del` to broadcast deletion to other Workers’ caches |
| disableTransactionCompensate | boolean          | Whether to disable transaction compensation                                                                                       |
| db                           | ServiceDb        | This db object is used when performing transaction compensation. By default, the db object in the context is automatically used   |

- `db`: VonaJS supports multiple databases/datasources, so transaction compensation can be precisely controlled through `db`

## Cache methods

| Name   | Description                             |
| ------ | --------------------------------------- |
| get    | Read cache                              |
| mget   | Read multiple caches at once            |
| peek   | Retrieve cache without updating its TTL |
| set    | Set cache                               |
| mset   | Set multiple caches at once             |
| getset | Set new cache and return the old value  |
| has    | Check if cache exists                   |
| del    | Delete cache                            |
| mdel   | Delete multiple caches at once          |
| clear  | Clear all caches                        |
