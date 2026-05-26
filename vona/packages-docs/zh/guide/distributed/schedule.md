# 定时任务

VonaJS 基于[BullMQ](https://github.com/taskforcesh/bullmq)提供了直观、易用的定时任务。因为定时任务是队列的特例。

## 创建定时任务

比如，在模块 demo-student 中创建一个定时任务: `log`，按指定的时间间隔在控制台输出当前时间。

### 1. Cli命令

```bash
$ vona :create:bean schedule log --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Schedule`
:::

## 定时任务定义

```typescript
@Schedule({ repeat: { every: 3000 } })
export class ScheduleLog extends BeanBase implements IScheduleExecute {
  async execute() {
    console.log(Date.now());
  }
}
```

- `execute`: 输出当前时间

## 定时任务参数

可以为定时任务配置参数。

```typescript
@Schedule({
  queue: undefined,
  repeat: {
    every: 3000,
    pattern: '0 15 3 * * *',
  },
  templateOptions: {},
  dbInfo: undefined,
  transaction: false,
})
class ScheduleLog {}
```

| 名称              | 类型                             | 说明                                                                             |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| queue             | string                           | 定时任务所使用的队列名称。默认值为空，从而使用系统内置的队列                     |
| repeat.every      | number                           | 间隔时间                                                                         |
| repeat.pattern    | string                           | cron expression。参见: [cron-parser](https://github.com/harrisiirak/cron-parser) |
| templateOptions   | Bull.JobSchedulerTemplateOptions | Bull JobScheduler选项                                                            |
| dbInfo.level      | number                           | 默认使用数据源分级`1`，参见: [数据源分级](./queue/db-level.md)                   |
| dbInfo.clientName | string                           | 默认使用系统默认的数据源名称                                                     |
| transaction       | boolean                          | 是否启用数据库事务，默认为`false`                                                |

## App Config

可以在 App Config 中配置定时任务参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  schedule: {
    'demo-student:log': {
      repeat: {
        every: 5000,
      },
      transaction: true,
    },
  },
};
```

## 定时任务启用/禁用

可以控制定时任务的`启用/禁用`

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  schedule: {
    'demo-student:log': {
+     enable: false,
    },
  },
};
```

### 2. Meta

可以让定时任务在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                |
| ------ | ---------------- | ------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@Schedule({
  repeat: {},
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class ScheduleLog {}
```

## 查看当前生效的定时任务清单

可以直接输出当前生效的定时任务清单。

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   this.bean.onion.schedule.inspect();
  }
}
```

- `this.bean.onion`: 取得全局 Service 实例 `onion`
- `.schedule`: 取得与定时任务相关的 Service 实例
- `.inspect`: 输出当前生效的定时任务清单

当访问`test` API 时，会自动在控制台输出当前生效的定时任务清单，效果如下：

![](../../assets/img/distributed/schedule-1.png)
