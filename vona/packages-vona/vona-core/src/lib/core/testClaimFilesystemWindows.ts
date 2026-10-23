import type { ChildProcess } from 'node:child_process';

import { execFile, execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface WindowsTestClaimFilesystemRequest {
  command:
    | 'safe-path'
    | 'directory'
    | 'ensure-directory'
    | 'read'
    | 'create'
    | 'replace'
    | 'delete'
    | 'release-lock';
  path: string;
  allowMissing?: boolean;
  content?: string;
  expected?: string;
}

// Both source and bundled dist consumers use the checked-in, published src assets.
export function getWindowsTestClaimFilesystemHelper(
  directory = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url)),
) {
  let current = directory;
  while (true) {
    const manifest = path.join(current, 'package.json');
    if (existsSync(manifest)) {
      const value = JSON.parse(readFileSync(manifest, 'utf8'));
      if (value.name === 'vona-core') {
        const helper = path.join(current, 'src/lib/core/testClaimFilesystemWindows.ps1');
        if (!existsSync(helper) || !existsSync(helper.replace(/\.ps1$/, '.cs')))
          throw new Error('Windows test claim filesystem helper assets are missing');
        return helper;
      }
    }
    const parent = path.dirname(current);
    if (parent === current)
      throw new Error('Cannot locate the vona-core Windows filesystem helper');
    current = parent;
  }
}

function invocation() {
  if (process.platform !== 'win32') throw new Error('Windows claim filesystem requires Windows');
  return [
    '-NoLogo',
    '-NoProfile',
    '-NonInteractive',
    '-File',
    getWindowsTestClaimFilesystemHelper(),
  ];
}
function decode(source: string): { exists?: boolean; content?: string } {
  let value;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error('Windows test claim filesystem helper returned an invalid response');
  }
  if (!value || value.ok !== true) {
    const code = ['EEXIST', 'ENOENT', 'EBUSY', 'EACCES', 'EUNSAFE'].includes(value?.code)
      ? value.code
      : 'EUNSAFE';
    const nativeCode =
      Number.isInteger(value?.nativeCode) && value.nativeCode >= 0 && value.nativeCode <= 65535
        ? value.nativeCode
        : 0;
    const error = new Error(
      `Unsafe Windows test claim filesystem operation (${code}, nativeCode=${nativeCode})`,
    );
    Object.assign(error, { code, nativeCode });
    throw error;
  }
  return value;
}

export function windowsTestClaimFilesystemSync(request: WindowsTestClaimFilesystemRequest) {
  try {
    return decode(
      execFileSync('pwsh', invocation(), {
        input: JSON.stringify(request),
        encoding: 'utf8',
        windowsHide: true,
        timeout: 30000,
        maxBuffer: 8 * 1024 * 1024,
      }),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      throw new Error('Native Windows test claims require PowerShell 7 (pwsh) on PATH');
    throw error;
  }
}

type Response = { exists?: boolean; content?: string };
type Pending = {
  resolve: (value: Response) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};
let bridge:
  | {
      child: ChildProcess;
      pending: Pending[];
      output: string;
      idle?: ReturnType<typeof setTimeout>;
    }
  | undefined;

export function windowsTestClaimFilesystem(
  request: WindowsTestClaimFilesystemRequest,
): Promise<Response> {
  if (!bridge) {
    // Explicit executable + argv, never a shell. A burst shares Add-Type startup;
    // the bridge owns no persistent native handles and exits when idle.
    const child = execFile('pwsh', invocation(), { windowsHide: true, maxBuffer: Infinity });
    // execFile's collection listeners are for its callback API. This bounded
    // line protocol consumes the streams itself, without retaining burst history.
    child.stdout?.removeAllListeners('data');
    child.stderr?.removeAllListeners('data');
    const state = {
      child,
      pending: [] as Pending[],
      output: '',
      idle: undefined as ReturnType<typeof setTimeout> | undefined,
    };
    bridge = state;
    const fail = (error: Error) => {
      if (bridge === state) bridge = undefined;
      clearTimeout(state.idle);
      for (const operation of state.pending.splice(0)) {
        clearTimeout(operation.timer);
        operation.reject(error);
      }
      child.stdin?.destroy();
      child.kill();
    };
    child.once('error', error =>
      fail(
        new Error(
          (error as NodeJS.ErrnoException).code === 'ENOENT'
            ? 'Native Windows test claims require PowerShell 7 (pwsh) on PATH'
            : 'Windows test claim filesystem helper failed; operation not acknowledged',
        ),
      ),
    );
    child.once('exit', () =>
      fail(new Error('Windows test claim filesystem helper exited; operation not acknowledged')),
    );
    child.stdin?.on('error', () =>
      fail(new Error('Windows test claim filesystem control stream failed')),
    );
    child.stdout?.setEncoding('utf8');
    child.stderr?.resume();
    child.stdout?.on('data', (chunk: string) => {
      state.output += chunk;
      if (Buffer.byteLength(state.output) > 8 * 1024 * 1024) {
        fail(new Error('Windows test claim filesystem response exceeded limit'));
        return;
      }
      while (state.output.includes('\n')) {
        const end = state.output.indexOf('\n');
        const line = state.output.slice(0, end);
        state.output = state.output.slice(end + 1);
        const operation = state.pending.shift();
        if (!operation) {
          fail(new Error('Unexpected Windows test claim filesystem response'));
          return;
        }
        clearTimeout(operation.timer);
        try {
          operation.resolve(decode(line));
        } catch (error) {
          operation.reject(error as Error);
        }
      }
      if (!state.pending.length) {
        state.idle = setTimeout(() => {
          if (bridge === state) bridge = undefined;
          child.stdin?.end();
        }, 1000);
      }
    });
  }
  const state = bridge;
  clearTimeout(state.idle);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (bridge === state) bridge = undefined;
      for (const operation of state.pending.splice(0)) {
        clearTimeout(operation.timer);
        operation.reject(
          new Error('Windows test claim filesystem operation timed out; not acknowledged'),
        );
      }
      state.child.kill();
    }, 30000);
    state.pending.push({ resolve, reject, timer });
    state.child.stdin?.write(`${JSON.stringify(request)}\n`);
  });
}
