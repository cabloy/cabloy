# 分布式组件

为了支持分布式开发，VonaJS 基于`Redis`提供了以下核心组件:

- `队列`: 基于[BullMQ](https://github.com/taskforcesh/bullmq)提供了强大的队列组件
- `启动项`: 允许在系统启动时或者实例初始化时，执行初始化逻辑
- `广播`: 可以向系统的多个工作进程发送广播，从而让每个工作进程执行业务逻辑
- `定时任务`: 基于[BullMQ](https://github.com/taskforcesh/bullmq)提供了直观、易用的定时任务。因为定时任务是队列的特例
- `分布式锁`: 基于[Redlock](https://github.com/sesamecare/redlock/)提供了直观、易用的分布式锁
- `Election`: 在分布式场景中竞选出约定数量的工作进程
