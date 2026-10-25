# Schedule Guide

This guide explains how schedules work in Vona within the Cabloy monorepo.

## Why schedules matter

Vona provides schedules on top of BullMQ, treating schedule as a specialized queue-driven execution path.

This matters because recurring work is modeled with the same broader distributed-execution vocabulary rather than as an isolated timer hack.

## Create a schedule

Example: create a schedule named `log` in module `training-student`.

```bash
npm run vona :create:bean schedule log -- --module=training-student
```

## Schedule definition

Representative shape:

```typescript
@Schedule({ repeat: { every: 3000 } })
export class ScheduleLog extends BeanBase implements IScheduleExecute {
  async execute() {
    console.log(Date.now());
  }
}
```

The important point is that recurring execution is declared explicitly through schedule metadata.

## Repeat configuration

Two main repeat modes are supported:

- interval-based repetition with `every`
- cron-style repetition with `pattern`

A practical distinction is:

- use `every` when the schedule should repeat by a fixed interval
- use `pattern` when the schedule should follow a cron-style calendar expression

That gives schedules a flexible operational model without leaving the framework abstraction.

## Queue and transaction interaction

Schedule parameters can also include:

- which queue to use
- repeat options
- template options
- datasource context
- whether to enable transaction behavior

This matters because recurring jobs often have the same consistency concerns as ordinary queue jobs.

### Finished-run retention

Scheduled runs inherit the selected queue's worker policy, including the global `a-queue` defaults: remove immediately on success or final failure, but not during intermediate retries. See [Finished-job retention](/backend/queue-guide#finished-job-retention) for worker overrides and operational caveats.

Schedules call BullMQ `upsertJobScheduler` directly, bypassing the normal queue-push `options.job` merge. To override retention for a schedule, use `templateOptions`, for example to retain up to 100 successful and 100 failed runs:

```typescript
@Schedule({
  repeat: { every: 3000 },
  templateOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  },
})
export class ScheduleLog extends BeanBase implements IScheduleExecute {
  async execute() {
    console.log(Date.now());
  }
}
```

These options govern finished runs, not the recurring scheduler definition; changing them does not automatically purge old retained runs.

## Enable/disable and environment scoping

Like queues, schedules can be enabled or disabled and scoped to flavor or mode.

That is important in Cabloy because recurring behavior is often environment-sensitive.

## Load behavior and inspection

Enabled schedules are loaded through the broader runtime/onion startup flow, and changed or disabled schedule definitions should be understood through that effective runtime context rather than as isolated timer state.

The effective schedule list can be inspected, which helps operational debugging and understanding of what is actually active.

## Implementation checks for scheduled backend changes

When asked to add recurring backend behavior, ask:

1. is this better modeled as a schedule rather than an ad hoc loop?
2. should it repeat by interval or by cron pattern?
3. does it need transaction behavior?
4. should it be active in all modes and flavors or only specific ones?

That keeps recurring backend work aligned with Vona’s distributed model.
