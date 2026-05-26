# Queue

VonaJS provides a powerful queue component based on [BullMQ](https://github.com/taskforcesh/bullmq)

## Create Queue

For example, create a queue `add` in the module `demo-student`, which performs addition on the passed parameters.

### 1. Cli Command

```bash
$ vona :create:bean queue add --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Vona Bean/Queue`
:::

## Queue Definition

```typescript
export interface TypeQueueAddJobData {
  a: number;
  b: number;
}

export type TypeQueueAddJobResult = number;

@Queue()
export class QueueAdd
  extends BeanQueueBase<TypeQueueAddJobData, TypeQueueAddJobResult>
  implements IQueueExecute<TypeQueueAddJobData, TypeQueueAddJobResult>
{
  async execute(
    data: TypeQueueAddJobData,
    _options?: IQueuePushOptions,
  ): Promise<TypeQueueAddJobResult> {
    return data.a + data.b;
  }
}
```

- `TypeQueueAddJobData`: Defines the job data
- `TypeQueueAddJobResult`: Defines the job result
- `execute`: Executes the job

* execute parameters

| Name    | Description |
| ------- | ----------- |
| data    | Job data    |
| options | Job options |

## Push Job

### 1. No return value

```typescript
class ControllerStudent {
  test() {
    const data = { a: 1, b: 2 };
    this.scope.queue.add.push(data);
  }
}
```

- `this.scope.queue.add`: Gets the queue instance through the module scope
- `push`: Pushes a job without waiting for the result

### 2. Await return value

```typescript
class ControllerStudent {
  async test() {
    const data = { a: 1, b: 2 };
    const result = await this.scope.queue.add.pushAsync(data);
    console.log(result);
  }
}
```

- `this.scope.queue.add`: Gets the queue instance through the module scope
- `pushAsync`: Pushes a job and await for the result

## `push/pushAsync`

```typescript
push(data: DATA, options?: IQueuePushOptions);
async pushAsync(data: DATA, options?: IQueuePushOptions): Promise<RESULT>;
```

| Name    | Description |
| ------- | ----------- |
| data    | Job data    |
| options | Job options |

- options

| Name              | Type             | Description                                                                                     |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| queueNameSub      | string           | Subqueue name                                                                                   |
| jobName           | string           | Job name                                                                                        |
| jobOptions        | Bull.JobsOptions | Job options                                                                                     |
| dbInfo.level      | number           | Defaults to the current context's datasource level `+1`, see: [Datasource Level](./db-level.md) |
| dbInfo.clientName | string           | Defaults to the current context's datasource name                                               |
| locale            | string           | Defaults to the current context's locale                                                        |
| instanceName      | string           | Defaults to the current context's instance name                                                 |
| extraData         | object           | See: [Extra Data](./extra-data.md)                                                              |

## Queue Parameters

Parameters can be configured for queue.

```typescript
@Queue({
  concurrency: false,
  transaction: false,
  options: {
    queue: {},
    worker: {},
    job: {},
    redlock: {},
  },
})
class QueueAdd {}
```

| Name            | Type               | Description                                                |
| --------------- | ------------------ | ---------------------------------------------------------- |
| concurrency     | boolean            | Whether to execute in parallel, default is `false`         |
| transaction     | boolean            | Whether to enable database transaction, default is `false` |
| options.queue   | Bull.QueueOptions  | Bull Queue options                                         |
| options.worker  | Bull.WorkerOptions | Bull Worker options                                        |
| options.job     | Bull.JobsOptions   | Bull Job options                                           |
| options.redlock | Redlock.Redlock    | Redlock options                                            |

- `options.redlock`: When `concurrency=false`, a redlock is required to ensure that jobs are executed serially. The system provides a default redlock, but you can also provide your own

## App Config

You can configure queue parameters in the App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  queue: {
    'demo-student:add': {
      concurrency: false,
      transaction: false,
      options: {
        queue: {},
        worker: {},
        job: {},
        redlock: {},
      },
    },
  },
};
```

## Queue Enable/Disable

You can control `enable/disable` of queue.

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  queue: {
    'demo-student:add': {
+     enable: false,
    },
  },
};
```

### 2. Meta

Allows queue to take effect in a specified operating environment.

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

- Example

```diff
@Queue({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class QueueAdd {}
```

## Inspect

You can directly inspect the currently effective queue list.

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   this.bean.onion.queue.inspect();
  }
}
```

- `this.bean.onion`: Get the global Service instance `onion`
- `.queue`: Get the Service instance related to the queue
- `.inspect`: Output the currently effective queue list

When accessing the `test` API, the currently effective queue list will be automatically output to the console, as shown below:

![](../../../assets/img/distributed/queue-1.png)
