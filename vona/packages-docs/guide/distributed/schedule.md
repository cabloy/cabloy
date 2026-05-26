# Schedule

VonaJS provides intuitive and easy-to-use schedule based on [BullMQ](https://github.com/taskforcesh/bullmq). Because schedule is a special case of queue.

## Create Schedule

For example, create a schedule `log` in the module `demo-student`, which will output the current time to the console at specified time intervals.

### 1. Cli Command

```bash
$ vona :create:bean schedule log --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Bean/Schedule`
:::

## Schedule Definition

```typescript
@Schedule({ repeat: { every: 3000 } })
export class ScheduleLog extends BeanBase implements IScheduleExecute {
  async execute() {
    console.log(Date.now());
  }
}
```

- `execute`: Outputs the current time

## Schedule Parameters

Parameters can be configured for schedule.

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

| Name              | Type                             | Description                                                                                                    |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| queue             | string                           | The name of the queue used by the schedule. The default value is empty, thus using the system's built-in queue |
| repeat.every      | number                           | Interval                                                                                                       |
| repeat.pattern    | string                           | Cron expression. See: [cron-parser](https://github.com/harrisiirak/cron-parser)                                |
| templateOptions   | Bull.JobSchedulerTemplateOptions | Bull JobScheduler options                                                                                      |
| dbInfo.level      | number                           | Defaults to datasource level `1`, see: [Datasource Level](./queue/db-level.md)                                 |
| dbInfo.clientName | string                           | Defaults to the system's default datasource name                                                               |
| transaction       | boolean                          | Whether to enable database transaction, defaults to `false`                                                    |

## App Config

Schedule parameters can be configured in App Config.

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

## Schedule Enable/Disable

You can control `enable/disable` of schedule.

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

Allows schedule to take effect in a specified operating environment.

| Name   | Type             | Description                                                                        |
| ------ | ---------------- | ---------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../env-config/mode-flavor/introduction.md) |

- Example

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

## Inspect

You can directly inspect the currently effective schedule list.

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   this.bean.onion.schedule.inspect();
  }
}
```

- `this.bean.onion`: Get the global Service instance `onion`
- `.schedule`: Get the Service instance related to the schedule
- `.inspect`: Output the currently effective schedule list

When accessing the `test` API, the currently effective schedule list will be automatically output to the console, as shown below:

![](../../assets/img/distributed/schedule-1.png)
