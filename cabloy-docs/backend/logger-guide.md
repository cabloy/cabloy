# Logger Guide

## Why logging matters in Vona

Vona provides a structured logging system so backend logs can stay typed, environment-aware, and operationally useful instead of becoming ad hoc console output.

That matters because production systems need different log clients, different retention behavior, different levels, and different context metadata.

## Core logger model

Vona’s logging system is built around:

- **clients**
- **children**
- **rotation**
- **levels**

The system is based on Winston, but the important point in Cabloy is the framework-level model rather than the raw logger library itself.

## Log directory behavior

By default, the log directory changes by runtime environment.

Representative defaults are:

- test/development → `{project path}/.app/logs`
- production → `{home}/vona/{project name}/logs`

This can be configured through app config or environment variables such as `LOGGER_DIR`.

## Logger configuration

Logger behavior is configured through `config.logger`.

Representative areas include:

- `baseDir`
- `rotate(...)`
- `base`
- `clients`

This means log behavior is part of the app configuration model, not a hardcoded utility.

## Rotation

Vona supports rotating log files by configuration.

Representative rotate options include:

- `enable`
- `filename`
- `datePattern`
- `maxSize`
- `maxFiles`

These can be configured through app config or environment variables.

## Logger clients

The system provides a built-in `default` client and supports adding additional clients for scenario-specific logging.

For example, a project can add an `order` client to separate order-related logs.

A client can define its own transports while still inheriting common logger behavior.

## Getting a logger client

There are two common access styles.

### Via bean logger

```typescript
const loggerDefault = this.bean.logger.default;
const loggerOrder = this.bean.logger.get('order');
```

### Via shorthand helpers

```typescript
this.$logger.info('test');
this.$loggerClient('order').info('test');
```

The shorthand helpers are especially useful because they automatically include the current bean identity in the log context.

## Child loggers

For the same client, Vona can create child loggers for scenario-level context.

Representative pattern:

```typescript
this.$loggerChild('pay').info('$50');
this.$loggerChild('pay', 'order').info('$50');
```

That keeps business-specific log context explicit without requiring a whole new logger client every time.

## Log levels

Vona uses standard npm/RFC5424-style levels such as:

- `error`
- `warn`
- `info`
- `http`
- `verbose`
- `debug`
- `silly`

These levels map directly to logger methods such as:

```typescript
this.$logger.error('test');
this.$logger.warn('test');
this.$logger.info('test');
this.$logger.debug('test');
```

## Level control and transport behavior

Logger level controls what gets written where.

Representative patterns include:

- file transport at the normal level threshold
- a second file transport for a more verbose level such as `debug`
- console transport behavior for operational visibility

Default level behavior can also be configured through environment variables such as:

- `LOGGER_CLIENT_DEFAULT`
- `LOGGER_CLIENT_ORDER`

## Reading and changing levels at runtime

Vona can inspect or change active logger levels while the system is running.

Representative methods include:

- `getFilterLevel()`
- `setFilterLevel(...)`

When level changes are applied, Vona can propagate them across workers, which is especially useful for live diagnostics.

## Delayed log messages

When expensive log-message construction would be wasted at a disabled level, Vona supports delayed message generation through callbacks.

Representative pattern:

```typescript
this.$logger.debug(() => {
  return JSON.stringify(obj);
});
```

That avoids unnecessary work when the current level would drop the message anyway.

## Relationship to internal AOP and runtime behavior

Logging is closely connected to:

- [Internal AOP Guide](/backend/internal-aop-guide) through built-in AOP helpers such as `@Core.log(...)`
- [Runtime and Flavors](/backend/runtime-and-flavors) because log location, level, and operational behavior often vary by environment

## Why this matters for AI workflows

When AI edits backend logging behavior, it should ask:

1. does this belong in the default client, a dedicated client, or a child logger?
2. should the behavior be implemented through normal logger usage or an AOP-style logging decorator?
3. does the current runtime environment or flavor affect where or how logs should be written?
4. should expensive log-message construction be delayed behind a callback?

That helps AI keep logging aligned with Vona’s operational model instead of scattering raw console output through the codebase.
