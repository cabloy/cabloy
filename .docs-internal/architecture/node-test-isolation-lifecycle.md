# Isolated Node Test Lifecycle

## Purpose

The Vona CLI can execute test files in an isolated Node process through `cli-set-api`. This note preserves the separation between determining the aggregate `node:test` result and closing the Vona application that hosted the tests.

The relevant execution path starts in [cli.bin.test.ts](../../vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.test.ts) and runs the isolated runner in [toolsIsolate/test.ts](../../vona/packages-cli/cli-set-api/toolsIsolate/test.ts).

## `test:summary` determines the test result

`node:test` emits `test:summary` only after its scheduled tests, subtests, and test hooks have reached their final aggregate result. The listener should use `summary.success` as the authoritative pass/fail signal for the test suite:

```ts
testStream.on('test:summary', summary => {
  if (summary.success) {
    resolve();
  } else {
    reject(new Error('node:test reported failed tests'));
  }
});
```

This makes a failed Node test suite reject the isolated runner, exit the child Node process nonzero, and fail the calling CLI command and CI job. Do not resolve unconditionally upon `test:summary`; that creates false-green test commands.

## `test:summary` is not an asynchronous shutdown barrier

The event means that the test result is final. It does not mean that the host application has released all of its resources, nor that the Node process has finished exiting.

In particular, it does not guarantee completion of:

- `app.close()`;
- database-pool, HTTP-server, timer, worker, or other handle cleanup owned by the Vona application;
- an asynchronous listener registered for the event;
- child-process termination with its final exit code.

Event emitters do not await an `async` listener. Therefore, this shape does not make `node:test` wait for the close operation:

```ts
testStream.on('test:summary', async summary => {
  await app.close();
  // This Promise is not a lifecycle barrier for the emitter.
});
```

Calling `resolve()` or `reject()` before that close finishes can allow the outer runner to proceed while resources remain open. Waiting inside the listener does not solve that ownership problem, because the emitter does not await the returned Promise. A close error or a hanging resource can also obscure, delay, or replace the original test failure.

## Required separation of responsibilities

Keep the two lifecycle concerns separate:

1. **Aggregate result:** use `test:summary` and `summary.success` to settle the isolated runner as passed or failed.
2. **Host cleanup:** retain the terminal test-execution path that closes the Vona application and waits for that close operation to complete.
3. **Process result:** let the outer `CliBinTest._run()` await the child process without broad error suppression, so a failed runner produces a nonzero CLI/CI result.

This structure makes both guarantees explicit: failed assertions cannot be reported as success, and the application has a dedicated shutdown path rather than relying on an asynchronous summary-event callback.

## If the lifecycle is refactored

A refactor may consolidate the wiring only if it explicitly creates an outer completion barrier that waits for both independent conditions:

```ts
await Promise.all([
  waitForTestSummaryAndSettleResult(),
  waitForTerminalTestPathToCloseApplication(),
]);
```

Any replacement must preserve all of the following:

- `app.close()` runs exactly once;
- a test failure remains the primary reported failure;
- a close failure is surfaced without masking a test failure;
- no-test, cancellation, initialization-failure, and ordinary failure paths still close the application;
- the child process cannot complete successfully while Vona-owned resources remain open.

Do not restore a blanket `catchError()` around the isolated child process as a workaround for shutdown problems. It suppresses genuine test and process failures and can make CI pass despite failed tests.

## Verification checklist

When changing this runner:

1. Run a deliberately failing isolated test and confirm the CLI returns nonzero.
2. Run a successful isolated test and confirm it exits without retained-handle hangs.
3. Confirm application cleanup occurs once for both success and failure.
4. Confirm a cleanup failure does not turn a failed test suite into a passing command.
