# Redlock

VonaJS provides an intuitive and easy-to-use distributed lock based on [Redlock](https://github.com/sesamecare/redlock/)

## Create Redlock

For example, create redlock in the module `demo-student`

### 1. Cli Command

```bash
$ vona :create:bean meta redlock --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Meta/Redlock`
:::

## Redlock Definition

```typescript
export type TypeRedlockLockResource = never;
export type TypeRedlockLockIsolateResource = never;

@Meta()
export class MetaRedlock extends BeanRedlockBase<
  TypeRedlockLockResource,
  TypeRedlockLockIsolateResource
> {}
```

- `TypeRedlockLockResource`: Defines the lock resources used by the `lock` method
- `TypeRedlockLockIsolateResource`: Defines the lock resources used by the `lockIsolate` method

## Defining Lock Resources

When using distributed locks, we need to specify the corresponding lock resources. For example, defining a lock resource `name` for the `lock` method:

```diff
- export type TypeRedlockLockResource = never;
+ export type TypeRedlockLockResource = 'name';
```

## Using Redlock

```typescript
class ControllerStudent {
  async test() {
    const res = await this.scope.redlock.lock('name', async () => {
      // do something in lock
      return 'some result';
    });
  }
}
```

- `redlock.lock`: Passing in the lock resource `name`

## `lock/lockIsolate`

VonaJS provides two lock methods: `lock/lockIsolate`. The difference between the two is that `lockIsolate` automatically implements `datasource level`, thus avoiding deadlocks caused by datasource contention.

- See: [Datasource level](./queue/db-level.md)

### Defining Lock Resources: lockIsolate

Defining lock resources for the `lockIsolate` method:

```diff
- export type TypeRedlockLockIsolateResource = never;
+ export type TypeRedlockLockIsolateResource = 'name';
```

### Using Redlock: lockIsolate

```typescript
class ControllerStudent {
  async test() {
    const res = await this.scope.redlock.lockIsolate('name', async () => {
      // do something in lock
      return 'some result';
    });
  }
}
```

## Defining Lock Resources: Literal Template

Lock resources can also be literal templates.

For example, if you want to provide separate lock resources for different users, you can use a string like `user-${userId}` as the lock resource name.

```diff
- export type TypeRedlockLockIsolateResource = 'name';
+ export type TypeRedlockLockIsolateResource = 'name' | `user-${string}`;
```

This way, type hints can also be provided when using the `lockIsolate` method.

```typescript
class ControllerStudent {
  async test() {
    const userId = 1;
    const res = await this.scope.redlock.lockIsolate(`user-${userId}`, async () => {
      // do something in lock
      return 'some result';
    });
  }
}
```

## Inspect

You can directly inspect the currently effective redlock list.

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   this.bean.onion.meta.inspectMeta('redlock');
  }
}
```

- `this.bean.onion`: Get the global Service instance `onion`
- `.meta`: Get the Service instance related to the meta
- `.inspectMeta`: Output the currently effective redlock list

When accessing the `test` API, the currently effective redlock list will be automatically output to the console, as shown below:

![](../../assets/img/distributed/redlock-1.png)
