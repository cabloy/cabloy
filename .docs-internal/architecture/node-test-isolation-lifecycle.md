# Isolated Node Test Lifecycle

## Purpose

The Vona CLI can execute test files in an isolated Node process through `cli-set-api`. This note preserves the separation between determining the aggregate `node:test` result and closing the Vona application that hosted the tests.

The relevant execution path starts in [cli.bin.test.ts](../../vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.test.ts) and runs the isolated runner in [toolsIsolate/test.ts](../../vona/packages-cli/cli-set-api/toolsIsolate/test.ts).

## `test:summary` determines the test result

`node:test` emits `test:summary` only after its scheduled tests, subtests, and test hooks have reached their final aggregate result. Convert that event to a Promise and use `summary.success` as the authoritative pass/fail signal for the test suite:

```ts
function waitForTestSummary(testStream: ReturnType<typeof run>) {
  return new Promise<boolean>((resolve, reject) => {
    testStream.once('test:summary', summary => resolve(summary.success)).once('error', reject);
  });
}

if (!(await waitForTestSummary(testStream))) {
  throw new Error('node:test reported failed tests');
}
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

## Required control flow

Do not use an event listener itself as the shutdown boundary. Convert the `test:summary` event to an awaitable result, then make `testRun()` own shutdown through `try` / `finally`:

```ts
let testError: unknown;
let closeError: unknown;
try {
  const summarySuccess = await waitForTestSummary(testStream);
  if (!summarySuccess) throw new Error('node:test reported failed tests');
} catch (error) {
  testError = error;
} finally {
  closeError = await closeApplication();
}

if (testError) throw testError;
if (closeError) throw closeError;
```

The production implementation additionally logs a close failure when a test failure already exists, preserving the test failure as the primary result.

This creates the explicit lifecycle barrier that event listeners alone cannot provide:

1. **Aggregate result:** `waitForTestSummary()` reports the final `summary.success` value or runner-stream error.
2. **Early host cleanup:** the `---done---` `test:pass` event starts the one shared close operation before `node:test` emits its summary. This preserves the existing runner behavior in which Vona-owned handles must begin closing before the test stream can finish.
3. **Guaranteed host cleanup:** `testRun()` awaits that same once-only close Promise in `finally`; if `---done---` did not pass because tests failed, were cancelled, or runner startup failed, `finally` starts the close instead.
4. **Failure priority:** a test failure remains primary; a close failure is logged alongside it. If tests passed, a close failure fails the runner.
5. **Process result:** `CliBinTest._run()` awaits the child process without broad error suppression, so a failed runner produces a nonzero CLI/CI result.

The `---done---` listener is therefore an **early shutdown trigger**, not the awaited shutdown boundary. The once-only close helper ensures that it and `finally` cannot close the application twice.

## Refactor invariants

Any later change to this runner must preserve all of the following:

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
