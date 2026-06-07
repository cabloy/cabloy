# Election Guide

## Why election matters

In a distributed backend, multiple worker processes may all be capable of running the same logic, but some responsibilities should be owned only by one worker or by a small fixed number of workers.

Vona provides election for exactly that scenario.

This matters when backend code needs to:

- start a standalone service
- own a leader-like runtime responsibility
- recover ownership automatically when a worker exits
- allow limited parallel ownership instead of full fan-out execution

## Core election model

The election model works like this:

1. workers compete to obtain ownership of a named resource
2. one worker, or a configured number of workers, acquires that ownership
3. only the worker that obtains ownership starts the protected logic
4. if an owning worker exits, other workers compete again and ownership can move automatically

That makes election a coordination primitive, not just a boolean lock.

## Create `meta.election`

Example: create `meta.election` in module `demo-student`.

```bash
npm run vona :create:bean meta election -- --module=demo-student
```

Representative definition:

```typescript
export type TypeElectionObtainResource = 'echo';

@Meta()
export class MetaElection extends BeanElectionBase<TypeElectionObtainResource> {}
```

The resource type expresses which logical resources can be competed for inside the module.

## Obtain ownership from a module monkey

Election usually participates in backend lifecycle hooks rather than ordinary request handlers.

Representative pattern:

```typescript
export class Monkey extends BeanSimple implements IMonkeyAppStarted {
  async appStarted() {
    const scope = this.app.scope(__ThisModule__);
    scope.election.obtain(
      'echo',
      () => {
        // custom logic
      },
      async () => {
        // cleanup
      },
    );
  }
}
```

A useful mental model is:

- `appStarted()` is where the backend decides to compete for ownership
- `obtain(...)` starts the owned logic only on the worker that wins
- the cleanup callback releases or cleans up local resources when ownership ends

## Tickets: allow more than one owner

Sometimes one owner is too restrictive, but full broadcast fan-out is too broad.

In that case, election supports `tickets`:

```typescript
scope.election.obtain(
  'echo',
  () => {
    // custom logic
  },
  async () => {
    // cleanup
  },
  { tickets: 2 },
);
```

A practical interpretation is:

- `tickets: 1` means one owner
- `tickets: 2` means two workers may own the same resource simultaneously

This makes election useful for limited parallel ownership patterns.

## When to use election vs queue vs broadcast

Read this guide together with:

- [Backend Startup Guide](/backend/startup-guide)
- [Queue Guide](/backend/queue-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Worker Guide](/backend/worker-guide)
- [Redlock Guide](/backend/redlock-guide)

A practical boundary is:

- use **election** when only one worker, or a fixed small number of workers, should own the responsibility
- use **queue** when work should be pushed asynchronously to background execution
- use **broadcast** when many workers should all receive the message

This distinction is important because these abstractions solve different distributed coordination problems.

## Relationship to startup lifecycle

Election often starts from backend startup hooks.

That means a common pattern is:

1. backend startup reaches `appStarted`
2. the module competes for an election resource
3. the winning worker starts the protected service or loop
4. ownership can fail over to another worker if the current owner exits

So startup answers _when lifecycle hooks fire_, while election answers _which worker should own a singleton-like responsibility_.

## Implementation checks for distributed-election changes

When editing distributed backend coordination, ask:

1. is this really a singleton-like ownership problem?
2. should one worker own the responsibility, or should there be multiple tickets?
3. does the ownership logic belong in backend startup hooks rather than a request path?
4. would queue or broadcast be the wrong abstraction for this job?

That helps AI choose election only when the underlying coordination problem truly matches it.
