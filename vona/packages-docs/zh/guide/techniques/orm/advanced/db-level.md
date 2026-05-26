# 数据源分级

在分布式场景中，需要避免因数据源竞争而引发的死锁问题。

VonaJS 采用`Async Local Storage`为不同的上下文提供不同的`数据源分级`，从而创建不同的数据库连接池，避免数据源竞争的发生。

- 参见：[数据源分级](../../../distributed/queue/db-level.md)
