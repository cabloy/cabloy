import type { ChildProcess } from 'node:child_process';

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { loadTestClaim } from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  inspectWindowsProcess,
  inspectWindowsProcesses,
} from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';
import { isTestClaimInactive } from './testClaimProcesses.ts';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const nativeOptions = {
  skip:
    process.platform !== 'win32'
      ? 'Requires native Windows, PowerShell 7 and installed Playwright Chromium'
      : false,
  timeout: 180_000,
};
const moduleUrl = (name: string) => new URL(name, import.meta.url).href;
const claimUrl = moduleUrl('../vona/packages-vona/vona-core/src/lib/core/testClaim.ts');
const nativeUrl = moduleUrl(
  '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts',
);
const guardianUrl = moduleUrl('./testProcessGuardianWindows.ts');
const managedUrl = moduleUrl('../repo-e2e/scripts/managedTest.ts');

async function until<T>(
  check: () => T | undefined | Promise<T | undefined>,
  timeout = 60_000,
): Promise<T> {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await check();
    if (value !== undefined) return value;
    if (Date.now() >= deadline) throw new Error('Windows Chromium containment fixture timed out');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
function json<T>(file: string): T | undefined {
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError)
      return undefined;
    throw error;
  }
}
async function exited(
  identities: { pid: number; startTime: string }[],
  inspect = inspectWindowsProcesses,
) {
  return await until(async () => {
    const snapshots = await inspect(identities.map(item => item.pid));
    return identities.every(
      identity =>
        !snapshots.some(item => item.pid === identity.pid && item.startTime === identity.startTime),
    )
      ? snapshots
      : undefined;
  }, 30_000);
}
test('exit observation accepts PID reuse but returns the occupied snapshot for cleanup checks', async () => {
  const identities = [{ pid: 100, startTime: '134000000000000000' }];
  const snapshots = [
    {
      pid: 100,
      startTime: '134000000000000001',
      host: 'test-host',
      state: 'running' as const,
      args: '',
    },
  ];
  let inspections = 0;
  const observed = await exited(identities, async pids => {
    assert.deepEqual(pids, [100]);
    inspections++;
    return inspections === 1 ? [{ ...snapshots[0], ...identities[0] }] : snapshots;
  });
  assert.equal(observed, snapshots);
  assert.equal(inspections, 2);
});

function closePromise(child: ChildProcess) {
  return new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal }));
  });
}

for (const mode of ['normal', 'cancel', 'controller-death', 'helper-death'] as const) {
  test(
    `real Playwright worker/Chromium inherited private Job: ${mode}`,
    nativeOptions,
    async () => {
      // Deliberately resolve the public package/CLI. Missing browser binaries are a Windows gate failure, not a skip.
      const playwrightUrl = pathToFileURL(require.resolve('@playwright/test')).href;
      const playwrightCli = require.resolve('@playwright/test/cli');
      const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy chromium job 空格 '));
      const project = join(root, 'vona');
      mkdirSync(project);
      const runId = `20261018010203-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
      const dataRoot = join(project, `.app-test-${runId}`);
      const temporaryRoot = join(dataRoot, 'tmp');
      mkdirSync(temporaryRoot, { recursive: true });
      writeFileSync(join(dataRoot, '.vona-test-owner'), `${runId}\n`);
      const configPath = join(root, 'playwright.config.mjs');
      const specPath = join(root, 'contained.spec.mjs');
      const controllerPath = join(root, 'controller.mjs');
      const browserPath = join(root, 'browser.json');
      const releasePath = join(root, 'release');
      const pageReadyPath = join(root, 'page-ready');
      const resultPath = join(root, 'result.json');
      const claimPath = join(project, '.vona-test-claim', `${runId}.json`);
      writeFileSync(
        configPath,
        `export default {testDir:${JSON.stringify(root)},testMatch:'contained.spec.mjs',workers:1,retries:0,timeout:120000,reporter:'line',outputDir:${JSON.stringify(join(dataRoot, 'test-results'))}};`,
      );
      writeFileSync(
        specPath,
        `
      import playwrightTest from ${JSON.stringify(playwrightUrl)};
      import {existsSync, writeFileSync} from 'node:fs';
      import {useManagedBrowser} from ${JSON.stringify(managedUrl)};
      import {assertTestClaimWindowsJob, sendTestClaimEvent} from ${JSON.stringify(claimUrl)};
      import {inspectTestProcess, waitForTestProcessGroupExit} from ${JSON.stringify(moduleUrl('./testClaimProcesses.ts'))};
      const {test:base,expect}=playwrightTest;
      const test=base.extend({browser:[async({playwright},use)=>{
        let child;
        const chromium={launchServer:async options=>{const server=await playwright.chromium.launchServer(options);child=server.process();return server;},
          connect:(...args)=>playwright.chromium.connect(...args)};
        await useManagedBrowser({browserType:chromium,launchOptions:{},headless:true,channel:undefined},async browser=>{
          const worker=await inspectTestProcess(process.pid), browserIdentity=await inspectTestProcess(child.pid);
          await assertTestClaimWindowsJob(process.env,worker);
          await assertTestClaimWindowsJob(process.env,browserIdentity);
          const session=await browser.newBrowserCDPSession();
          const rows=await session.send('SystemInfo.getProcessInfo');
          const identities=[];
          for(const row of rows.processInfo){
            const identity=await inspectTestProcess(row.id);
            await assertTestClaimWindowsJob(process.env,identity);
            identities.push(identity);
          }
          await session.detach();
          writeFileSync(${JSON.stringify(browserPath)},JSON.stringify({worker,browser:browserIdentity,processes:identities,locator:process.env.VONA_TEST_WINDOWS_GUARDIAN_ID}));
          await use(browser);
        },{env:process.env,projectPath:${JSON.stringify(project)},sendEvent:sendTestClaimEvent,inspectProcess:inspectTestProcess,waitForGroupExit:waitForTestProcessGroupExit});
      },{scope:'worker',timeout:0}]});
      test('actual Chromium worker membership',async({page})=>{
        await page.setContent('<title>contained Chromium</title><h1>private Job</h1>');
        await expect(page).toHaveTitle('contained Chromium');
        writeFileSync(${JSON.stringify(pageReadyPath)},'ready');
        while(!existsSync(${JSON.stringify(releasePath)})) await new Promise(resolve=>setTimeout(resolve,50));
      });
    `,
      );
      writeFileSync(
        controllerPath,
        `
      import {writeFileSync} from 'node:fs';
      import {PassThrough} from 'node:stream';
      import {createTestClaim,startTestClaimBroker} from ${JSON.stringify(claimUrl)};
      import {inspectWindowsProcess} from ${JSON.stringify(nativeUrl)};
      import {startWindowsOwnedProcess} from ${JSON.stringify(guardianUrl)};
      let guardian,helper,broker;let stopping=false;let diagnostics='';
      process.on('message',message=>{
        if(message==='stop'){stopping=true;if(guardian)void guardian.stop().catch(()=>{});}
        if(message==='kill-helper'){if(!helper)throw Error('No live helper');helper.kill('SIGKILL');}
      });
      const stdout=new PassThrough(),stderr=new PassThrough();
      stdout.on('data',value=>{diagnostics=(diagnostics+value).slice(-32768)});
      stderr.on('data',value=>{diagnostics=(diagnostics+value).slice(-32768)});
      try {
        const owner=await inspectWindowsProcess(process.pid);
        await createTestClaim(${JSON.stringify(project)},${JSON.stringify(runId)},'e2e',{pid:owner.pid,startTime:owner.startTime,host:owner.host});
        broker=await startTestClaimBroker(${JSON.stringify(claimPath)});
        const env={...process.env,...broker.env,META_MODE:'test',VONA_TEST_RUN_ID:${JSON.stringify(runId)}};
        for(const key of Object.keys(env))if(['TEMP','TMP','TMPDIR','VONA_TEST_WINDOWS_GUARDIAN_ID'].includes(key.toUpperCase()))delete env[key];
        Object.assign(env,{TEMP:${JSON.stringify(temporaryRoot)},TMP:${JSON.stringify(temporaryRoot)},TMPDIR:${JSON.stringify(temporaryRoot)},vona_test_windows_guardian_id:'inherited-spoof'});
        guardian=await startWindowsOwnedProcess(process.execPath,[${JSON.stringify(playwrightCli)},'test','--config',${JSON.stringify(configPath)}],${JSON.stringify(rootDir)},env,{stdout,stderr,onHelperSpawn:value=>{helper=value}});
        if(stopping)void guardian.stop().catch(()=>{});
        const result=await guardian.wait();
        writeFileSync(${JSON.stringify(resultPath)},JSON.stringify({result,diagnostics}));
      } catch(error) {
        writeFileSync(${JSON.stringify(resultPath)},JSON.stringify({error:String(error),diagnostics}));
      } finally {await broker?.close();process.disconnect();}
    `,
      );
      const sentinel = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], {
        stdio: 'ignore',
      });
      const sentinelClosed = closePromise(sentinel);
      const controller = spawn(process.execPath, [controllerPath], {
        cwd: rootDir,
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      });
      const controllerClosed = closePromise(controller);
      let diagnostics = '';
      controller.stdout!.on('data', value => {
        diagnostics += value.toString();
      });
      controller.stderr!.on('data', value => {
        diagnostics += value.toString();
      });
      try {
        const sentinelIdentity = await inspectWindowsProcess(sentinel.pid!);
        assert.ok(sentinelIdentity);
        const record = await until(() => {
          const value = json<{
            worker: { pid: number; startTime: string };
            browser: { pid: number; startTime: string };
            processes: { pid: number; startTime: string }[];
            locator: string;
          }>(browserPath);
          if (value && existsSync(pageReadyPath)) return value;
          const result = json<{ error?: string; diagnostics: string }>(resultPath);
          if (result || controller.exitCode !== null) {
            throw new Error(
              `Chromium did not reach membership gate: ${JSON.stringify(result)} ${diagnostics}`,
            );
          }
          return undefined;
        }, 90_000);
        const manifest = await loadTestClaim(claimPath);
        assert.equal(manifest.kind, 'e2e');
        assert.equal(manifest.version, 1);
        assert.equal(manifest.processes.length, 1);
        const registered = manifest.processes[0];
        assert.equal(registered.stage, 'registered');
        assert.equal(registered.containment, 'windows-job');
        assert.equal(record.locator, registered.id);
        assert.notEqual(record.locator, 'inherited-spoof');
        assert.notEqual(record.worker.pid, record.browser.pid);
        assert.ok(record.processes.some(item => item.pid === record.browser.pid));
        const ownedIdentities = [record.worker, record.browser, ...record.processes];
        if (mode === 'normal') writeFileSync(releasePath, 'close');
        else if (mode === 'cancel') controller.send('stop');
        else if (mode === 'controller-death') controller.kill('SIGKILL');
        else controller.send('kill-helper');
        await Promise.race([
          controllerClosed,
          new Promise<never>((_, reject) => {
            const timer = setTimeout(
              () => reject(new Error(`Controller shutdown timed out: ${diagnostics}`)),
              40_000,
            );
            timer.unref();
            void controllerClosed.finally(() => clearTimeout(timer)).catch(() => {});
          }),
        ]);
        // Compare exact identities: a later native inspector can reuse an exited PID itself.
        const snapshots = await exited([
          ...ownedIdentities,
          { pid: registered.pid!, startTime: registered.startTime! },
          manifest.owner,
        ]);
        assert.deepEqual(await inspectWindowsProcess(sentinel.pid!), sentinelIdentity);
        const retained = await loadTestClaim(claimPath);
        assert.equal(retained.processes.length, 1); // No per-browser intents/registration/drainage on Windows.
        if (mode === 'normal' || mode === 'cancel') {
          const completed = json<{
            result?: { failed: boolean; result: { code: number } };
            error?: string;
            diagnostics: string;
          }>(resultPath);
          assert.ok(completed?.result, JSON.stringify(completed));
          assert.equal(completed.result.failed, mode !== 'normal', completed.diagnostics);
          if (mode === 'normal')
            assert.equal(completed.result.result.code, 0, completed.diagnostics);
          assert.equal(retained.processes[0].stage, 'drained');
          // Cleanup deliberately blocks reused PIDs too. Evaluate the same native snapshot
          // used above, not a second inspector that can change PID occupancy between checks.
          const inactivity = await isTestClaimInactive(retained, false, async () => snapshots);
          const occupied = snapshots.some(item =>
            [retained.owner.pid, retained.processes[0].pid].includes(item.pid),
          );
          assert.deepEqual(
            inactivity,
            occupied
              ? {
                  inactive: false,
                  reason: snapshots.some(item => item.pid === retained.owner.pid)
                    ? 'claim owner PID is still present'
                    : 'registered Windows job owner is still present',
                }
              : { inactive: true },
            JSON.stringify({ snapshots, owner: retained.owner, guardian: retained.processes[0] }),
          );
        } else {
          assert.equal(retained.processes[0].stage, 'registered');
          assert.equal((await isTestClaimInactive(retained)).inactive, false);
          if (mode === 'helper-death') {
            assert.match(
              json<{ error: string }>(resultPath)!.error,
              /without proving Job shutdown/,
            );
          }
        }
      } finally {
        if (controller.exitCode === null && controller.signalCode === null)
          controller.kill('SIGKILL');
        await controllerClosed.catch(() => {});
        sentinel.kill();
        await sentinelClosed;
        // Retention assertions precede removal of this test's own temporary fixture.
        if (existsSync(root)) rmSync(root, { recursive: true, force: true });
      }
    },
  );
}
