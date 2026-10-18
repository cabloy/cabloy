import type { Browser, BrowserServer, BrowserType, ConnectOptions } from '@playwright/test';
import type { ChildProcess } from 'node:child_process';

import { test as vanillaTest } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import type { TestClaimEvent } from '../../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';

import { discoverBrowserProfile, test as managedTest, useManagedBrowser } from './managedTest.ts';

const runId = '20261014010203-a1b2c3d4';

async function fixture(
  options: {
    fault?: string;
    profile?: string;
    group?: number;
    noProfile?: boolean;
    exited?: boolean;
    platform?: NodeJS.Platform;
  } = {},
) {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'cabloy-managed-browser-')));
  const projectPath = join(root, 'vona');
  const dataRoot = join(projectPath, `.app-test-${runId}`);
  const temporaryRoot = join(dataRoot, 'tmp');
  await mkdir(temporaryRoot, { recursive: true });
  await writeFile(join(dataRoot, '.vona-test-owner'), `${runId}\n`);
  const events: TestClaimEvent[] = [];
  const calls: string[] = [];
  const profile = options.profile ?? join(temporaryRoot, 'playwright_chromiumdev_profile-fake');
  const browser = { newContext: async () => ({ close: async () => {} }) } as unknown as Browser;
  let launchedOptions: Parameters<BrowserType['launchServer']>[0];
  let connectedOptions: ConnectOptions | undefined;
  const server = {
    process: () =>
      ({
        pid: 4242,
        exitCode: options.exited ? 1 : null,
        signalCode: null,
        spawnargs: options.noProfile
          ? ['webkit', '--no-startup-window']
          : ['chromium', `--user-data-dir=${profile}`],
      }) as ChildProcess,
    wsEndpoint: () => 'ws://127.0.0.1/fake-token-never-journaled',
    close: async () => {
      calls.push('close');
      if (options.fault === 'close') throw new Error('close failed');
    },
  } as unknown as BrowserServer;
  const browserType = {
    launchServer: async (launchOptions: Parameters<BrowserType['launchServer']>[0]) => {
      calls.push('launch');
      launchedOptions = launchOptions;
      if (options.fault === 'launch') throw new Error('launch failed after possible spawn');
      return server;
    },
    connect: async (_endpoint: string, connectOptions: ConnectOptions | undefined) => {
      calls.push('connect');
      connectedOptions = connectOptions;
      if (options.fault === 'connect') throw new Error('connect failed');
      return browser;
    },
  };
  const dependencies = {
    env: {
      META_MODE: 'test',
      VONA_TEST_RUN_ID: runId,
      VONA_TEST_CLAIM_URL: 'http://127.0.0.1:1234/event',
      VONA_TEST_CLAIM_TOKEN: 'a'.repeat(64),
      TMPDIR: temporaryRoot,
      ...(options.platform === 'win32' ? { TEMP: temporaryRoot, TMP: temporaryRoot } : {}),
    },
    platform: options.platform ?? 'linux',
    projectPath,
    sendEvent: async (_env: NodeJS.ProcessEnv, event: TestClaimEvent) => {
      const stage = event.type === 'process' ? event.process.stage : event.type;
      calls.push(stage);
      if (options.fault === stage) throw new Error(`${stage} acknowledgement failed`);
      events.push(structuredClone(event));
    },
    inspectProcess: async (pid: number) => {
      calls.push('inspect');
      if (options.fault === 'inspect') throw new Error('inspection failed');
      return {
        pid,
        ...(options.platform === 'win32' ? {} : { pgid: options.group ?? pid }),
        startTime: options.platform === 'win32' ? '134000000000000000' : 'Wed Oct 14 01:02:03 2026',
        host: 'test-host',
        state: 'S',
        args: '',
      };
    },
    assertWindowsJob: async (
      _env: NodeJS.ProcessEnv,
      identity: { pid: number; startTime: string; host: string },
    ) => {
      const role = identity.pid === process.pid ? 'worker' : 'browser';
      calls.push(`job-${role}`);
      assert.equal(identity.startTime, '134000000000000000');
      assert.equal(identity.host, 'test-host');
      assert.equal(Object.hasOwn(identity, 'pgid'), false);
      if (options.fault === `job-${role}`) throw new Error('designated Job membership unavailable');
    },
    waitForGroupExit: async (pgid: number) => {
      calls.push('wait');
      assert.equal(pgid, 4242);
      if (options.fault === 'wait') throw new Error('group still live or inspection failed');
    },
  };
  return {
    root,
    dataRoot,
    temporaryRoot,
    dependencies,
    events,
    calls,
    browser,
    browserOptions: { browserType, launchOptions: {}, headless: true, channel: undefined },
    launchedOptions: () => launchedOptions,
    connectedOptions: () => connectedOptions,
    dispose: () => rm(root, { recursive: true, force: true }),
  };
}

if (process.env.VONA_TEST_RUN_ID === undefined) {
  test('unmanaged application imports preserve the exact vanilla Playwright fixtures', () => {
    assert.equal(managedTest, vanillaTest);
  });
}

test('registers launch intent and complete identity before use; closes and drains before reporting', async () => {
  const f = await fixture();
  try {
    await useManagedBrowser(
      f.browserOptions,
      async browser => {
        f.calls.push('use');
        assert.equal(browser, f.browser);
        const extraContext = await browser.newContext();
        await extraContext.close();
      },
      f.dependencies,
    );
    assert.deepEqual(f.calls, [
      'pending',
      'launch',
      'inspect',
      'registered',
      'connect',
      'use',
      'close',
      'wait',
      'drained',
    ]);
    assert.equal(f.events.length, 3);
    const records = f.events.map(event => {
      assert.equal(event.type, 'process');
      return (event as Extract<TestClaimEvent, { type: 'process' }>).process;
    });
    assert.equal(records[0].profilePath, f.temporaryRoot);
    assert.equal(records[1].pid, 4242);
    assert.equal(records[1].pgid, 4242);
    assert.equal(records[1].host, 'test-host');
    assert.equal(records[1].startTime, 'Wed Oct 14 01:02:03 2026');
    assert.equal(
      records[1].profilePath,
      join(f.temporaryRoot, 'playwright_chromiumdev_profile-fake'),
    );
    assert.equal(records[0].id, records[1].id);
    assert.equal(records[1].id, records[2].id);
    assert.doesNotMatch(JSON.stringify(f.events), /private-token|fake-token|ws:\/\//);
  } finally {
    await f.dispose();
  }
});

test('preserves public launch options, explicit headless/channel overrides, and slowMo', async () => {
  const f = await fixture();
  try {
    const args = ['--disable-dev-shm-usage'];
    const launchOptions = {
      args,
      channel: 'chrome',
      headless: true,
      slowMo: 17,
      timeout: 1234,
      env: { CUSTOM_BROWSER_ENV: 'keep', TMPDIR: '/unowned' },
    };
    await useManagedBrowser(
      { ...f.browserOptions, launchOptions, headless: false, channel: 'msedge' },
      async () => {},
      f.dependencies,
    );
    assert.deepEqual(f.launchedOptions(), {
      handleSIGINT: false,
      args,
      channel: 'msedge',
      headless: false,
      timeout: 1234,
      env: { CUSTOM_BROWSER_ENV: 'keep', TMPDIR: f.temporaryRoot },
    });
    assert.deepEqual(f.connectedOptions(), { slowMo: 17 });
    assert.equal(launchOptions.env.TMPDIR, '/unowned');
  } finally {
    await f.dispose();
  }
});

for (const fault of ['pending', 'launch', 'inspect', 'registered', 'close', 'wait', 'drained']) {
  test(`retains uncertain process evidence on ${fault} failure`, async () => {
    const f = await fixture({ fault });
    try {
      await assert.rejects(useManagedBrowser(f.browserOptions, async () => {}, f.dependencies));
      assert.ok(
        !f.events.some(event => event.type === 'process' && event.process.stage === 'drained'),
      );
      if (fault === 'pending') assert.ok(!f.calls.includes('launch'));
      if (['launch', 'inspect', 'registered'].includes(fault)) {
        assert.deepEqual(
          f.events.map(event => event.type === 'process' && event.process.stage),
          ['pending'],
        );
        assert.ok(!f.calls.includes('use'));
      }
      if (['inspect', 'registered'].includes(fault)) assert.ok(f.calls.includes('close'));
      if (fault === 'close') assert.ok(!f.calls.includes('wait'));
    } finally {
      await f.dispose();
    }
  });
}

for (const failure of ['connect', 'use']) {
  test(`closes and verifies the registered group on ${failure} failure`, async () => {
    const f = await fixture({ fault: failure });
    try {
      await assert.rejects(
        useManagedBrowser(
          f.browserOptions,
          async () => {
            throw new Error('use failed');
          },
          f.dependencies,
        ),
      );
      assert.deepEqual(f.calls.slice(-3), ['close', 'wait', 'drained']);
    } finally {
      await f.dispose();
    }
  });
}

test('refuses a shared browser group before connection or drainage acknowledgement', async () => {
  const f = await fixture({ group: 1234 });
  try {
    await assert.rejects(
      useManagedBrowser(f.browserOptions, async () => {}, f.dependencies),
      /independent live process group/,
    );
    assert.deepEqual(f.calls, ['pending', 'launch', 'inspect', 'close']);
  } finally {
    await f.dispose();
  }
});

test('refuses an actual profile escaping the pending run area', async () => {
  const f = await fixture({ profile: '/tmp/unowned-browser-profile' });
  try {
    await assert.rejects(
      useManagedBrowser(f.browserOptions, async () => {}, f.dependencies),
      /outside its run-owned area/,
    );
    assert.deepEqual(f.calls, ['pending', 'launch', 'inspect', 'close']);
  } finally {
    await f.dispose();
  }
});

for (const invalid of ['tmpdir', 'owner', 'transport', 'connect', 'symlink']) {
  test(`refuses invalid ${invalid} before launching`, async () => {
    const f = await fixture();
    try {
      if (invalid === 'tmpdir') f.dependencies.env.TMPDIR = '/tmp/unowned';
      if (invalid === 'owner')
        await writeFile(join(f.dataRoot, '.vona-test-owner'), 'another-run\n');
      if (invalid === 'transport') f.dependencies.env.VONA_TEST_CLAIM_TOKEN = '';
      if (invalid === 'symlink') {
        await rm(f.temporaryRoot, { recursive: true });
        await symlink(f.root, f.temporaryRoot, process.platform === 'win32' ? 'junction' : 'dir');
      }
      const options =
        invalid === 'connect'
          ? { ...f.browserOptions, connectOptions: { wsEndpoint: 'ws://external/browser' } }
          : f.browserOptions;
      await assert.rejects(useManagedBrowser(options, async () => {}, f.dependencies));
      assert.deepEqual(f.calls, []);
    } finally {
      await f.dispose();
    }
  });
}

test('registers the run-owned profile area when a browser has no argv profile flag', async () => {
  const f = await fixture({ noProfile: true });
  try {
    await useManagedBrowser(f.browserOptions, async () => {}, f.dependencies);
    assert.ok(
      f.events.every(
        event => event.type === 'process' && event.process.profilePath === f.temporaryRoot,
      ),
    );
  } finally {
    await f.dispose();
  }
});

test('does not register an already-exited child as a potentially reused PID', async () => {
  const f = await fixture({ exited: true });
  try {
    await assert.rejects(
      useManagedBrowser(f.browserOptions, async () => {}, f.dependencies),
      /no live process identity/,
    );
    assert.deepEqual(f.calls, ['pending', 'launch', 'close']);
  } finally {
    await f.dispose();
  }
});

for (const area of ['downloadsPath', 'tracesDir', 'artifactsDir'] as const) {
  test(`allows owned ${area} and rejects external ${area} before launch`, async () => {
    const f = await fixture();
    try {
      await assert.rejects(
        useManagedBrowser(
          { ...f.browserOptions, launchOptions: { [area]: '/unowned/browser-output' } },
          async () => {},
          f.dependencies,
        ),
        /outside its run-owned area/,
      );
      assert.deepEqual(f.calls, []);
      const owned = join(f.dataRoot, area);
      await useManagedBrowser(
        { ...f.browserOptions, launchOptions: { [area]: owned } },
        async () => {},
        f.dependencies,
      );
      assert.equal(f.launchedOptions()?.[area], owned);
    } finally {
      await f.dispose();
    }
  });
}

test('rejects an explicit external profile argument before launch', async () => {
  const f = await fixture();
  try {
    await assert.rejects(
      useManagedBrowser(
        {
          ...f.browserOptions,
          launchOptions: { args: ['--user-data-dir=/unowned/profile'], ignoreDefaultArgs: true },
        },
        async () => {},
        f.dependencies,
      ),
      /outside its run-owned area/,
    );
    assert.deepEqual(f.calls, []);
  } finally {
    await f.dispose();
  }
});

test('Windows proves worker and browser Job membership without per-browser POSIX claims', async () => {
  const f = await fixture({ platform: 'win32' });
  try {
    await useManagedBrowser(
      f.browserOptions,
      async () => {
        f.calls.push('use');
      },
      f.dependencies,
    );
    assert.deepEqual(f.calls, [
      'inspect',
      'job-worker',
      'launch',
      'inspect',
      'job-browser',
      'connect',
      'use',
      'close',
    ]);
    assert.deepEqual(f.events, []);
  } finally {
    await f.dispose();
  }
});

for (const fault of ['job-worker', 'job-browser', 'launch', 'inspect', 'connect', 'close']) {
  test(`Windows fails closed on ${fault} without acknowledging browser drainage`, async () => {
    const f = await fixture({ platform: 'win32', fault });
    try {
      await assert.rejects(useManagedBrowser(f.browserOptions, async () => {}, f.dependencies));
      assert.deepEqual(f.events, []);
      assert.ok(!f.calls.includes('wait'));
      if (['job-worker', 'inspect'].includes(fault)) assert.ok(!f.calls.includes('launch'));
      if (fault === 'job-browser') {
        assert.ok(f.calls.includes('close'));
        assert.ok(!f.calls.includes('connect'));
      }
    } finally {
      await f.dispose();
    }
  });
}

for (const variable of ['TEMP', 'TMP', 'TMPDIR', 'temp']) {
  test(`Windows rejects inherited ${variable} outside its run before browser launch`, async () => {
    const f = await fixture({ platform: 'win32' });
    try {
      const env: NodeJS.ProcessEnv = { ...f.dependencies.env, [variable]: '/unowned' };
      await assert.rejects(
        useManagedBrowser(f.browserOptions, async () => {}, { ...f.dependencies, env }),
        /run-owned temporary paths/,
      );
      assert.deepEqual(f.calls, []);
    } finally {
      await f.dispose();
    }
  });
}

test('Windows normalizes custom temporary environment names without mutating caller options', async () => {
  const f = await fixture({ platform: 'win32' });
  const env = { temp: '/unowned', Tmp: '/unowned', tmpdir: '/unowned', CUSTOM: 'keep' };
  try {
    await useManagedBrowser(
      { ...f.browserOptions, launchOptions: { env } },
      async () => {},
      f.dependencies,
    );
    assert.deepEqual(f.launchedOptions()?.env, {
      TEMP: f.temporaryRoot,
      TMP: f.temporaryRoot,
      TMPDIR: f.temporaryRoot,
      CUSTOM: 'keep',
    });
    assert.equal(env.temp, '/unowned');
    assert.equal(env.Tmp, '/unowned');
    assert.equal(env.tmpdir, '/unowned');
  } finally {
    await f.dispose();
  }
});

test('Windows closes a browser with an escaping actual profile without connecting', async () => {
  const f = await fixture({ platform: 'win32', profile: '/unowned/profile' });
  try {
    await assert.rejects(
      useManagedBrowser(f.browserOptions, async () => {}, f.dependencies),
      /outside its run-owned area/,
    );
    assert.deepEqual(f.events, []);
    assert.ok(f.calls.includes('close'));
    assert.ok(!f.calls.includes('connect'));
  } finally {
    await f.dispose();
  }
});

test('discovers exact Chromium and Firefox argv profiles; uses the temporary area for WebKit', () => {
  assert.equal(
    discoverBrowserProfile(['browser', '--user-data-dir=/run/tmp/with spaces']),
    '/run/tmp/with spaces',
  );
  assert.equal(
    discoverBrowserProfile(['browser', '--user-data-dir', '/run/tmp/chromium']),
    '/run/tmp/chromium',
  );
  assert.equal(
    discoverBrowserProfile(['browser', '-profile', '/run/tmp/firefox']),
    '/run/tmp/firefox',
  );
  assert.equal(
    discoverBrowserProfile(['browser', '--profile=/run/tmp/firefox']),
    '/run/tmp/firefox',
  );
  assert.equal(
    discoverBrowserProfile(['browser', '--profile', '/run/tmp/firefox with spaces']),
    '/run/tmp/firefox with spaces',
  );
  assert.equal(discoverBrowserProfile(['browser', '--no-startup-window']), undefined);
});
