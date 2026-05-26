# Distributed Components

To support distributed development, VonaJS provides the following core components based on `Redis`:

- `Queue`: Provides a powerful queue component based on [BullMQ](https://github.com/taskforcesh/bullmq)
- `Startup`: Allows initialization logic to be executed during system startup or instance initialization
- `Broadcast`: Broadcasts can be emitted to multiple worker processes in the system, allowing each worker process to execute business logic
- `Schedule`: Provides intuitive and easy-to-use schedule based on [BullMQ](https://github.com/taskforcesh/bullmq). Schedule is a special case of queue
- `Redlock`: Provides an intuitive and easy-to-use distributed lock based on [Redlock](https://github.com/sesamecare/redlock/)
- `Election`: Elect a predetermined number of worker processes in a distributed scenario
