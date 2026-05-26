# 多实例/多租户

VonaJS 通过`多实例`的概念来支持多租户 SAAS 系统的开发。只需启动一个后端服务，即可支持多个实例同时运行。

VonaJS 支持以下几种`多实例/多租户`模式：

1. `共享模式`：多个实例共享同一个数据库，通过`实例Id`字段隔离多实例之间的数据
2. `独立模式`：每个实例都使用独立的数据库，从而满足大数据量的业务需求
3. `混合模式`：在一个系统中同时支持`共享模式`和`独立模式`，从而可以精确指定某个实例使用`共享数据库`还是`独立数据库`

## 实例配置

### 1. 测试环境、开发环境

在测试环境和开发环境中，系统默认提供了一个`缺省实例`。同时提供了两个`测试实例`，用于演示如何使用`共享模式`和`独立模式`：

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

- 实例清单

| 名称        | 说明                                                               |
| ----------- | ------------------------------------------------------------------ |
| empty       | 缺省实例                                                           |
| shareTest   | 用于演示`共享模式`，具体而言，`shareTest`与`empty`共享同一个数据库 |
| isolateTest | 用于演示`独立模式`，具体而言，`isolateTest`使用独立的数据库        |

- 实例属性

| 名称          | 说明                                           |
| ------------- | ---------------------------------------------- |
| password      | 实例中用户`admin`的初始密码，默认是`123456`    |
| title         | 网站标题                                       |
| config        | 实例的配置信息                                 |
| id            | 当使用`独立模式`时，必须明确指定唯一的`实例Id` |
| isolate       | 是否使用`独立模式`，默认为`共享模式`           |
| isolateClient | 当使用`独立模式`时，必须明确指定`数据源`       |

- `config`: `config`数据将与`App Config`合并，从而生成`Instance Config`。可以使用`this.ctx.config`获取实例配置

### 2. 生产环境

在生产环境，需要自行配置实例信息。

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

## 如何添加新实例

下面以实例`shareTest`为例，演示如何添加新实例：

### 1. 添加类型定义

采用接口合并机制添加新实例的类型定义。

在 VSCode 编辑器中，输入代码片段`recordinstance`，自动生成代码骨架:

`src/backend/config/config/config.ts`

```typescript
declare module 'vona' {
  export interface IInstanceRecord {
    : never;
  }
}
```

调整代码，然后添加`shareTest`

```diff
declare module 'vona' {
  export interface IInstanceRecord {
+   shareTest: never;
  }
}
```

### 2. 增加实例配置

在需要的 config 文件中添加实例配置，比如在测试环境配置新实例：

`src/backend/config/config/config.test.ts`

```typescript
// instance
config.instance = {
  instances: {
    shareTest: { password: '', title: '', config: {} },
  },
};
```

- 对于`独立模式`，还需要配置数据源，参见: [数据源配置](../../techniques/orm/config-datasource.md)

## 获取当前实例名的规则

当用户访问后端 API 时，后端会自动根据规则获取当前实例名，然后根据实例名获取实例信息。

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

| 名称            | 说明                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| getInstanceName | 提供自定义函数，用于获取当前实例名                                       |
| headerField     | 从request header中获取当前实例名，header key默认为`x-vona-instance-name` |
| queryField      | 从request query中获取当前实例名，query key默认为`x-vona-instance-name`   |

### 2. 规则次序

系统按以下次序，依次判断当前实例名，当获取到实例名时则停止判断流程。

1. 如果提供了`getInstanceName`，则调用此函数
2. 如果`queryField`不为空，则从 request query 中获取
3. 如果`headerField`不为空，则从 request header 中获取
4. 从域名中解析实例名

### 3. 如何从域名中解析实例名

比如，域名为`https://cabloy.com`，那么对应的实例名是`cabloy`。可以通过配置`SERVER_SUBDOMAINOFFSET`来修改计算规则。

`env/.env`

```typescript
# server
SERVER_SUBDOMAINOFFSET = 1
```

- 当`SERVER_SUBDOMAINOFFSET = 1`时，域名与实例名对应关系如下：

| 域名             | 实例名       |
| ---------------- | ------------ |
| cabloy.com       | cabloy       |
| store.cabloy.com | cabloy.store |

- 当`SERVER_SUBDOMAINOFFSET = 2`时，域名与实例名对应关系如下：

| 域名             | 实例名   |
| ---------------- | -------- |
| cabloy.com       | 空字符串 |
| store.cabloy.com | store    |

## 使用多实例

### 1. 访问当前实例信息

```typescript
// 当前实例名
const name = this.ctx.instanceName;
// 当前实例对象
const instance = this.ctx.instance;
// 当前实例Id
const iid = this.ctx.instance.id;
```

### 2. 使用Model操作数据库

由于多实例的数据是相互隔离的，因此在操作数据库时，需要指定`实例Id`。VonaJS 提供了非常强大的`Model`对象，从而可以透明的处理多实例。

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

当使用 Model `student`操作数据时，系统会自动设置`实例Id`

### 3. 使用Query Builder操作数据库

如果使用`builder()`方法操作数据库，就需要自行添加`实例Id`

```typescript
await this.scope.model.student.builder().where({
  iid: this.ctx.instance.id,
  name: 'Tom',
});
```

如果使用`builderSelect()`方法操作数据库，系统会自动添加`实例Id`

```typescript
await this.scope.model.student.builderSelect().where({
  name: 'Tom',
});
```

### 4. 使用原生Sql操作数据库

如果使用`原生Sql`操作数据库，就需要自行添加`实例Id`

```typescript
await this.scope.model.student.query('select * from demoStudent where iid=?', [
  this.ctx.instance.id,
]);
await this.scope.model.student.queryOne('select * from demoStudent where iid=? and id=?', [
  this.ctx.instance.id,
  1,
]);
```
