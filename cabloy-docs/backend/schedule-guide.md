# Schedule Guide

This guide explains how schedules work in Vona within the Cabloy monorepo.

## Why schedules matter

Vona provides schedules on top of BullMQ, treating schedule as a specialized queue-driven execution path.

This matters because recurring work is modeled with the same broader distributed-execution vocabulary rather than as an isolated timer hack.

## Create a schedule

Example: create a schedule named `log` in module `demo-student`.

```bash
npm run vona :create:bean schedule log -- --module=demo-student
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

## Enable/disable and environment scoping

Like queues, schedules can be enabled or disabled and scoped to flavor or mode.

That is important in Cabloy because recurring behavior is often environment-sensitive.

## Load behavior and inspection

Enabled schedules are loaded through the broader runtime/onion startup flow, and changed or disabled schedule definitions should be understood through that effective runtime context rather than as isolated timer state.

The effective schedule list can be inspected, which helps operational debugging and understanding of what is actually active.

## Why this matters for AI workflows

When AI is asked to add recurring backend behavior, it should ask:

1. is this better modeled as a schedule rather than an ad hoc loop?
2. should it repeat by interval or by cron pattern?
3. does it need transaction behavior?
4. should it be active in all modes and flavors or only specific ones?

That keeps recurring backend work aligned with Vona’s distributed model.
