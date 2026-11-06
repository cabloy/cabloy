import assert from 'node:assert/strict';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import type { GuardianResult, OwnedProcess } from './runIsolatedTest.ts';

import { inspectWindowsProcesses } from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';
import {
  OwnedBuildChildren,
  generatedBuildEnv,
  outputPlanEnv,
  readOutputPlan,
  runPairedBuild,
  withBuildLock,
} from './buildZovaIsolated.ts';

const nativeOptions = {
  skip:
    process.platform !== 'win32'
      ? 'Requires native Windows + PowerShell 7; not executed on this platform'
      : false,
  timeout: 120_000,
};
const success: GuardianResult = {
  type: 'drained',
  failed: false,
  result: { code: 0, signal: null },
};

function fixture() {
  return realpathSync(mkdtempSync(path.join(tmpdir(), 'cabloy build Windows 空格 ')));
}

function write(file: string, content: string) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function childEnv(): NodeJS.ProcessEnv {
  // Keep OS prerequisites (SystemRoot, TEMP, PATH), not an enclosing isolated
  // test's claim transport or configuration. These children own no backend run.
  return Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !/^(?:NODE_OPTIONS$|NODE_PATH$|VONA_TEST_|TEST_CLAIM_)/i.test(key),
    ),
  );
}

async function until<T>(check: () => T | undefined | Promise<T | undefined>): Promise<T> {
  const deadline = Date.now() + 20_000;
  for (;;) {
    const value = await check();
    if (value !== undefined) return value;
    if (Date.now() >= deadline)
      throw new Error('Build process fixture did not reach expected state');
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

test(
  'build cancellation during Windows ownership acquisition awaits verified stop before cleaning',
  { timeout: 10_000 },
  async () => {
    const dir = fixture();
    const acquiring = Promise.withResolvers<void>();
    const acquired = Promise.withResolvers<OwnedProcess>();
    const stopStarted = Promise.withResolvers<void>();
    const drained = Promise.withResolvers<GuardianResult>();
    let stops = 0;
    let ownedRun = '';
    let published = false;
    const children = new OwnedBuildChildren(async (command, args, cwd) => {
      assert.equal(command, process.execPath);
      assert.deepEqual(args, ['synthetic-entry.ts']);
      assert.equal(cwd, ownedRun);
      acquiring.resolve();
      return await acquired.promise;
    });
    try {
      const running = withBuildLock(dir, async runDir => {
        ownedRun = runDir;
        await children.run(['synthetic-entry.ts'], runDir, childEnv());
        published = true;
      });
      const rejected = assert.rejects(running, (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal((error as { signal?: string }).signal, 'SIGINT');
        assert.notEqual((error as { retainRun?: boolean }).retainRun, true);
        return true;
      });
      await acquiring.promise;
      children.onSignal('SIGINT');
      children.onSignal('SIGTERM');
      assert.equal(existsSync(ownedRun), true);
      acquired.resolve({
        wait: () => drained.promise,
        stop: () => {
          stops++;
          stopStarted.resolve();
          return drained.promise;
        },
      });
      await stopStarted.promise;
      assert.equal(
        existsSync(ownedRun),
        true,
        'pending stop is not evidence authorizing scratch removal',
      );
      assert.equal(existsSync(path.join(dir, 'run/zova-build.lock')), true);
      assert.equal(published, false);
      drained.resolve({ ...success, failed: true });
      await rejected;
      assert.equal(stops, 1);
      assert.equal(published, false);
      assert.equal(existsSync(ownedRun), false);
      assert.equal(existsSync(path.join(dir, 'run/zova-build.lock')), false);
    } finally {
      drained.resolve({ ...success, failed: true });
      rmSync(dir, { recursive: true, force: true });
    }
  },
);

test('a Windows root exit zero cannot publish a failed or missing drainage result', async () => {
  const dir = fixture();
  try {
    for (const result of [
      { ...success, failed: true },
      { type: 'drained', failed: false } as GuardianResult,
    ]) {
      let ownedRun = '';
      const events: string[] = [];
      const children = new OwnedBuildChildren(async () => ({
        wait: async () => result,
        stop: async () => result,
      }));
      await assert.rejects(
        withBuildLock(dir, async runDir => {
          ownedRun = runDir;
          await runPairedBuild({
            flavor: 'cabloyBasicWeb',
            runSSR: async () => {
              events.push('ssr');
              await children.run(['synthetic-entry.ts'], runDir, childEnv());
            },
            runREST: async () => {
              events.push('rest');
            },
            publish: async () => {
              events.push('publish');
            },
          });
        }),
      );
      assert.deepEqual(events, ['ssr']);
      assert.equal(existsSync(ownedRun), false, 'verified failure can clean its private run');
      assert.equal(existsSync(path.join(dir, 'run/zova-build.lock')), false);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('unproven Windows acquisition or drainage retains the build run and lock', async () => {
  const dir = fixture();
  try {
    for (const stage of ['acquisition', 'drainage']) {
      const checkout = path.join(dir, stage);
      let ownedRun = '';
      let published = false;
      const children = new OwnedBuildChildren(async () => {
        if (stage === 'acquisition') throw new Error('synthetic acquisition proof unavailable');
        return {
          wait: async () => {
            throw new Error('synthetic drainage proof unavailable');
          },
          stop: async () => {
            throw new Error('synthetic stop proof unavailable');
          },
        };
      });
      await assert.rejects(
        withBuildLock(checkout, async runDir => {
          ownedRun = runDir;
          await children.run(['synthetic-entry.ts'], runDir, childEnv());
          published = true;
        }),
        (error: unknown) => {
          assert.ok(error instanceof Error);
          assert.equal((error as { retainRun?: boolean }).retainRun, true);
          return true;
        },
      );
      assert.equal(published, false);
      assert.equal(existsSync(path.join(ownedRun, 'owner.json')), true);
      assert.equal(existsSync(path.join(checkout, 'run/zova-build.lock/owner.json')), true);
      await assert.rejects(
        withBuildLock(checkout, async () => assert.fail('retained lock must exclude a new build')),
      );
    }
  } finally {
    // All processes above are synthetic; deleting these fixtures is not a real
    // takeover of a retained run whose child shutdown remains unknown.
    rmSync(dir, { recursive: true, force: true });
  }
});

test(
  'native Windows guardian runs the output-plan helper under paths with spaces and propagates failure',
  nativeOptions,
  async () => {
    const dir = fixture();
    const helper = path.join(dir, 'build plan helper.ts');
    copyFileSync(fileURLToPath(new URL('./buildZovaOutputPlan.ts', import.meta.url)), helper);
    const plan = {
      appVersion: '9.8.7',
      buildOutDir: 'dist/custom web',
      buildCopyDist: '',
      buildCopyRelease: '',
      buildRestCopyDist: '',
    };
    try {
      for (const fails of [false, true]) {
        const checkout = path.join(dir, fails ? 'failure checkout' : 'success checkout');
        const previous = path.join(checkout, 'published/sentinel');
        write(previous, 'previous paired output');
        let ownedRun = '';
        const children = new OwnedBuildChildren(); // Actual Windows guardian, no injected starter.
        const running = withBuildLock(checkout, async (runDir, roots) => {
          ownedRun = runDir;
          const appDir = path.join(checkout, 'zova');
          const loader = path.join(appDir, 'packages-utils/zova-vite/src/configUtils.ts');
          write(
            loader,
            fails
              ? 'throw new Error("synthetic output-plan loading failure");\n'
              : `export function createConfigUtils(meta, options) {
  if (meta.flavor !== 'cabloyBasicWeb' || options.appDir !== ${JSON.stringify(appDir)} || options.runtimeDir !== ${JSON.stringify(path.basename(roots.runtime))}) throw new Error('wrong application/runtime configuration');
  return { loadEnvs() {
    Object.assign(process.env, ${JSON.stringify({
      APP_VERSION: plan.appVersion,
      BUILD_OUTDIR: plan.buildOutDir,
      BUILD_COPY_DIST: plan.buildCopyDist,
      BUILD_COPY_RELEASE: plan.buildCopyRelease,
      BUILD_REST_COPY_DIST: plan.buildRestCopyDist,
      SYNTHETIC_PRIVATE_VALUE: 'must never be serialized',
    })});
    console.log('{"appVersion":"stdout is not a control message"}');
  }};
}\n`,
          );
          const resultFile = path.join(runDir, 'output plan.json');
          await children.run(
            [helper, appDir, 'cabloyBasicWeb', resultFile],
            appDir,
            outputPlanEnv(generatedBuildEnv(childEnv(), roots), 'cabloyBasicWeb'),
          );
          assert.deepEqual(await readOutputPlan(resultFile), plan);
          assert.equal(
            readFileSync(resultFile, 'utf8').includes('must never be serialized'),
            false,
          );
          writeFileSync(previous, 'new paired output');
        });
        if (fails) {
          await assert.rejects(running, (error: unknown) => {
            assert.ok(error instanceof Error);
            assert.notEqual((error as { retainRun?: boolean }).retainRun, true);
            assert.notEqual((error as { exitCode?: number }).exitCode, 0);
            return true;
          });
        } else {
          await running;
        }
        assert.equal(
          readFileSync(previous, 'utf8'),
          fails ? 'previous paired output' : 'new paired output',
        );
        assert.equal(existsSync(ownedRun), false);
        assert.equal(existsSync(path.join(checkout, 'run/zova-build.lock')), false);
      }
    } finally {
      if (
        !['failure checkout', 'success checkout'].some(checkout =>
          existsSync(path.join(dir, checkout, 'run/zova-build.lock')),
        )
      ) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  },
);

test(
  'native Windows build cancellation drains its detached descendant before scratch cleanup',
  nativeOptions,
  async () => {
    const dir = fixture();
    const children = new OwnedBuildChildren();
    let ownedRun = '';
    let running: Promise<void> | undefined;
    let rejected: Promise<void> | undefined;
    let published = false;
    try {
      const entry = path.join(dir, 'cancel build child.cjs');
      write(
        entry,
        `const {spawn} = require('node:child_process');
const fs = require('node:fs');
const descendant = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], {detached:true,stdio:'ignore'});
descendant.unref();
fs.writeFileSync(process.argv[2], JSON.stringify([process.pid, descendant.pid]));
setInterval(()=>{},1000);
`,
      );
      running = withBuildLock(dir, async runDir => {
        ownedRun = runDir;
        await children.run([entry, path.join(runDir, 'tree pids.json')], dir, childEnv());
        published = true;
      });
      rejected = assert.rejects(running, (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal((error as { signal?: string }).signal, 'SIGTERM');
        assert.notEqual((error as { retainRun?: boolean }).retainRun, true);
        return true;
      });
      // Startup failure may precede the readiness marker; keep its assertion
      // handled while polling, then await it at the cancellation boundary.
      void rejected.catch(() => {});
      const pids = await until(() => {
        if (!ownedRun) return undefined;
        try {
          return JSON.parse(
            readFileSync(path.join(ownedRun, 'tree pids.json'), 'utf8'),
          ) as number[];
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError)
            return undefined;
          throw error;
        }
      });
      assert.equal(pids.length, 2);
      assert.equal((await inspectWindowsProcesses(pids)).length, 2);
      children.onSignal('SIGTERM');
      await rejected;
      assert.equal((await inspectWindowsProcesses(pids)).length, 0);
      assert.equal(published, false);
      assert.equal(existsSync(ownedRun), false);
      assert.equal(existsSync(path.join(dir, 'run/zova-build.lock')), false);
    } finally {
      children.onSignal('SIGTERM');
      if (running) await running.catch(() => {});
      if (!existsSync(path.join(dir, 'run/zova-build.lock'))) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  },
);
