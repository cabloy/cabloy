import type { ChildProcess } from 'node:child_process';

import { spawn } from 'node:child_process';
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createTestClaim,
  hasTestClaimTransport,
  sendTestClaimEvent,
  startTestClaimBroker,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  cleanTestClaim,
  parseTestClaimTtlSeconds,
  reapExpiredTestClaims,
} from './testClaimCleanup.ts';
import { inspectTestProcess, isTestClaimInactive } from './testClaimProcesses.ts';

export const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OWNER_FILE = '.vona-test-owner';
const GUARDIAN_FILE = resolve(ROOT_DIR, 'scripts/testProcessGuardian.ts');

export function createOwned(root: string, runId: string) {
  try {
    mkdirSync(root);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new Error(`Isolated test path already exists: ${root}`, { cause: error });
    }
    throw error;
  }
  writeFileSync(resolve(root, OWNER_FILE), `${runId}\n`, { flag: 'wx' });
}

export function createTestRunId(date = new Date()) {
  const timestamp = date.toISOString().slice(0, 19).replace(/[-:T]/g, '');
  return `${timestamp}-${randomBytes(4).toString('hex')}`;
}

export async function reserveTestRun(
  vonaDir: string,
  runId: string,
  kind: 'unit' | 'cov' | 'e2e' = 'unit',
) {
  const identity = await inspectTestProcess(process.pid);
  const { claimPath } = await createTestClaim(vonaDir, runId, kind, {
    pid: identity.pid,
    startTime: identity.startTime,
    host: identity.host,
  });
  return claimPath;
}

export async function allocateTestPort(): Promise<number> {
  const server = createServer();
  return await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Could not allocate an isolated listener'));
        return;
      }
      server.close(error => (error ? reject(error) : resolvePromise(address.port)));
    });
  });
}

function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value));
}

interface GuardianResult {
  type: 'drained';
  result?: { code: number | null; signal: NodeJS.Signals | null };
  failed: boolean;
}

interface OwnedProcess {
  wait: () => Promise<GuardianResult>;
  stop: () => Promise<GuardianResult>;
}

async function startOwnedProcess(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<OwnedProcess> {
  if (process.platform === 'win32') {
    throw new Error('Isolated test process-tree cleanup requires POSIX process groups');
  }
  const processId = randomUUID();
  const managed = hasTestClaimTransport(env);
  const registration = { id: processId, role: 'guardian', stage: 'pending' as const };
  await sendTestClaimEvent(env, { type: 'process', process: registration });
  const guardian: ChildProcess = spawn(process.execPath, [GUARDIAN_FILE], {
    cwd: ROOT_DIR,
    env,
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    detached: true,
  });
  let drained: GuardianResult | undefined;
  let startResolve: (() => void) | undefined;
  let startReject: ((error: Error) => void) | undefined;
  const started = new Promise<void>((resolvePromise, reject) => {
    startResolve = resolvePromise;
    startReject = reject;
  });
  let stopping = false;
  const onInterrupt = () => {
    stopping = true;
    if (guardian.connected) guardian.send({ type: 'stop' });
    startReject?.(new Error('Isolated test guardian startup interrupted'));
  };
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onInterrupt);
  const startupTimeout = setTimeout(() => {
    stopping = true;
    if (guardian.connected) guardian.send({ type: 'stop' });
    startReject?.(new Error('Isolated test guardian did not start its child in time'));
  }, 30_000);
  let closeObserved = false;
  let startRequested = false;
  const closed = new Promise<GuardianResult>((resolvePromise, reject) => {
    guardian.on('message', message => {
      if (!message || typeof message !== 'object' || !('type' in message)) return;
      if (message.type === 'ready' && !startRequested && !stopping) {
        startRequested = true;
        void (async () => {
          let identity;
          if (managed) {
            identity = await inspectTestProcess(guardian.pid!);
            if (identity.pgid !== guardian.pid) throw new Error('Guardian is not its group leader');
            await sendTestClaimEvent(env, {
              type: 'process',
              process: {
                ...registration,
                stage: 'registered',
                pid: identity.pid,
                pgid: identity.pgid,
                startTime: identity.startTime,
                host: identity.host,
              },
            });
          }
          if (stopping || !guardian.connected) throw new Error('Guardian startup interrupted');
          guardian.send(
            {
              type: 'start',
              command,
              args,
              cwd,
              env,
              processId: managed ? processId : undefined,
              identity,
            },
            error => {
              if (error) startReject?.(error);
            },
          );
        })().catch(error => startReject?.(toError(error)));
      }
      if (message.type === 'started') startResolve?.();
      if (message.type === 'drained') {
        drained = message as GuardianResult;
      }
    });
    guardian.once('error', error => {
      startReject?.(error);
      reject(error);
    });
    guardian.once('close', (code, signal) => {
      closeObserved = true;
      if (drained && code === 0 && !signal) {
        resolvePromise(drained);
      } else {
        const error = new Error(
          'Isolated test guardian exited without proving process-tree shutdown',
        );
        startReject?.(error);
        reject(error);
      }
    });
  });
  try {
    await started;
    if (stopping) throw new Error('Isolated test guardian startup interrupted');
  } catch (error) {
    stopping = true;
    if (guardian.connected) guardian.send({ type: 'stop' });
    // IPC loss is not evidence that descendants exited; never signal a former PID.
    try {
      await Promise.race([
        closed,
        new Promise<never>((_, reject) => {
          setTimeout(
            () =>
              reject(
                new Error('Isolated test guardian did not prove shutdown after startup failure'),
              ),
            25_000,
          );
        }),
      ]);
    } catch (shutdownError) {
      throw new AggregateError([error, shutdownError], 'Isolated test startup and shutdown failed');
    }
    throw error;
  } finally {
    clearTimeout(startupTimeout);
    process.off('SIGINT', onInterrupt);
    process.off('SIGTERM', onInterrupt);
  }
  const wait = () => closed;
  const stop = async () => {
    stopping = true;
    if (guardian.connected && !closeObserved) guardian.send({ type: 'stop' });
    return await Promise.race([
      closed,
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Isolated test guardian did not prove shutdown in time')),
          25_000,
        ).unref();
      }),
    ]);
  };
  return { wait, stop };
}

export async function runIsolatedProcess(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
) {
  const child = await startOwnedProcess(command, args, cwd, env);
  let interrupted = false;
  const onInterrupt = () => {
    interrupted = true;
    void child.stop().catch(console.error);
  };
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onInterrupt);
  try {
    const result = await child.wait();
    if (result.failed || interrupted || result.result?.code !== 0) {
      throw new Error(`Isolated test exited: ${result.result?.signal ?? result.result?.code}`);
    }
  } finally {
    process.off('SIGINT', onInterrupt);
    process.off('SIGTERM', onInterrupt);
  }
}

export function verifyReadyProof(challenge: string, key: string, proof: string | null): boolean {
  if (!proof || !/^[a-f0-9]{64}$/.test(proof)) return false;
  const expected = createHmac('sha256', key).update(challenge).digest();
  return timingSafeEqual(expected, Buffer.from(proof, 'hex'));
}

export async function waitForReady(port: number, server: OwnedProcess, key: string) {
  const deadline = Date.now() + 180_000;
  const url = `http://127.0.0.1:${port}/health/ready`;
  const exited = server.wait().then(() => {
    throw new Error('Isolated E2E server exited before readiness');
  });
  while (Date.now() < deadline) {
    const challenge = randomBytes(16).toString('hex');
    let response: Response;
    try {
      response = await Promise.race([
        fetch(url, {
          headers: { 'x-vona-test-challenge': challenge },
          signal: AbortSignal.timeout(1500),
        }),
        exited,
      ]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('exited before readiness')) throw error;
      await Promise.race([new Promise(resolvePromise => setTimeout(resolvePromise, 200)), exited]);
      continue;
    }
    if (!verifyReadyProof(challenge, key, response.headers.get('x-vona-test-proof'))) {
      throw new Error('Isolated E2E listener does not belong to this test run');
    }
    if (response.ok && ((await response.json()) as { status?: string }).status === 'ok') return;
    await Promise.race([new Promise(resolvePromise => setTimeout(resolvePromise, 200)), exited]);
  }
  throw new Error('Isolated E2E server did not become ready with a valid ownership proof');
}

export function getUnitTestCommands(args: string[]) {
  const vonaDir = resolve(ROOT_DIR, 'vona');
  return [
    { command: 'npm', args: ['run', 'prerun'], cwd: vonaDir },
    {
      command: process.execPath,
      args: [
        './packages-cli/cli/src/bin/vona.ts',
        ':bin:test',
        '--flavor=normal',
        ...args.map(arg => (arg === '--ci' ? '--ci=true' : arg)),
      ],
      cwd: vonaDir,
    },
  ];
}

export function resolveCabloyEdition(rootDir = ROOT_DIR): 'basic' | 'start' {
  const hasBasic = existsSync(resolve(rootDir, '__CABLOY_BASIC__'));
  const hasStart = existsSync(resolve(rootDir, '__CABLOY_START__'));
  if (hasBasic === hasStart) {
    throw new Error(
      hasBasic
        ? 'Ambiguous Cabloy edition: both __CABLOY_BASIC__ and __CABLOY_START__ markers are present'
        : 'Not a Cabloy project: no __CABLOY_BASIC__ or __CABLOY_START__ marker found',
    );
  }
  return hasBasic ? 'basic' : 'start';
}

export async function runIsolatedTest(kind: 'unit' | 'e2e', args: string[]) {
  resolveCabloyEdition();
  if (process.env.E2E_BASE_URL !== undefined) {
    throw new Error(
      'E2E_BASE_URL is unsupported; the E2E runner manages a local test-mode target.',
    );
  }
  const vonaDir = resolve(ROOT_DIR, 'vona');
  await reapExpiredTestClaims(vonaDir, {
    ttlSeconds: parseTestClaimTtlSeconds(),
    now: Date.now(),
    isInactive: claim => isTestClaimInactive(claim),
    warn: message => console.error(message),
  });
  const runId = createTestRunId();
  const dataRoot = resolve(vonaDir, `.app-test-${runId}`);
  const generatedRoot = resolve(vonaDir, `.vona-test-${runId}`);
  const port = await allocateTestPort();
  const claimPath = await reserveTestRun(
    vonaDir,
    runId,
    kind === 'unit' && args.includes('--coverage') ? 'cov' : kind,
  );
  let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
  let completed = false;
  try {
    broker = await startTestClaimBroker(claimPath);
    createOwned(dataRoot, runId);
    await broker.update({ type: 'local', kind: 'data', stage: 'owned' });
    createOwned(generatedRoot, runId);
    await broker.update({ type: 'local', kind: 'generated', stage: 'owned' });
    mkdirSync(resolve(dataRoot, 'tmp'));
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      ...broker.env,
      META_MODE: 'test',
      VONA_DB_RESET: undefined,
      VONA_TEST_RUN_ID: runId,
      VONA_TEST_READY_KEY: undefined,
      VONA_TEST_SERVER_ORIGIN: undefined,
      APP_NAME: `cabtest${runId}`,
      SERVER_LISTEN_PORT: String(port),
      SERVER_LISTEN_HOSTNAME: '127.0.0.1',
      SERVER_SERVE_PROTOCOL: undefined,
      SERVER_SERVE_HOST: undefined,
      TMPDIR: resolve(dataRoot, 'tmp'),
    };
    await broker.update({ type: 'status', status: 'running' });
    if (kind === 'unit') {
      for (const { command, args: commandArgs, cwd } of getUnitTestCommands(args)) {
        await runIsolatedProcess(command, commandArgs, cwd, env);
      }
    } else {
      let e2eError: unknown;
      const readyKey = randomBytes(32).toString('hex');
      const server = await startOwnedProcess(
        process.execPath,
        [
          './packages-cli/cli/src/bin/vona.ts',
          ':bin:dev',
          '--workers=1',
          '--flavor=normal',
          '--mode=test',
        ],
        resolve(ROOT_DIR, 'vona'),
        {
          ...env,
          VONA_TEST_READY_KEY: readyKey,
          VONA_TEST_SERVER_ORIGIN: 'true',
          SERVER_SERVE_PROTOCOL: 'http',
          SERVER_SERVE_HOST: `127.0.0.1:${port}`,
        },
      );
      let interrupted = false;
      let serverError: unknown;
      const onInterrupt = () => {
        interrupted = true;
        void server.stop().catch(console.error);
      };
      process.on('SIGINT', onInterrupt);
      process.on('SIGTERM', onInterrupt);
      try {
        await waitForReady(port, server, readyKey);
        await runIsolatedProcess(
          process.execPath,
          ['repo-e2e/scripts/runE2e.ts', ...args],
          ROOT_DIR,
          env,
        );
      } catch (error) {
        e2eError = error;
      } finally {
        process.off('SIGINT', onInterrupt);
        process.off('SIGTERM', onInterrupt);
        try {
          const result = await server.stop();
          if (result.failed || interrupted) {
            serverError = new Error('Isolated E2E server did not stop cleanly');
          }
        } catch (error) {
          serverError = error;
        }
      }
      if (serverError) throw toError(serverError);
      if (e2eError) throw toError(e2eError);
    }
    completed = true;
  } catch (error) {
    await broker?.update({ type: 'status', status: 'failed' }).catch(() => {
      console.error('Could not record failed test status; claim retained');
    });
    throw error;
  } finally {
    if (!completed) {
      console.error(`Isolated test claim and resources retained for inspection: ${claimPath}`);
    }
    await broker?.close();
  }
  const result = await cleanTestClaim(claimPath, {
    projectPath: vonaDir,
    isInactive: claim => isTestClaimInactive(claim, true),
    warn: message => console.error(message),
  });
  if (result.status !== 'cleaned') {
    console.error(`Isolated test claim retained for inspection: ${claimPath}`);
    throw new Error('Isolated test succeeded but resource cleanup did not complete');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [kind, ...args] = process.argv.slice(2);
  if (kind !== 'unit' && kind !== 'e2e') throw new Error('Expected unit or e2e test mode');
  await runIsolatedTest(kind, args);
}
