# Datasource Level

In distributed environments, it's crucial to avoid deadlocks caused by datasource contention.

VonaJS employs `Async Local Storage` to provide different `datasource level` for different contexts, thereby creating different database connection pools and preventing datasource contention.

- See: [Datasource Level](../../../distributed/queue/db-level.md)
