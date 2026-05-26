# 启动项

VonaJS 提供了`启动项`，允许在系统启动时或者实例初始化时，执行初始化逻辑。

## 启动项分类

VonaJS 提供了两类启动项：

1. `应用启动项`：当系统启动时执行
2. `实例启动项`：当实例初始化时执行。 因为 VonaJS 支持多实例/多租户，因此在每个实例初始化时都会自动执行`实例启动项`

## 创建启动项

比如，在模块 demo-student 中创建一个启动项: `log`，在系统启动时在控制台输出当前时间。

### 1. Cli命令

```bash
$ vona :create:bean startup log --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Startup`
:::

## 启动项定义

```typescript
@Startup()
export class StartupLog extends BeanBase implements IStartupExecute {
  async execute() {
    console.log('Current time: ', Date.now());
  }
}
```

- `execute`: 输出当前时间

## 启动项参数

可以为启动项配置参数。

```typescript
@Startup({
  instance: false,
  after: false,
  debounce: true,
  transaction: false,
})
export class StartupLog {}
```

| 名称        | 类型            | 说明                                       |
| ----------- | --------------- | ------------------------------------------ |
| instance    | boolean         | 是否是实例启动项，默认为`false`            |
| after       | boolean         | 控制启动项的时机，默认为`false`            |
| debounce    | boolean\|number | 采用debounce方式执行Startup，默认为`false` |
| transaction | boolean         | 是否启用数据库事务，默认为`false`          |

- `after`:
  - `false`: 在`appReady`(应用启动项)或者`instanceReady`(实例启动项)之前执行
  - `true`: 在`appReady`(应用启动项)或者`instanceReady`(实例启动项)之后执行
- `debounce`
  - `false`: 禁用 debounce
  - `true`: 使用系统默认的 debounce 时间
  - `number(ms)`: 指定具体的 debounce 时间

## App Config

可以在 App Config 中配置启动项参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  startup: {
    'demo-student:log': {
      after: false,
      debounce: true,
      instance: false,
      transaction: false,
    },
  },
};
```

## 启动项顺序

由于启动项是默认加载并执行的，所以，VonaJS 提供了两个参数，用于控制启动项的加载顺序。

### 1. dependencies

比如，系统有一个内置启动项`a-web:listen`，希望加载顺序如下：`a-web:listen` > `Current`

```diff
@Startup({
+ dependencies: 'a-web:listen',
})
class StartupLog {}
```

### 2. dependents

`dependents`的顺序刚好与`dependencies`相反，希望加载顺序如下：`Current` > `a-web:listen`

```diff
@Startup({
+ dependents: 'a-web:listen',
})
class StartupLog {}
```

## 启动项启用/禁用

可以控制启动项的`启用/禁用`

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  startup: {
    'demo-student:log': {
+     enable: false,
    },
  },
};
```

### 2. Meta

可以让启动项在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@Startup({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class StartupLog {}
```

## 查看当前生效的启动项清单

可以直接输出当前生效的启动项清单。

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   this.bean.onion.startup.inspect();
  }
}
```

- `this.bean.onion`: 取得全局 Service 实例 `onion`
- `.startup`: 取得与启动项相关的 Service 实例
- `.inspect`: 输出当前生效的启动项清单

当访问`test` API 时，会自动在控制台输出当前生效的启动项清单，效果如下：

![](../../../assets/img/distributed/startup-1.png)
