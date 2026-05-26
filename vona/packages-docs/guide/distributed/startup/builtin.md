# Built-in Startup

## App Startup

| Name                   | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| a-version:databaseInit | Automatically create a test database                          |
| a-version:databaseName | Automatically set the database name of the default datasource |
| a-web:listen           | Starts listening port                                         |

### 1. a-version:databaseInit

This startup performs the following logic:

1. Automatically create a test database in the local development and testing environment. If have `isolated mode` tenants, an isolated database corresponding to each tenant will be automatically created
   - [Multi-Instance/Multi-Tenancy](../../env-config/instance/introduction.md)
   - [Database Strategy](../../env-config/db-strategy/introduction.md)
2. Automatically perform database schema migration, just as the `version.update` method does
   - [Migration and Changes](../../rest-api/version.md)

### 2. a-version:databaseName

Since the test database is automatically created in the local development and testing environment, the database name also changes. This startup will automatically set the database name of the default datasource.

## Instance Startup

| Name                     | Description                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| a-version:instanceInit   | Initials data for the instance, just as the `version.init` method does. See: [Migration and Changes](../../rest-api/version.md) |
| a-printtip:printTip      | Outputs messages to the console, such as `Swagger URL`, etc.                                                                    |
| a-queue:loadQueueWorkers | Starts the workers of the queues                                                                                                |
| a-schedule:loadSchedules | Starts schedules                                                                                                                |
