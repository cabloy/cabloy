import type { ChildProcessWithoutNullStreams } from 'node:child_process';

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
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { PassThrough } from 'node:stream';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import type { WindowsNativeJob } from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';

import {
  createTestClaim,
  loadTestClaim,
  sendTestClaimEvent,
  startTestClaimBroker,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  createWindowsNativeJob,
  inspectWindowsProcess,
  inspectWindowsProcesses,
  resolveWindowsProcessAssets,
} from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';
import { isTestClaimInactive } from './testClaimProcesses.ts';
import { startWindowsOwnedProcess } from './testProcessGuardianWindows.ts';

const nativeOptions = {
  skip:
    process.platform !== 'win32'
      ? 'Requires native Windows + PowerShell 7; not executed on this platform'
      : false,
  timeout: 120_000,
};
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const nativeModule = new URL(
  '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts',
  import.meta.url,
);

function fixture() {
  const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy windows tree 空格 '));
  return { root, dispose: () => rmSync(root, { recursive: true, force: true }) };
}

async function until<T>(
  check: () => T | undefined | Promise<T | undefined>,
  timeout = 10_000,
): Promise<T> {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await check();
    if (value !== undefined) return value;
    if (Date.now() >= deadline)
      throw new Error('Windows process fixture did not reach expected state');
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

async function readPids(path: string) {
  return await until(() => {
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as number[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError)
        return undefined;
      throw error;
    }
  });
}

async function absent(pids: number[]) {
  await until(
    async () => ((await inspectWindowsProcesses(pids)).length === 0 ? true : undefined),
    20_000,
  );
}

function output() {
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  let out = '',
    err = '';
  stdout.on('data', value => {
    out += value.toString('utf8');
  });
  stderr.on('data', value => {
    err += value.toString('utf8');
  });
  return { stdout, stderr, text: () => ({ out, err }) };
}

async function launch(
  code: string,
  args: string[] = [],
  cwd = rootDir,
  options: {
    rejectJobAssignment?: boolean;
    onHelperSpawn?: (helper: ChildProcessWithoutNullStreams) => void;
  } = {},
) {
  const streams = output();
  const job = await createWindowsNativeJob(
    {
      jobId: randomUUID(),
      command: process.execPath,
      args: ['-e', code, ...args],
      cwd,
      env: { ...process.env },
      rejectJobAssignment: options.rejectJobAssignment,
    },
    { ...streams, onHelperSpawn: options.onHelperSpawn },
  );
  await job.ready;
  job.authorize();
  return { job, streams };
}

const treeCode = `
  const {spawn} = require('node:child_process');
  const fs = require('node:fs');
  const path = require('node:path');
  const directory = process.argv[1];
  const grandchild = "require('node:fs').writeFileSync(process.argv[1], JSON.stringify([process.pid])); setInterval(()=>{},1000)";
  const childCode = "const c=require('node:child_process').spawn(process.execPath,['-e'," + JSON.stringify(grandchild) + ",process.argv[1]],{detached:true,stdio:'ignore'});c.unref();require('node:fs').writeFileSync(process.argv[2],JSON.stringify([process.pid,c.pid]));setInterval(()=>{},1000)";
  const child = spawn(process.execPath, ['-e',childCode,path.join(directory,'grandchild.json'),path.join(directory,'child.json')], {detached:true,stdio:'ignore'});
  child.unref(); fs.writeFileSync(path.join(directory,'root.json'), JSON.stringify([process.pid,child.pid]));
  setInterval(()=>{},1000);
`;

async function treePids(root: string) {
  const rootPids = await readPids(join(root, 'root.json'));
  const childPids = await readPids(join(root, 'child.json'));
  const grandPids = await readPids(join(root, 'grandchild.json'));
  return [...new Set([...rootPids, ...childPids, ...grandPids])];
}

test('Windows native assets resolve from both source and packaged compiled module locations', () => {
  const source = resolveWindowsProcessAssets(nativeModule.href);
  const compiledUrl = new URL(
    '../vona/packages-vona/vona-core/dist/lib/core/testProcessWindowsNative.js',
    import.meta.url,
  );
  assert.deepEqual(resolveWindowsProcessAssets(compiledUrl.href), source);
  assert.equal(existsSync(source.source), true);
  assert.match(readFileSync(source.script, 'utf8'), /PSVersion\.Major -lt 7/);
});

test('native implementation has no post-creation Job assignment or historical PID termination fallback', () => {
  const { source } = resolveWindowsProcessAssets(nativeModule.href);
  const code = readFileSync(source, 'utf8');
  assert.match(code, /PROC_THREAD_ATTRIBUTE_JOB_LIST = 0x2000D/);
  assert.match(
    code,
    /CREATE_SUSPENDED \| CREATE_UNICODE_ENVIRONMENT \| EXTENDED_STARTUPINFO_PRESENT/,
  );
  assert.match(code, /rootExited && active == 0/);
  assert.match(code, /CreateJobObjectW\(IntPtr.Zero, null\)/);
  assert.match(code, /SetHandleInformation\(job, HANDLE_FLAG_INHERIT, 0\)/);
  assert.match(code, /CreationTime\(process\) == creation/);
  assert.match(code, /IsProcessInJob\(process, job, out inJob\)/);
  assert.doesNotMatch(
    code,
    /extern.*AssignProcessToJobObject|taskkill|BREAKAWAY_OK|DuplicateHandle/,
  );
});

test(
  'Windows process adapter fails explicitly off native Windows',
  { skip: process.platform === 'win32' },
  async () => {
    await assert.rejects(inspectWindowsProcess(process.pid), /requires native Windows/);
    await assert.rejects(
      startWindowsOwnedProcess(process.execPath, [], rootDir, process.env),
      /require native Windows/,
    );
  },
);

test(
  'native inspection uses stable exact FILETIME strings, with absent and denied distinguished',
  nativeOptions,
  async () => {
    const first = await inspectWindowsProcess(process.pid);
    const second = await inspectWindowsProcess(process.pid);
    assert.ok(first);
    assert.deepEqual(first, second);
    assert.match(first.startTime, /^\d{17,20}$/);
    assert.equal((await inspectWindowsProcesses([process.pid, process.pid])).length, 1);
    assert.equal(await inspectWindowsProcess(0xffffffff), undefined);
    // Hosted administrators may inspect System. Only access denial is an alternative to a live identity.
    let system;
    try {
      system = await inspectWindowsProcess(4);
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.match(error.message, /Win32Exception \(5\): (?:OpenProcess\(4\)|GetProcessTimes)/);
      return;
    }
    assert.ok(system, 'Windows System must not be reported absent');
    assert.equal(system.pid, 4);
    assert.equal(system.host, first.host);
    assert.equal(system.state, 'running');
    assert.match(system.startTime, /^\d{17,20}$/);
  },
);

test(
  'owned Windows processes preserve Unicode, empty args, quoting, cwd and environment with separate raw streams',
  nativeOptions,
  async () => {
    const f = fixture();
    const values = ['', '空格 value', 'literal "quotes"', 'end\\', 'a\\"b', '& | % ^ $ `'];
    const streams = output();
    let job: WindowsNativeJob | undefined;
    try {
      job = await createWindowsNativeJob(
        {
          jobId: randomUUID(),
          command: process.execPath,
          args: [
            '-e',
            'process.stdout.write(JSON.stringify({args:process.argv.slice(1),cwd:process.cwd(),env:process.env.CABLOY_TEST_UNICODE}));process.stderr.write("raw stderr 空格");',
            ...values,
          ],
          cwd: f.root,
          env: { ...process.env, CABLOY_TEST_UNICODE: '环境 value' },
        },
        streams,
      );
      await job.ready;
      job.authorize();
      await job.started;
      const result = await job.wait();
      assert.equal(result.failed, false);
      assert.equal(result.result.code, 0);
      assert.deepEqual(JSON.parse(streams.text().out), {
        args: values,
        cwd: f.root,
        env: '环境 value',
      });
      assert.equal(streams.text().err, 'raw stderr 空格');
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      f.dispose();
    }
  },
);

test(
  'private Job verifier requires exact live PID/FILETIME and rejects outsiders and another owned Job',
  nativeOptions,
  async () => {
    const f = fixture();
    const secondRoot = join(f.root, 'second');
    mkdirSync(secondRoot);
    const sentinel = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], {
      stdio: 'ignore',
    });
    const sentinelClosed = new Promise<void>(resolve => sentinel.once('close', () => resolve()));
    let job: WindowsNativeJob | undefined;
    let other: WindowsNativeJob | undefined;
    try {
      job = (await launch(treeCode, [f.root])).job;
      other = (await launch(treeCode, [secondRoot])).job;
      await Promise.all([job.started, other.started]);
      const pids = await treePids(f.root);
      const otherPids = await treePids(secondRoot);
      const identities = await inspectWindowsProcesses([...pids, ...otherPids, sentinel.pid!]);
      const find = (pid: number) => {
        const identity = identities.find(item => item.pid === pid);
        assert.ok(identity);
        return identity;
      };
      assert.deepEqual(await Promise.all(pids.map(pid => job!.contains(find(pid)))), [
        true,
        true,
        true,
      ]);
      assert.equal(
        await job.contains({ ...find(pids[0]), startTime: '133000000000000000' }),
        false,
      );
      assert.equal(await job.contains({ pid: 0xffffffff, startTime: '133000000000000000' }), false);
      assert.equal(await job.contains(find(sentinel.pid!)), false);
      assert.equal(await job.contains(find(otherPids[0])), false);
      assert.equal(await other.contains(find(otherPids[0])), true);
      assert.equal(await other.contains(find(pids[0])), false);
      await assert.rejects(
        job.contains({ pid: 0, startTime: '133000000000000000' }),
        /unavailable or invalid/,
      );
      await assert.rejects(
        job.contains({ pid: pids[0], startTime: 'not-FILETIME' }),
        /unavailable or invalid/,
      );
      job.stop();
      await assert.rejects(job.contains(find(pids[0])), /unavailable or invalid/);
      assert.equal((await job.wait()).failed, true);
      await absent(pids);
      assert.deepEqual(await inspectWindowsProcess(sentinel.pid!), find(sentinel.pid!));
    } finally {
      job?.stop();
      other?.stop();
      await Promise.all([job?.wait().catch(() => {}), other?.wait().catch(() => {})]);
      sentinel.kill();
      await sentinelClosed;
      f.dispose();
    }
  },
);

test('target cannot spoof control protocol with JSON-looking stdout', nativeOptions, async () => {
  const { job, streams } = await launch(
    'console.log(JSON.stringify({type:"drained",code:0,failed:false}));process.exit(7)',
  );
  await job.started;
  const result = await job.wait();
  assert.equal(result.result.code, 7);
  assert.equal(result.failed, false);
  assert.match(streams.text().out, /"type":"drained"/);
});

test('normal completion waits for a detached child and grandchild', nativeOptions, async () => {
  const f = fixture();
  try {
    const flag = join(f.root, 'done');
    const script =
      "const {spawn}=require('node:child_process');const grand='setTimeout(()=>require(\"node:fs\").writeFileSync(process.argv[1],\"done\"),350)';const child='const c=require(\"node:child_process\").spawn(process.execPath,[\"-e\",'+JSON.stringify(grand)+',process.argv[1]],{detached:true,stdio:\"ignore\"});c.unref()';const c=spawn(process.execPath,['-e',child,process.argv[1]],{detached:true,stdio:'ignore'});c.unref();";
    const { job } = await launch(script, [flag]);
    await job.started;
    const result = await job.wait();
    assert.equal(result.failed, false);
    assert.equal(result.result.code, 0);
    assert.equal(readFileSync(flag, 'utf8'), 'done');
  } finally {
    f.dispose();
  }
});

test(
  'stop drains live root/child/detached grandchild, is failure, and preserves unrelated sentinel',
  nativeOptions,
  async () => {
    const f = fixture();
    const sentinel = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], {
      stdio: 'ignore',
    });
    const sentinelClosed = new Promise<void>(resolve => sentinel.once('close', () => resolve()));
    let job: WindowsNativeJob | undefined;
    try {
      const launched = await launch(treeCode, [f.root]);
      job = launched.job;
      await job.started;
      const pids = await treePids(f.root);
      assert.equal(pids.length, 3);
      const sentinelIdentity = await inspectWindowsProcess(sentinel.pid!);
      job.stop();
      const result = await job.wait();
      assert.equal(result.failed, true);
      await absent(pids);
      assert.deepEqual(await inspectWindowsProcess(sentinel.pid!), sentinelIdentity);
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      sentinel.kill();
      await sentinelClosed;
      f.dispose();
    }
  },
);

test(
  'control-input disconnect kills a live detached tree and never reports success',
  nativeOptions,
  async () => {
    const f = fixture();
    let job: WindowsNativeJob | undefined;
    try {
      job = (await launch(treeCode, [f.root])).job;
      await job.started;
      const pids = await treePids(f.root);
      job.disconnect();
      assert.equal((await job.wait()).failed, true);
      await absent(pids);
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      f.dispose();
    }
  },
);

test(
  'helper hard death closes sole Job handle, kills detached tree, and produces no drainage proof',
  nativeOptions,
  async () => {
    const f = fixture();
    let helper: ChildProcessWithoutNullStreams | undefined;
    let job: WindowsNativeJob | undefined;
    try {
      job = (
        await launch(treeCode, [f.root], rootDir, {
          onHelperSpawn: value => {
            helper = value;
          },
        })
      ).job;
      await job.started;
      const pids = await treePids(f.root);
      assert.ok(helper);
      helper.kill('SIGKILL'); // live test-owned ChildProcess, not historical PID
      await assert.rejects(job.wait(), /without proving Job shutdown/);
      await absent(pids);
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      f.dispose();
    }
  },
);

test(
  'a hard-dead controller closes its control pipe and kills the owned detached tree',
  nativeOptions,
  async () => {
    const f = fixture();
    const script = join(f.root, 'controller.mjs');
    const nativeUrl = nativeModule.href;
    writeFileSync(
      script,
      `import {createWindowsNativeJob} from ${JSON.stringify(nativeUrl)};const job=await createWindowsNativeJob({jobId:${JSON.stringify(randomUUID())},command:process.execPath,args:['-e',${JSON.stringify(treeCode)},${JSON.stringify(f.root)}],cwd:${JSON.stringify(rootDir)},env:process.env});await job.ready;job.authorize();await job.started;setInterval(()=>{},1000);`,
    );
    const controller = spawn(process.execPath, [script], { stdio: 'ignore' });
    const closed = new Promise<void>(resolve => controller.once('close', () => resolve()));
    try {
      const pids = await treePids(f.root);
      controller.kill('SIGKILL');
      await closed;
      await absent(pids);
    } finally {
      if (controller.exitCode === null) controller.kill();
      await closed;
      f.dispose();
    }
  },
);

test(
  'creation-time Job assignment failure prevents every line of user code',
  nativeOptions,
  async () => {
    const f = fixture();
    let job: WindowsNativeJob | undefined;
    try {
      const marker = join(f.root, 'must-not-run');
      job = (
        await launch(
          'require("node:fs").writeFileSync(process.argv[1],"unsafe")',
          [marker],
          rootDir,
          { rejectJobAssignment: true },
        )
      ).job;
      await assert.rejects(job.started, /without proving Job shutdown/);
      await assert.rejects(job.wait(), /without proving Job shutdown/);
      assert.equal(existsSync(marker), false);
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      f.dispose();
    }
  },
);

test(
  'helper crash retains a durable registered claim even after every owned process is absent',
  nativeOptions,
  async () => {
    const f = fixture();
    const project = join(f.root, 'vona');
    mkdirSync(project);
    let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
    let helper: ChildProcessWithoutNullStreams | undefined;
    let job: WindowsNativeJob | undefined;
    try {
      const owner = await inspectWindowsProcess(process.pid);
      assert.ok(owner);
      const runId = `20261018010203-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
      const { claimPath } = await createTestClaim(project, runId, 'unit', {
        pid: owner.pid,
        startTime: owner.startTime,
        host: owner.host,
      });
      broker = await startTestClaimBroker(claimPath);
      const env = { ...process.env, ...broker.env, META_MODE: 'test', VONA_TEST_RUN_ID: runId };
      const registration = {
        id: randomUUID(),
        role: 'guardian',
        containment: 'windows-job' as const,
        jobId: randomUUID(),
      };
      await sendTestClaimEvent(env, {
        type: 'process',
        process: { ...registration, stage: 'pending' },
      });
      const streams = output();
      job = await createWindowsNativeJob(
        {
          jobId: registration.jobId,
          command: process.execPath,
          args: ['-e', treeCode, f.root],
          cwd: rootDir,
          env,
        },
        {
          ...streams,
          onHelperSpawn: value => {
            helper = value;
          },
        },
      );
      const identity = await job.ready;
      await sendTestClaimEvent(env, {
        type: 'process',
        process: {
          ...registration,
          stage: 'registered',
          pid: identity.pid,
          startTime: identity.startTime,
          host: identity.host,
        },
      });
      job.authorize();
      await job.started;
      const pids = await treePids(f.root);
      assert.ok(helper);
      helper.kill('SIGKILL');
      await assert.rejects(job.wait(), /without proving Job shutdown/);
      await absent([...pids, identity.pid]);
      const retained = await loadTestClaim(claimPath);
      assert.equal(retained.processes[0].stage, 'registered');
      assert.equal((await isTestClaimInactive(retained, true)).inactive, false);
    } finally {
      job?.stop();
      if (job) await job.wait().catch(() => {});
      await broker?.close();
      f.dispose();
    }
  },
);

test(
  'managed guardian durably records helper identity and only then drainage, including nonzero exit',
  nativeOptions,
  async () => {
    const f = fixture();
    const project = join(f.root, 'vona');
    mkdirSync(project);
    let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
    try {
      const owner = await inspectWindowsProcess(process.pid);
      assert.ok(owner);
      const runId = `20261018010203-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
      const { claimPath } = await createTestClaim(project, runId, 'unit', {
        pid: owner.pid,
        startTime: owner.startTime,
        host: owner.host,
      });
      broker = await startTestClaimBroker(claimPath);
      const env = { ...process.env, ...broker.env, META_MODE: 'test', VONA_TEST_RUN_ID: runId };
      const child = await startWindowsOwnedProcess(
        process.execPath,
        ['-e', 'process.exit(7)'],
        rootDir,
        env,
      );
      assert.equal((await child.wait()).result?.code, 7);
      const processes = (await loadTestClaim(claimPath)).processes;
      assert.equal(processes.length, 1);
      assert.equal(processes[0].stage, 'drained');
      assert.equal(processes[0].containment, 'windows-job');
      assert.equal(processes[0].pgid, undefined);
      assert.match(processes[0].startTime!, /^\d{17,20}$/);
      assert.ok(processes[0].jobId);
    } finally {
      await broker?.close();
      f.dispose();
    }
  },
);
