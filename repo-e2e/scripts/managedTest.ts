import type {
  Browser,
  BrowserType,
  ConnectOptions,
  LaunchOptions,
  PlaywrightWorkerOptions,
} from '@playwright/test';

import { expect, test as baseTest } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { lstatSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { TestProcessSnapshot } from '../../scripts/testClaimProcesses.ts';
import type {
  TestClaimEvent,
  TestClaimProcess,
} from '../../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';

import {
  inspectTestProcess,
  waitForTestProcessGroupExit,
} from '../../scripts/testClaimProcesses.ts';
import {
  assertTestClaimSafePath,
  assertTestClaimWindowsJob,
  getTestClaimPaths,
  hasTestClaimTransport,
  sendTestClaimEvent,
} from '../../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import { assertTestRunOwner } from '../../vona/packages-vona/vona-core/src/lib/core/testIsolation.ts';

const projectPath = fileURLToPath(new URL('../../vona', import.meta.url));

interface ManagedBrowserType {
  launchServer: BrowserType['launchServer'];
  connect: (wsEndpoint: string, options?: ConnectOptions) => Promise<Browser>;
}
interface ManagedBrowserOptions {
  browserType: ManagedBrowserType;
  launchOptions: LaunchOptions;
  headless: boolean;
  channel: string | undefined;
  connectOptions?: PlaywrightWorkerOptions['connectOptions'];
}
interface ManagedBrowserDependencies {
  env: NodeJS.ProcessEnv;
  projectPath: string;
  sendEvent: (env: NodeJS.ProcessEnv, event: TestClaimEvent) => Promise<void>;
  inspectProcess: (pid: number) => Promise<TestProcessSnapshot>;
  waitForGroupExit: (pgid: number) => Promise<void>;
  platform?: NodeJS.Platform;
  assertWindowsJob?: (
    env: NodeJS.ProcessEnv,
    identity: { pid: number; startTime: string; host: string },
  ) => Promise<void>;
}

function assertWithin(root: string, target: string) {
  const tail = relative(root, target);
  if (
    !isAbsolute(target) ||
    resolve(target) !== target ||
    tail === '..' ||
    tail.startsWith(`..${sep}`) ||
    isAbsolute(tail)
  ) {
    throw new Error('Managed browser path is outside its run-owned area');
  }
  assertTestClaimSafePath(target);
}

/** Public ChildProcess.spawnargs preserves argument boundaries, unlike ps output. */
export function discoverBrowserProfile(spawnargs: readonly string[]): string | undefined {
  for (let index = 0; index < spawnargs.length; index++) {
    const argument = spawnargs[index];
    if (argument.startsWith('--user-data-dir=')) return argument.slice('--user-data-dir='.length);
    if (['--user-data-dir', '--profile', '-profile'].includes(argument))
      return spawnargs[index + 1];
    if (argument.startsWith('--profile=') || argument.startsWith('-profile='))
      return argument.slice(argument.indexOf('=') + 1);
  }
  // ps flattens argument boundaries and cannot prove a path containing spaces.
  // When no public argv flag is available (e.g. nonpersistent WebKit), retain
  // the inherited run-owned temporary area as the profile boundary.
  return undefined;
}

/** Exposed for focused tests with fake launchers; application specs use test below. */
export async function useManagedBrowser(
  options: ManagedBrowserOptions,
  use: (browser: Browser) => Promise<void>,
  dependencies: ManagedBrowserDependencies = {
    env: process.env,
    projectPath,
    sendEvent: sendTestClaimEvent,
    inspectProcess: inspectTestProcess,
    waitForGroupExit: waitForTestProcessGroupExit,
  },
) {
  const { env } = dependencies;
  const windows = (dependencies.platform ?? process.platform) === 'win32';
  const assertWindowsJob = dependencies.assertWindowsJob ?? assertTestClaimWindowsJob;
  const runId = env.VONA_TEST_RUN_ID;
  if (!runId || !hasTestClaimTransport(env)) {
    throw new Error('Managed browser requires an isolated test claim transport');
  }
  if (options.connectOptions)
    throw new Error('Managed E2E cannot use an external browser connection');
  const { dataRoot } = getTestClaimPaths(dependencies.projectPath, runId);
  const temporaryRoot = resolve(dataRoot, 'tmp');
  assertTestRunOwner(dataRoot, runId);
  const tempKeys = windows
    ? Object.keys(env).filter(key => ['TEMP', 'TMP', 'TMPDIR'].includes(key.toUpperCase()))
    : ['TMPDIR'];
  if (
    (windows &&
      !['TEMP', 'TMP', 'TMPDIR'].every(name => tempKeys.some(key => key.toUpperCase() === name))) ||
    tempKeys.some(key => env[key] !== temporaryRoot) ||
    !lstatSync(temporaryRoot).isDirectory()
  ) {
    throw new Error('Managed browser requires inherited run-owned temporary paths');
  }
  assertWithin(dataRoot, temporaryRoot);

  const { slowMo, ...launchOptions } = options.launchOptions;
  const requestedProfile = discoverBrowserProfile(launchOptions.args ?? []);
  if (requestedProfile !== undefined) assertWithin(temporaryRoot, requestedProfile);
  for (const area of [
    launchOptions.downloadsPath,
    launchOptions.tracesDir,
    launchOptions.artifactsDir,
  ]) {
    if (area !== undefined) assertWithin(dataRoot, area);
  }
  // Browser profile creation happens in the Playwright worker's inherited
  // TMPDIR. A custom browser environment must not redirect child temp writes.
  if (launchOptions.env) {
    const browserEnv = { ...launchOptions.env };
    if (windows) {
      for (const key of Object.keys(browserEnv)) {
        if (['TEMP', 'TMP', 'TMPDIR'].includes(key.toUpperCase())) delete browserEnv[key];
      }
      browserEnv.TEMP = temporaryRoot;
      browserEnv.TMP = temporaryRoot;
    }
    launchOptions.env = { ...browserEnv, TMPDIR: temporaryRoot };
  }
  if (windows) {
    const identity = await dependencies.inspectProcess(process.pid);
    if (identity.pid !== process.pid || !identity.startTime || identity.state.startsWith('Z')) {
      throw new Error('Managed browser worker has no live process identity');
    }
    await assertWindowsJob(env, {
      pid: identity.pid,
      startTime: identity.startTime,
      host: identity.host,
    });
  }
  const processRecord: TestClaimProcess = {
    id: randomUUID(),
    role: 'browser',
    stage: 'pending',
    profilePath: temporaryRoot,
  };
  // POSIX browsers own independent groups; Windows browsers inherit the verified
  // guardian Job. Only that guardian can acknowledge whole-Job drainage.
  if (!windows) await dependencies.sendEvent(env, { type: 'process', process: processRecord });
  const server = await options.browserType.launchServer({
    handleSIGINT: false,
    ...launchOptions,
    headless: options.headless,
    ...(options.channel === undefined ? {} : { channel: options.channel }),
  });
  let registration: TestClaimProcess | undefined;
  try {
    const child = server.process();
    if (!child.pid || child.exitCode !== null || child.signalCode !== null) {
      throw new Error('Managed browser server has no live process identity');
    }
    const identity = await dependencies.inspectProcess(child.pid);
    if (
      child.exitCode !== null ||
      child.signalCode !== null ||
      identity.pid !== child.pid ||
      !identity.startTime ||
      identity.state.startsWith('Z') ||
      (!windows && identity.pgid !== child.pid)
    ) {
      throw new Error(
        windows
          ? 'Managed browser has no live process identity'
          : 'Managed browser has no independent live process group',
      );
    }
    const profilePath = discoverBrowserProfile(child.spawnargs) ?? temporaryRoot;
    assertWithin(temporaryRoot, profilePath);
    if (windows) {
      await assertWindowsJob(env, {
        pid: identity.pid,
        startTime: identity.startTime,
        host: identity.host,
      });
    } else {
      const record: TestClaimProcess = {
        ...processRecord,
        stage: 'registered',
        pid: identity.pid,
        pgid: identity.pgid,
        startTime: identity.startTime,
        host: identity.host,
        profilePath,
      };
      await dependencies.sendEvent(env, { type: 'process', process: record });
      registration = record;
    }
    const browser = await options.browserType.connect(server.wsEndpoint(), { slowMo });
    await use(browser);
  } finally {
    // Never turn a pending launch into drainage proof, even if a local close
    // succeeds: the runner may not have acknowledged its process identity.
    await server.close();
    if (registration) {
      await dependencies.waitForGroupExit(registration.pgid!);
      await dependencies.sendEvent(env, {
        type: 'process',
        process: { ...registration, stage: 'drained' },
      });
    }
  }
}

// Unmanaged invocations keep Playwright's exact original fixtures, including
// remote connections, test options, and additional browser.newContext() calls.
export const test =
  process.env.VONA_TEST_RUN_ID === undefined
    ? baseTest
    : baseTest.extend({
        browser: [
          async (
            { playwright, browserName, launchOptions, headless, channel, connectOptions },
            use,
          ) => {
            await useManagedBrowser(
              {
                browserType: playwright[browserName],
                launchOptions,
                headless,
                channel,
                connectOptions,
              },
              use,
            );
          },
          { scope: 'worker', timeout: 0 },
        ],
      });
export { expect };
