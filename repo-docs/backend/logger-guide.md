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
- production → `{home}/.vona/{project name}/logs`

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

Representative type extension and client configuration patterns include:

```typescript
declare module 'vona' {
  export interface ILoggerClientRecord {
    order: never;
  }
}
```

```typescript
config.logger = {
  clients: {
    order(this: VonaApplication, clientInfo) {
      const transports = [
        this.bean.logger.makeTransportFile(clientInfo, 'order'),
        this.bean.logger.makeTransportConsole(clientInfo),
      ];
      return { transports };
    },
  },
};
```

In the VSCode workflow, the `recordloggerclient` snippet can generate the client-type augmentation skeleton.

## HTTP access logs versus diagnostics

The application config separates HTTP access records from diagnostic logs using the `access` client. Each eligible request produces one terminal result through the `res` child at `info`, rather than separate request and response records. It does not use the default client's `http` level. Clients select purpose and routing, while levels select verbosity within a client. Raising diagnostic logging to `debug` therefore does not send access records to the diagnostic console or `combined.log`.

By default, `access` has only a normal threshold-filtered file transport, writing `access.log` under the configured log directory and using the existing rotation settings. Managed isolated test runs use their run-owned `.app-test-<runId>/logs` directory. The default client's existing transports remain available for other explicit logger calls.

Control access logging independently:

- `LOGGER_CLIENT_ACCESS=info` keeps ordinary access records.
- `LOGGER_CLIENT_ACCESS=false` disables access output without disabling business diagnostics.
- `this.bean.logger.setFilterLevel(false, 'access')` changes the same filter at runtime; `setFilterLevel('info', 'access')` restores it.

The file transport must follow the client threshold: use `makeTransportFile(clientInfo, 'access')`, without a strict-level argument. Strict-level file transports have different filtering semantics and do not follow the client's disable switch.

Files actually handled by Vona's static cache are excluded, including public/module files, aliases, and built Vona-integrated SSR client assets. Cached files, HEAD and conditional 304 responses are excluded too. Missing files that fall through, dynamic SSR pages, and business routes with filename-like paths remain eligible for logging. External development proxy responses remain eligible because their completion does not distinguish a static asset from a page; exclusions are not guessed from filename extensions or entire site prefixes.

The terminal result contains only these payload fields, alongside the normal logger envelope and available request/trace correlation:

| Field        | Meaning                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| `method`     | Request method captured at middleware entry                                   |
| `url`        | Entry URL with query/fragment values and absolute-URL userinfo redacted       |
| `statusCode` | Status at termination, or `null` when an abort occurs before headers are sent |
| `durationMs` | Monotonic elapsed time from entry to the first response terminal event        |
| `outcome`    | `finished` or `aborted`                                                       |

A response `finish` produces `finished`; an early `close` produces `aborted` unless `writableFinished` already confirms completion. Only the first terminal event is recorded. `finish` means the server finished writing to its underlying output, not proof that the client consumed the response. A status such as `200` can therefore accompany an aborted response after headers were sent; no synthetic `499` is substituted.

Response completion is independent of middleware settlement. Streaming responses can finish later, while integrated SSR can finish before downstream returns. Downstream errors propagate unchanged: the existing error handler owns diagnostics and response mapping, and the access record observes the eventual terminal status. No entry is emitted merely because middleware resolves or rejects. Terminal logging preserves the registering request's async context without creating another owned request scope.

Static exclusion uses the confirmed classification at termination. If a client disconnects during an unresolved cold-file lookup, the request is recorded as aborted/unserved traffic, even if the abandoned lookup later identifies a static file. This avoids waiting indefinitely for downstream work after a disconnect.

Request/response headers, bodies, remote addresses/ports, and error objects/stacks are omitted. URL path segments remain visible, so credentials must not be placed in them. Protected request-boundary and strict contract-generation suppression still apply. Access files support traffic analysis, but they are not a durable business/security audit ledger and do not replace business assertions or required audit records.

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

As with clients, child names can also be formalized through interface merging so logger usage stays type-safe at the project level.

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

Representative transport patterns:

```typescript
this.bean.logger.makeTransportFile(clientInfo, 'order');
this.bean.logger.makeTransportFile(clientInfo, 'order-debug', 'debug');
this.bean.logger.makeTransportConsole(clientInfo);
```

Default level behavior can also be configured through environment variables such as:

- `LOGGER_CLIENT_DEFAULT`
- `LOGGER_CLIENT_ORDER`

In both Cabloy Basic and Cabloy Start, an unset or empty client-level value defaults to `debug` when `app.meta.isTest` is true, including the Vona worker used by root `npm run test` and `npm run test:e2e`. Outside test mode, the default is `info`. An explicit value remains authoritative: `'false'` disables the client, `'true'` selects `info`, and a named level such as `'info'` or `'debug'` selects that level. Tests do not force an explicitly configured client to `debug`.

These are framework filter defaults, not a guarantee that every event reaches every transport or report. Existing transport filters, request-boundary diagnostic suppression, and the strict contract-generation lane remain in force; do not bypass them to obtain test logs. See [Repo Scripts](/reference/repo-scripts#test-isolation-and-development-data) for managed test boundaries and [Frontend test logging](/frontend/scripts#debug-logging-and-browser-failure-reports) for the integrated SSR handoff and browser collection limits.

## Debug events for test and E2E diagnostics

When developing or changing a critical business flow, use a few framework `logger.debug` events where they can distinguish meaningful stages of a test/E2E failure. Useful boundaries include action entry, a significant eligibility or authorization decision, an important asynchronous request, and a business-state transition or result. Do not mechanically instrument every function or every branch.

For example, place each event at its actual stage in the existing flow, not as consecutive statements:

```typescript
this.$logger.debug('payment.session.start received');
// After the existing ownership check succeeds:
this.$logger.debug('payment.session.start authorized');
// After the awaited start operation succeeds:
this.$logger.debug('payment.session.start completed');
```

Prefer stable event names such as `<resource>.<action> <stage>`, with fixed reasons when a skip or rejection needs explanation. Record the event at the boundary that owns the operation instead of duplicating the same failure at every layer. Do not add `catch/rethrow` wrappers solely to log every function failure, swallow errors, or alter authorization, transactions, retries, or asynchronous lifecycle ownership for diagnostics.

Keep events non-sensitive and inexpensive:

- Do not dump credentials, cookies, tokens, personal information, payment payloads, raw request/response objects, private framework state, or arbitrary error objects.
- Use only necessary, reviewed safe state; fixed event literals are preferable when the test only needs to distinguish stages.
- Do not query the database or perform external operations solely to construct a log message. For otherwise necessary expensive message construction, use the delayed-message API below.

Logs help explain where execution reached; they do not prove a durable result, replace business assertions or required audit records, or establish acceptance on their own. A missing event also does not prove that its branch never ran: check the effective level, suppression, observation window, and collection boundary first. For frontend events and an E2E allowlist example, see [Debug logging and browser failure reports](/frontend/scripts#debug-logging-and-browser-failure-reports).

## Reading and changing levels at runtime

Vona can inspect or change active logger levels while the system is running.

Representative methods include:

- `getFilterLevel()`
- `setFilterLevel(...)`

Representative patterns:

```typescript
const levelDefault = this.bean.logger.getFilterLevel();
const levelOrder = this.bean.logger.getFilterLevel('order');

this.bean.logger.setFilterLevel('debug');
this.bean.logger.setFilterLevel(false);
this.bean.logger.setFilterLevel(true);
```

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
- [Telemetry Guide](/backend/telemetry-guide) for distributed trace and span correlation in log entries; continue to use `$logger` and `$loggerChild(...)` as the logging APIs

## Implementation checks for backend logging changes

When editing backend logging behavior, ask:

1. does this belong in the default client, a dedicated client, or a child logger?
2. should the behavior be implemented through normal logger usage or an AOP-style logging decorator?
3. does the current runtime environment or flavor affect where or how logs should be written?
4. should expensive log-message construction be delayed behind a callback?

That helps AI keep logging aligned with Vona’s operational model instead of scattering raw console output through the codebase.
