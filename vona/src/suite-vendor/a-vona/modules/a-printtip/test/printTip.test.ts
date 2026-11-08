import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

import { StartupPrintTip } from '../src/bean/startup.printTip.ts';

describe('development startup tips', { concurrency: false }, () => {
  for (const { name, reset, dummy, expected } of [
    { name: 'skips tips during db:reset', reset: 'true', dummy: undefined, expected: 0 },
    {
      name: 'prints tips during ordinary dev startup',
      reset: undefined,
      dummy: undefined,
      expected: 1,
    },
    {
      name: 'prints tips when reset is explicitly disabled',
      reset: 'false',
      dummy: undefined,
      expected: 1,
    },
    { name: 'keeps dummy logger suppression', reset: undefined, dummy: 'true', expected: 0 },
  ]) {
    it(name, async t => {
      const startup = Object.create(StartupPrintTip.prototype) as StartupPrintTip;
      const print = t.mock.fn(async () => {});
      Object.defineProperties(startup, {
        app: { value: { meta: { env: { LOGGER_DUMMY: dummy } } } },
        scope: { value: { config: { delay: 0 } } },
        _print: { value: print },
      });
      const previousReset = process.env.VONA_DB_RESET;
      let execution: Promise<void>;
      try {
        if (reset === undefined) delete process.env.VONA_DB_RESET;
        else process.env.VONA_DB_RESET = reset;
        execution = startup.execute();
      } finally {
        // execute reads this flag synchronously; restore it before yielding to other suites.
        if (previousReset === undefined) delete process.env.VONA_DB_RESET;
        else process.env.VONA_DB_RESET = previousReset;
      }
      await execution;
      assert.equal(print.mock.callCount(), 0);
      // Let the zero-delay callback run without replacing timers shared by concurrent suites.
      await delay(0);
      assert.equal(print.mock.callCount(), expected);
    });
  }
});
