# Election

How can you start a standalone service in the backend using VonaJS?

Since VonaJS uses a distributed architecture, multiple Workers can be started in the backend. So, on which Worker should the standalone service be started?

VonaJS provides `Election` for this scenario, which works as follows:

1. All Workers compete to acquire ownership
2. You can specify the number of Workers that can acquire ownership simultaneously
3. The Worker that acquires ownership can start the service
4. If a Worker that owns ownership exits normally or terminates abnormally, other Workers will continue to compete for ownership

## Create meta.election

For example, create `meta.election` in the module demo-student. Start a timer in the selected Worker to output `Hello World` every 2 seconds.

### 1. Cli Command

```bash
$ vona :create:bean meta election --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Meta/Election`
:::

## meta.election Definition

```typescript
export type TypeElectionObtainResource = 'echo';

@Meta()
export class MetaElection extends BeanElectionBase<TypeElectionObtainResource> {}
```

- `TypeElectionObtainResource`: Defines the type of Election resource

## Create Module Monkey

Next, create a `Module Monkey` that responds to the `appStarted` and `appClose` hooks.

- See also: [App Startup Customization](../env-config/app-start/introduction.md)

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

- `appStarted`: Calls `election.obtain` to acquire ownership of the specified resource. A callback function is invoked upon acquisition of ownership

## Tickets

When calling `election.obtain`, you can specify that multiple Workers are allowed to acquire ownership:

```diff
async appStarted() {
  const scope = this.app.scope(__ThisModule__);
  scope.election.obtain('echo', () => {
    // custom logic
  }, async () => {
    // cleanup
+ }, { tickets: 2 });
}
```

| Name    | Description                                                                |
| ------- | -------------------------------------------------------------------------- |
| tickets | Allows a specified number of Workers to acquire ownership. Defaults to `1` |
