import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import type { Server, Socket } from 'node:net';
import type { Writable } from 'node:stream';

import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { hostname } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_FRAME = 1024 * 1024;
const START_TIMEOUT = 30_000;

export interface WindowsProcessSnapshot {
  pid: number;
  startTime: string;
  host: string;
  state: 'running';
  args: string;
}

export interface WindowsNativeResult {
  type: 'drained';
  result: { code: number; signal: null };
  failed: boolean;
}

export interface WindowsNativeJobConfig {
  jobId: string;
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
  /** Negative capability probe for native tests: invalid Job assignment must prevent user code. */
  rejectJobAssignment?: boolean;
}

export interface WindowsNativeJob {
  ready: Promise<WindowsProcessSnapshot>;
  started: Promise<void>;
  wait: () => Promise<WindowsNativeResult>;
  authorize: () => void;
  /** Exact live PID/FILETIME membership in this helper's private Job; never arbitrary Job membership. */
  contains: (identity: { pid: number; startTime: string }) => Promise<boolean>;
  stop: () => void;
  /** Closing this pipe is the parent-death protocol; it never signals a historical PID. */
  disconnect: () => void;
}

/** src is included in the published package; build tools need not copy the native assets. */
export function resolveWindowsProcessAssets(moduleUrl = import.meta.url) {
  let directory = dirname(fileURLToPath(moduleUrl));
  for (;;) {
    const manifest = join(directory, 'package.json');
    if (existsSync(manifest)) {
      const info = JSON.parse(readFileSync(manifest, 'utf8')) as { name?: string };
      if (info.name === 'vona-core') {
        const script = join(directory, 'src/lib/core/testProcessWindowsNative.ps1');
        const source = join(directory, 'src/lib/core/testProcessWindowsNative.cs');
        if (!existsSync(script) || !existsSync(source)) {
          throw new Error('Installed vona-core is missing the Windows native process assets');
        }
        return { script, source };
      }
    }
    const parent = dirname(directory);
    if (parent === directory) throw new Error('Cannot resolve packaged Windows process assets');
    directory = parent;
  }
}

function requireWindows() {
  if (process.platform !== 'win32')
    throw new Error('The Windows process backend requires native Windows and PowerShell 7 (pwsh)');
}

function spawnHelper(mode: 'job' | 'inspect'): ChildProcessWithoutNullStreams {
  requireWindows();
  const { script } = resolveWindowsProcessAssets();
  return spawn(
    'pwsh.exe',
    ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', script, '-Mode', mode],
    {
      shell: false,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );
}

function frame(value: unknown) {
  const result = `${JSON.stringify(value)}\n`;
  if (Buffer.byteLength(result, 'utf8') > MAX_FRAME)
    throw new Error('Windows native control frame exceeds limit');
  return result;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  // Startup can fail before callers begin awaiting the subsequent stage.
  void promise.catch(() => {});
  return { promise, resolve, reject };
}

function errorOf(value: unknown) {
  return value instanceof Error ? value : new Error(String(value));
}

/** Strict, bounded line protocol. Target stdout/stderr never enter this parser. */
function consumeFrames(
  child: ChildProcessWithoutNullStreams,
  receive: (value: Record<string, unknown>) => void,
  fail: (error: Error) => void,
) {
  let buffer = Buffer.alloc(0);
  child.stdout.on('data', (chunk: Buffer) => {
    try {
      buffer = Buffer.concat([buffer, chunk]);
      for (;;) {
        const newline = buffer.indexOf(10);
        if (newline < 0) break;
        if (newline > MAX_FRAME) throw new Error('Windows native control frame exceeds limit');
        const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, newline));
        buffer = buffer.subarray(newline + 1);
        const value: unknown = JSON.parse(text);
        if (!value || typeof value !== 'object' || Array.isArray(value))
          throw new Error('Invalid Windows native control frame');
        receive(value as Record<string, unknown>);
      }
      if (buffer.length > MAX_FRAME) throw new Error('Windows native control frame exceeds limit');
    } catch (error) {
      fail(errorOf(error));
    }
  });
  child.stdout.on('end', () => {
    if (buffer.length) fail(new Error('Truncated Windows native control frame'));
  });
}

interface OutputBridge {
  name: string;
  close: () => void;
  ended: Promise<void>;
}

async function outputBridge(name: string, destination: Writable): Promise<OutputBridge> {
  const ended = deferred<void>();
  let socket: Socket | undefined;
  const server: Server = createServer(connection => {
    if (socket) {
      connection.destroy();
      return;
    }
    socket = connection;
    server.close();
    connection.on('error', error => ended.reject(error));
    connection.on('end', () => ended.resolve());
    connection.on('close', () => {
      if (!connection.readableEnded)
        ended.reject(new Error('Windows target output pipe closed prematurely'));
    });
    connection.pipe(destination, { end: false });
  });
  server.on('error', error => ended.reject(error));
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(`\\\\.\\pipe\\${name}`, () => {
      server.off('error', reject);
      resolve();
    });
  });
  return {
    name,
    ended: ended.promise,
    close: () => {
      socket?.destroy();
      server.close();
    },
  };
}

/**
 * Creates the external native helper, but does not authorize application launch.
 * The caller MUST persist ready's helper identity before authorize().
 */
export async function createWindowsNativeJob(
  config: WindowsNativeJobConfig,
  output: {
    stdout: Writable;
    stderr: Writable;
    /** Native crash tests use the live ChildProcess handle, never a historical PID. */
    onHelperSpawn?: (helper: ChildProcessWithoutNullStreams) => void;
  } = { stdout: process.stdout, stderr: process.stderr },
): Promise<WindowsNativeJob> {
  requireWindows();
  const suffix = randomBytes(32).toString('hex');
  const stdout = await outputBridge(`cabloy-test-${suffix}-out`, output.stdout);
  let stderr: OutputBridge;
  try {
    stderr = await outputBridge(`cabloy-test-${suffix}-err`, output.stderr);
  } catch (error) {
    stdout.close();
    throw error;
  }
  let child: ChildProcessWithoutNullStreams;
  try {
    child = spawnHelper('job');
  } catch (error) {
    stdout.close();
    stderr.close();
    throw error;
  }
  const ready = deferred<WindowsProcessSnapshot>();
  const started = deferred<void>();
  const closed = deferred<WindowsNativeResult>();
  let phase: 'initial' | 'ready' | 'authorized' | 'started' | 'drained' = 'initial';
  let proof: WindowsNativeResult | undefined;
  let failure: Error | undefined;
  let diagnostics = '';
  let stopping = false;
  let didClose = false;
  let timeout: NodeJS.Timeout | undefined;
  const queries = new Map<
    string,
    { result: ReturnType<typeof deferred<boolean>>; timer: NodeJS.Timeout }
  >();
  const rejectQueries = (error: Error, preserveResponses = false) => {
    for (const { result, timer } of queries.values()) {
      clearTimeout(timer);
      result.reject(error);
    }
    // Stop can race with valid replies already in the pipe. Keep only their bounded
    // correlation records until the helper replies or closes, never grant success.
    if (!preserveResponses) queries.clear();
  };
  const disconnect = () => {
    if (!child.stdin.destroyed) child.stdin.end();
  };
  const fail = (error: Error) => {
    failure ??= error;
    rejectQueries(error);
    ready.reject(error);
    started.reject(error);
    closed.reject(error);
    clearTimeout(timeout);
    disconnect();
    // Do not wait indefinitely for a stuck compiler/native inspector. Closing the
    // protocol/output handles makes its next operation fail closed; no PID signal.
    stdout.close();
    stderr.close();
    child.stdout.destroy();
    child.stderr.destroy();
    child.unref();
  };
  timeout = setTimeout(
    () => fail(new Error('Windows native helper startup timed out')),
    START_TIMEOUT,
  );
  child.stdin.on('error', error => fail(error));
  child.on('error', error => fail(error));
  child.stderr.on('data', (chunk: Buffer) => {
    diagnostics = (diagnostics + chunk.toString('utf8')).slice(-16_384);
  });
  consumeFrames(
    child,
    value => {
      if (value.type === 'ready' && phase === 'initial') {
        if (
          value.jobId !== config.jobId ||
          value.pid !== child.pid ||
          typeof value.startTime !== 'string' ||
          !/^\d{1,20}$/.test(value.startTime)
        ) {
          throw new Error('Invalid Windows native helper identity');
        }
        phase = 'ready';
        ready.resolve({
          pid: value.pid as number,
          startTime: value.startTime,
          host: hostname(),
          state: 'running',
          args: '',
        });
      } else if (value.type === 'started' && phase === 'authorized') {
        phase = 'started';
        clearTimeout(timeout);
        started.resolve();
      } else if (value.type === 'containment' && phase === 'started') {
        if (
          typeof value.requestId !== 'string' ||
          value.jobId !== config.jobId ||
          typeof value.contained !== 'boolean'
        ) {
          throw new Error('Invalid Windows native containment response');
        }
        const query = queries.get(value.requestId);
        if (!query) throw new Error('Unknown Windows native containment response');
        queries.delete(value.requestId);
        clearTimeout(query.timer);
        query.result.resolve(value.contained && !stopping && !failure && !didClose);
      } else if (value.type === 'drained' && phase === 'started') {
        rejectQueries(new Error('Windows native Job has drained'));
        if (
          !Number.isSafeInteger(value.code) ||
          (value.code as number) < 0 ||
          (value.code as number) > 0xffffffff ||
          typeof value.failed !== 'boolean'
        ) {
          throw new Error('Invalid Windows native drainage proof');
        }
        phase = 'drained';
        proof = {
          type: 'drained',
          result: { code: value.code as number, signal: null },
          failed: value.failed || stopping,
        };
      } else {
        throw new Error('Unexpected Windows native control message');
      }
    },
    fail,
  );
  child.once('close', (code, signal) => {
    didClose = true;
    rejectQueries(new Error('Windows native Job helper is no longer live'));
    clearTimeout(timeout);
    void (async () => {
      try {
        if (failure) throw new Error('Windows native helper control failed', { cause: failure });
        if (code !== 0 || signal || !proof) {
          throw new Error(
            `Windows native helper exited without proving Job shutdown${diagnostics ? `: ${diagnostics.trim()}` : ''}`,
          );
        }
        timeout = setTimeout(
          () => fail(new Error('Windows native output bridge did not close in time')),
          10_000,
        );
        await Promise.all([stdout.ended, stderr.ended]);
        clearTimeout(timeout);
        closed.resolve(proof);
      } catch (error) {
        const cause = errorOf(error);
        ready.reject(cause);
        started.reject(cause);
        closed.reject(cause);
      } finally {
        clearTimeout(timeout);
        stdout.close();
        stderr.close();
      }
    })();
  });
  try {
    const env: Record<string, string> = {};
    // Node's Windows spawn convention: case-insensitive keys, first lexical spelling wins.
    const keys = new Set<string>();
    for (const key of Object.keys(config.env).sort()) {
      const value = config.env[key];
      if (value !== undefined && !keys.has(key.toUpperCase())) {
        keys.add(key.toUpperCase());
        env[key] = value;
      }
    }
    child.stdin.write(frame({ ...config, env, stdoutPipe: stdout.name, stderrPipe: stderr.name }));
    output.onHelperSpawn?.(child);
  } catch (error) {
    fail(errorOf(error));
  }
  const stop = () => {
    if (stopping) return;
    stopping = true;
    rejectQueries(new Error('Windows native Job is stopping'), true);
    if (proof) proof.failed = true;
    if (!didClose) {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => fail(new Error('Windows native helper did not prove shutdown after stop')),
        25_000,
      );
    }
    disconnect();
  };
  return {
    ready: ready.promise,
    started: started.promise,
    wait: () => closed.promise,
    authorize: () => {
      if (phase !== 'ready' || stopping || didClose || failure)
        throw new Error('Windows native launch authorization is no longer valid');
      phase = 'authorized';
      child.stdin.write(frame({ type: 'authorize', jobId: config.jobId }));
    },
    contains: async identity => {
      if (
        phase !== 'started' ||
        stopping ||
        didClose ||
        failure ||
        queries.size >= 32 ||
        !Number.isSafeInteger(identity.pid) ||
        identity.pid <= 0 ||
        identity.pid > 0xffffffff ||
        typeof identity.startTime !== 'string' ||
        !/^[1-9]\d{0,19}$/.test(identity.startTime)
      ) {
        throw new Error('Windows native containment query is unavailable or invalid');
      }
      const requestId = randomBytes(16).toString('hex');
      const result = deferred<boolean>();
      const timer = setTimeout(() => {
        fail(new Error('Windows native containment query timed out'));
      }, 4000);
      queries.set(requestId, { result, timer });
      try {
        child.stdin.write(
          frame({
            type: 'containment',
            requestId,
            jobId: config.jobId,
            pid: identity.pid,
            startTime: identity.startTime,
          }),
        );
      } catch (error) {
        fail(errorOf(error));
      }
      return await result.promise;
    },
    stop,
    disconnect: stop,
  };
}

/** Query only the relevant owner/helper PIDs. Access/query errors are never absence. */
export async function inspectWindowsProcesses(
  pids: readonly number[],
): Promise<WindowsProcessSnapshot[]> {
  requireWindows();
  if (pids.some(pid => !Number.isSafeInteger(pid) || pid <= 0 || pid > 0xffffffff))
    throw new Error('Invalid Windows process PID');
  const unique = [...new Set(pids)];
  if (unique.length > 4096) throw new Error('Too many Windows process identities to inspect');
  if (!unique.length) return [];
  const child = spawnHelper('inspect');
  let response: WindowsProcessSnapshot[] | undefined;
  let failure: Error | undefined;
  let diagnostics = '';
  const inspection = deferred<WindowsProcessSnapshot[]>();
  const fail = (error: Error) => {
    failure ??= error;
    inspection.reject(error);
    child.stdin.destroy();
    child.stdout.destroy();
    child.stderr.destroy();
    child.unref();
  };
  const timeout = setTimeout(
    () => fail(new Error('Windows native process inspection timed out')),
    START_TIMEOUT,
  );
  child.stdin.on('error', fail);
  child.stderr.on('data', (chunk: Buffer) => {
    diagnostics = (diagnostics + chunk.toString('utf8')).slice(-16_384);
  });
  consumeFrames(
    child,
    value => {
      if (response || value.type !== 'inspection' || !Array.isArray(value.processes))
        throw new Error('Invalid Windows native process inspection');
      const seen = new Set<number>();
      response = value.processes.map((row: unknown) => {
        if (
          !row ||
          typeof row !== 'object' ||
          !('pid' in row) ||
          !('startTime' in row) ||
          typeof row.pid !== 'number' ||
          !unique.includes(row.pid) ||
          seen.has(row.pid) ||
          typeof row.startTime !== 'string' ||
          !/^\d{1,20}$/.test(row.startTime)
        ) {
          throw new Error('Invalid Windows native process identity');
        }
        seen.add(row.pid);
        return {
          pid: row.pid,
          startTime: row.startTime,
          host: hostname(),
          state: 'running',
          args: '',
        };
      });
    },
    fail,
  );
  try {
    child.once('error', fail);
    child.once('close', (code, signal) => {
      if (failure) {
        inspection.reject(failure);
      } else if (code !== 0 || signal || !response) {
        inspection.reject(
          new Error(
            `Cannot inspect Windows process identities${diagnostics ? `: ${diagnostics.trim()}` : ''}`,
          ),
        );
      } else {
        inspection.resolve(response);
      }
    });
    child.stdin.end(frame({ pids: unique }));
    return await inspection.promise;
  } finally {
    clearTimeout(timeout);
  }
}

export async function inspectWindowsProcess(
  pid: number,
): Promise<WindowsProcessSnapshot | undefined> {
  return (await inspectWindowsProcesses([pid]))[0];
}
