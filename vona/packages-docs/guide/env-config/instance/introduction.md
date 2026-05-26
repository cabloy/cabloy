# Multi-Instance/Multi-Tenancy

VonaJS supports the development of `multi-tenancy` SaaS systems through the concept of `multi-instance`. Simply launch a single backend service and you can run multiple instances simultaneously.

VonaJS supports the following `Multi-Instance/Multi-Tenancy` modes:

1. `Shared Mode`: Multiple instances share the same database, isolating data between them using the `instance ID` field
2. `Isolated Mode`: Each instance uses its own isolated database
3. `Hybrid Mode`: Both `shared` and `isolated` modes are supported within a single system, allowing you to specify whether an instance uses a shared or isolated database

## Instance Configuration

### 1. Test Environment and Development Environment

In the test and development environments, a `empty` instance is provided by default, and two `test instances` are provided to demonstrate how to use `shared mode` and `isolated mode`:

`src/backend/config/config/config.test.ts`

`src/backend/config/config/config.dev.ts`

```typescript
// instance
config.instance = {
  instances: {
    '': { password: '', title: '', config: {} },
    'shareTest': { password: '', title: '' },
    'isolateTest': {
      password: '',
      title: '',
      id: 1000,
      isolate: true,
      isolateClient: 'isolateTest',
    },
  },
};
```

- Instance List

| Name        | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| empty       | Default instance                                                                                   |
| shareTest   | Used to demonstrate `shared mode`, specifically, `shareTest` shares the same database with `empty` |
| isolateTest | Used to demonstrate `isolated mode`, specifically, `isolateTest` using an isolated database        |

- Instance Fields

| Name          | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| password      | Initial password for the `admin` user in the instance, defaults to `123456`    |
| title         | Website title                                                                  |
| config        | Instance configuration information                                             |
| id            | When using `isolated mode`, you must explicitly specify a unique `Instance Id` |
| isolate       | Whether to use `isolated mode`, the default is `shared mode`                   |
| isolateClient | When using `isolated mode`, you must explicitly specify `datasource`           |

- `config`: The `config` data will be merged with `App Config` to generate `Instance Config`. The instance config can be retrieved using `this.ctx.config`

### 2. Production Environment

In the production environment, you need to configure instance information yourself.

`src/backend/config/config/config.prod.ts`

```typescript
// instance
config.instance = {
  instances: {
    '': { password: '', title: '', config: {} },
    'vona': { password: '', title: '', config: {} },
  },
};
```

## How to add a new instance

The following example demonstrates how to add a new instance using the `shareTest` instance:

### 1. Adding Type Definitions

Using the interface merging mechanism to add the type definition for the new instance.

In the VSCode editor, enter the code snippet `recordinstance` to automatically generate a code skeleton:

`src/backend/config/config/config.ts`

```typescript
declare module 'vona' {
  export interface IInstanceRecord {
    : never;
  }
}
```

Adjust the code and add `shareTest`

```diff
declare module 'vona' {
  export interface IInstanceRecord {
+   shareTest: never;
  }
}
```

### 2. Adding Instance Configuration

Add instance configuration to the required config file, for example, to configure a new instance in the test environment:

`src/backend/config/config/config.test.ts`

```typescript
// instance
config.instance = {
  instances: {
    shareTest: { password: '', title: '', config: {} },
  },
};
```

- For `isolated mode`, you also need to configure a `datasource`. See: [Datasource Config](../../techniques/orm/config-datasource.md)

## Rules for Obtaining the Current Instance Name

When a user accesses the backend API, the backend automatically obtains the current instance name based on the rules and then retrieves instance information based on the instance name.

### 1. App Config

`src/backend/config/config/config.ts`

```typescript
// instance
config.instance = {
  getInstanceName: undefined,
  headerField: 'x-vona-instance-name',
  queryField: 'x-vona-instance-name',
};
```

| Name            | Description                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| getInstanceName | Provides a custom function for obtaining the current instance name                                        |
| headerField     | Gets the current instance name from the request header. The header key defaults to `x-vona-instance-name` |
| queryField      | Gets the current instance name from the request query. The query key defaults to `x-vona-instance-name`   |

### 2. Rule Order

The system determines the current instance name in the following order. The determination process stops when the instance name is obtained.

1. If `getInstanceName` is provided, this function is called
2. If `queryField` is not empty, the instance name is obtained from the request query
3. If `headerField` is not empty, the instance name is obtained from the request header
4. Resolve the instance name from the domain name

### 3. How to resolve the instance name from the domain name

For example, if the domain name is `https://cabloy.com`, the corresponding instance name is `cabloy`. You can modify the calculation rules by configuring `SERVER_SUBDOMAINOFFSET`

`env/.env`

```typescript
# server
SERVER_SUBDOMAINOFFSET = 1
```

- When `SERVER_SUBDOMAINOFFSET = 1`, the domain name and instance name correspond as follows:

| Domain Name      | Instance Name |
| ---------------- | ------------- |
| cabloy.com       | cabloy        |
| store.cabloy.com | cabloy.store  |

- When `SERVER_SUBDOMAINOFFSET = 2`, the domain name and instance name correspond as follows:

| Domain Name      | Instance Name |
| ---------------- | ------------- |
| cabloy.com       | Empty String  |
| store.cabloy.com | store         |

## Using Multi-Instance

### 1. Accessing Current Instance Information

```typescript
// Current Instance Name
const name = this.ctx.instanceName;
// Current instance object
const instance = this.ctx.instance;
// Current instance Id
const iid = this.ctx.instance.id;
```

### 2. Using the Model to query data

Since data across multi-instance is isolated, you must specify the `instance id` when querying data. VonaJS provides a very powerful `Model` object, which can transparently handle multi-instance.

```typescript
// create
await this.scope.model.student.insert({ name: 'Tom' });
// select
await this.scope.model.student.select();
// get
await this.scope.model.student.get({ id: 1 });
// update
await this.scope.model.student.update({ id: 1, name: 'Jimmy' });
// delete
await this.scope.model.student.delete({ id: 1 });
```

When we use the `student` model to manipulate data, the system automatically sets the `Instance Id`

### 3. Using Query Builder to query data

If you use the `builder()` method to query data, you need to add `Instance Id` yourself.

```typescript
await this.scope.model.student.builder().where({
  iid: this.ctx.instance.id,
  name: 'Tom',
});
```

If you use the `builderSelect()` method to query data, the system will automatically add `Instance Id`

```typescript
await this.scope.model.student.builderSelect().where({
  name: 'Tom',
});
```

### 4. Using Raw SQL to query data

If you use `Raw SQL` to query data, you will need to add `Instance Id` yourself.

```typescript
await this.scope.model.student.query('select * from demoStudent where iid=?', [
  this.ctx.instance.id,
]);
await this.scope.model.student.queryOne('select * from demoStudent where iid=? and id=?', [
  this.ctx.instance.id,
  1,
]);
```
