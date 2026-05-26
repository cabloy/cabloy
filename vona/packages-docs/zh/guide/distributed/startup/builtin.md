# 内置启动项

## 应用启动项

| 名称                   | 说明                           |
| ---------------------- | ------------------------------ |
| a-version:databaseInit | 自动创建测试数据库             |
| a-version:databaseName | 自动设置缺省数据源的数据库名称 |
| a-web:listen           | 启动服务的端口监听             |

### 1. a-version:databaseInit

该启动项执行以下逻辑：

1. 在本地开发和测试环境，自动创建测试数据库。如果有`独立模式`的`多实例/多租户`设置，则会自动创建与租户对应的独立数据库
   - [多实例/多租户](../../env-config/instance/introduction.md)
   - [数据库策略](../../env-config/db-strategy/introduction.md)
2. 自动执行数据库的架构迁移，即`version.update`方法
   - [迁移与变更](../../rest-api/version.md)

### 2. a-version:databaseName

由于在本地开发和测试环境，测试数据库是自动创建的，因此，数据库名称也是变化的。改启动项会自动设置缺省数据源的数据库名称。

## 实例启动项

| 名称                     | 说明                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------- |
| a-version:instanceInit   | 为实例初始化数据，即`version.init`方法。参见: [迁移与变更](../../rest-api/version.md) |
| a-printtip:printTip      | 在控制台输出提示信息，比如`Swagger URL`等                                             |
| a-queue:loadQueueWorkers | 启动队列的Worker执行体                                                                |
| a-schedule:loadSchedules | 启动定时任务                                                                          |
