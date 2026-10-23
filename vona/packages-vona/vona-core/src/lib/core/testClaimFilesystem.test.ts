import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  chmod,
  link,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  acquireTestClaimCleanupLock,
  assertTestClaimFilesystemSafePath,
  assertTestClaimPrivateDirectory,
  createTestClaimFile,
  deleteTestClaimFile,
  ensureTestClaimPrivateDirectory,
  readTestClaimFile,
  replaceTestClaimFile,
  TEST_CLAIM_FILE_LIMIT,
} from './testClaimFilesystem.ts';
import {
  getWindowsTestClaimFilesystemHelper,
  windowsTestClaimFilesystem,
} from './testClaimFilesystemWindows.ts';

async function fixture() {
  const root = await mkdtemp(path.join(await realpath(os.tmpdir()), 'claim-filesystem-'));
  const directory = path.join(root, 'private');
  await ensureTestClaimPrivateDirectory(directory);
  return {
    root,
    directory,
    file: path.join(directory, 'claim.json'),
    close: () => rm(root, { recursive: true, force: true }),
  };
}

test('helper assets resolve from source and bundled package locations', () => {
  const helper = getWindowsTestClaimFilesystemHelper();
  assert.ok(helper.endsWith(path.join('src', 'lib', 'core', 'testClaimFilesystemWindows.ps1')));
  assert.equal(
    getWindowsTestClaimFilesystemHelper(path.resolve(path.dirname(helper), '../../../dist')),
    helper,
  );
});

test('private claim storage creates exclusively, bounds reads, atomically replaces and deletes', async () => {
  const f = await fixture();
  try {
    assert.equal(await assertTestClaimPrivateDirectory(f.directory, false), true);
    await createTestClaimFile(f.file, '{"state":"initial","unicode":"雪"}\n');
    await assert.rejects(createTestClaimFile(f.file, 'overwrite'), { code: 'EEXIST' });
    assert.equal(await readTestClaimFile(f.file), '{"state":"initial","unicode":"雪"}\n');
    await replaceTestClaimFile(f.file, '{"state":"committed"}\n');
    assert.equal(await readTestClaimFile(f.file), '{"state":"committed"}\n');
    await assert.rejects(
      replaceTestClaimFile(f.file, 'x'.repeat(TEST_CLAIM_FILE_LIMIT + 1)),
      /size/,
    );
    assert.equal(await readTestClaimFile(f.file), '{"state":"committed"}\n');
    await writeFile(f.file, 'x'.repeat(TEST_CLAIM_FILE_LIMIT + 1));
    await assert.rejects(readTestClaimFile(f.file));
    await deleteTestClaimFile(f.file);
    await assert.rejects(lstat(f.file), { code: 'ENOENT' });
  } finally {
    await f.close();
  }
});

test('cleanup lock contention is exclusive and release never unlinks a replacement token', async () => {
  const f = await fixture();
  const lockPath = `${f.file}.cleanup.lock`;
  try {
    const lock = await acquireTestClaimCleanupLock(lockPath);
    await assert.rejects(acquireTestClaimCleanupLock(lockPath), { code: 'EEXIST' });
    const contents = await readTestClaimFile(lockPath);
    assert.match(JSON.parse(contents).token, /^[a-f\d]{48}$/);
    await lock.release();
    await lock.release();
    const old = await acquireTestClaimCleanupLock(lockPath);
    await deleteTestClaimFile(lockPath);
    const replacement = await acquireTestClaimCleanupLock(lockPath);
    await assert.rejects(old.release());
    await lstat(lockPath);
    await replacement.release();
    await assert.rejects(lstat(lockPath), { code: 'ENOENT' });
  } finally {
    await f.close();
  }
});

test('paths reject redirected ancestors and leaf hardlinks without touching the sentinel', async () => {
  const f = await fixture();
  try {
    const outside = path.join(f.root, 'outside');
    await mkdir(outside);
    const redirect = path.join(f.root, 'redirect');
    await symlink(outside, redirect, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(
      () => assertTestClaimFilesystemSafePath(path.join(redirect, 'missing.json')),
      /Unsafe/,
    );
    await createTestClaimFile(f.file, 'sentinel');
    const alias = path.join(f.directory, 'alias.json');
    await link(f.file, alias);
    await assert.rejects(readTestClaimFile(alias));
    await assert.rejects(replaceTestClaimFile(alias, 'destroyed'));
    await assert.rejects(deleteTestClaimFile(alias));
    assert.equal(await readFile(f.file, 'utf8'), 'sentinel');
    assert.deepEqual((await readdir(f.directory)).sort(), ['alias.json', 'claim.json']);
  } finally {
    await f.close();
  }
});

test(
  'POSIX unsafe existing modes are rejected rather than repaired',
  { skip: process.platform === 'win32' },
  async () => {
    const f = await fixture();
    try {
      await chmod(f.directory, 0o755);
      await assert.rejects(ensureTestClaimPrivateDirectory(f.directory), /Unsafe/);
      assert.equal((await lstat(f.directory)).mode & 0o777, 0o755);
    } finally {
      await f.close();
    }
  },
);

test(
  'Windows protected DACLs reject broad file and directory grants without repairing them',
  { skip: process.platform !== 'win32' },
  async () => {
    const f = await fixture();
    try {
      await createTestClaimFile(f.file, 'private');
      execFileSync('icacls.exe', [f.file, '/grant', '*S-1-1-0:(R)'], {
        windowsHide: true,
        stdio: 'pipe',
      });
      await assert.rejects(readTestClaimFile(f.file), /Unsafe/);
      await assert.rejects(replaceTestClaimFile(f.file, 'wrong'), /Unsafe/);
      assert.equal(await readFile(f.file, 'utf8'), 'private');
      execFileSync('icacls.exe', [f.directory, '/grant', '*S-1-1-0:(R)'], {
        windowsHide: true,
        stdio: 'pipe',
      });
      await assert.rejects(ensureTestClaimPrivateDirectory(f.directory), /Unsafe/);
      await assert.rejects(assertTestClaimPrivateDirectory(f.directory, false), /Unsafe/);
    } finally {
      await f.close();
    }
  },
);

async function holdWindowsClaimFile(file: string) {
  // A native handle denying FILE_SHARE_DELETE prevents replacement. Node opens
  // with delete sharing, so hold this deliberately through a separate PS7 peer.
  const { spawn } = await import('node:child_process');
  const script =
    '$h=[System.IO.File]::Open($env:VONA_CLAIM_TEST_FILE,[System.IO.FileMode]::Open,[System.IO.FileAccess]::Read,[System.IO.FileShare]::Read);[Console]::Out.WriteLine("ready");[Console]::Out.Flush();[Console]::In.ReadLine()|Out-Null;$h.Dispose()';
  const child = spawn('pwsh', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', script], {
    windowsHide: true,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, VONA_CLAIM_TEST_FILE: file },
  });
  child.stderr.resume();
  child.stdin.on('error', () => {});
  const exited = new Promise<void>(resolve => child.once('close', () => resolve()));
  const release = async () => {
    child.stdin.end('\n');
    const timer = setTimeout(() => child.kill(), 5000);
    try {
      await exited;
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('fixture handle readiness timeout')), 15000);
      child.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      child.once('exit', () => {
        clearTimeout(timer);
        reject(new Error('fixture handle exited'));
      });
      let output = '';
      child.stdout.on('data', chunk => {
        output += String(chunk);
        if (output.includes('ready')) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
    return release;
  } catch (error) {
    await release();
    throw error;
  }
}

test(
  'Windows replacement retries a transient sharing conflict within the same call',
  { skip: process.platform !== 'win32' },
  async () => {
    const f = await fixture();
    let release: (() => Promise<void>) | undefined;
    let replacement: Promise<unknown> | undefined;
    try {
      await createTestClaimFile(f.file, 'previous committed inventory');
      release = await holdWindowsClaimFile(f.file);
      assert.equal(await readTestClaimFile(f.file), 'previous committed inventory');
      let settled = false;
      // Attach a rejection handler before polling, including the failure path.
      replacement = replaceTestClaimFile(f.file, 'new committed inventory').then(
        () => {
          settled = true;
        },
        error => {
          settled = true;
          return error;
        },
      );
      const deadline = Date.now() + 10000;
      while (!(await readdir(f.directory)).some(name => name.endsWith('.tmp'))) {
        if (settled) {
          assert.equal(await replacement, undefined);
          assert.fail('replacement completed before the held handle was released');
        }
        assert.ok(Date.now() < deadline, 'replacement temporary file was not observed');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      await release();
      release = undefined;
      assert.equal(await replacement, undefined);
      assert.equal(await readTestClaimFile(f.file), 'new committed inventory');
      assert.deepEqual(await readdir(f.directory), ['claim.json']);
    } finally {
      await release?.();
      await replacement;
      await f.close();
    }
  },
);

test(
  'Windows persistent sharing conflict fails boundedly and retains the old manifest',
  { skip: process.platform !== 'win32' },
  async () => {
    const f = await fixture();
    let release: (() => Promise<void>) | undefined;
    try {
      await createTestClaimFile(f.file, 'previous committed inventory');
      release = await holdWindowsClaimFile(f.file);
      assert.equal(await readTestClaimFile(f.file), 'previous committed inventory');
      const started = performance.now();
      await assert.rejects(replaceTestClaimFile(f.file, 'uncommitted'), {
        code: 'EBUSY',
        nativeCode: 32,
        message: 'Unsafe Windows test claim filesystem operation (EBUSY, nativeCode=32)',
      });
      const elapsed = performance.now() - started;
      assert.ok(elapsed >= 900 && elapsed < 10000, `bounded retry took ${elapsed}ms`);
      assert.equal(await readFile(f.file, 'utf8'), 'previous committed inventory');
      assert.deepEqual(await readdir(f.directory), ['claim.json']);
      await release();
      release = undefined;
      await replaceTestClaimFile(f.file, 'new committed inventory');
      assert.equal(await readTestClaimFile(f.file), 'new committed inventory');
    } finally {
      await release?.();
      await f.close();
    }
  },
);

test(
  'Windows replacement rejects a read-only target without changing its contents or attributes',
  { skip: process.platform !== 'win32' },
  async () => {
    const f = await fixture();
    const attributes = (script: string) =>
      execFileSync(
        'pwsh',
        [
          '-NoLogo',
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          `$ErrorActionPreference='Stop';${script}`,
        ],
        {
          windowsHide: true,
          encoding: 'utf8',
          env: { ...process.env, VONA_CLAIM_TEST_FILE: f.file },
        },
      ).trim();
    let original: number | undefined;
    try {
      await createTestClaimFile(f.file, 'previous committed inventory');
      original = Number(
        attributes('[int][System.IO.File]::GetAttributes($env:VONA_CLAIM_TEST_FILE)'),
      );
      assert.ok(Number.isInteger(original));
      const readOnly = (original & ~128) | 1;
      attributes(
        `[System.IO.File]::SetAttributes($env:VONA_CLAIM_TEST_FILE,[System.IO.FileAttributes]${readOnly})`,
      );
      assert.equal(await readTestClaimFile(f.file), 'previous committed inventory');
      await assert.rejects(replaceTestClaimFile(f.file, 'uncommitted'), {
        code: 'EACCES',
        nativeCode: 5,
        message: 'Unsafe Windows test claim filesystem operation (EACCES, nativeCode=5)',
      });
      assert.equal(await readTestClaimFile(f.file), 'previous committed inventory');
      assert.equal(
        Number(attributes('[int][System.IO.File]::GetAttributes($env:VONA_CLAIM_TEST_FILE)')),
        readOnly,
      );
      assert.deepEqual(await readdir(f.directory), ['claim.json']);
    } finally {
      try {
        if (original !== undefined) {
          attributes(
            `[System.IO.File]::SetAttributes($env:VONA_CLAIM_TEST_FILE,[System.IO.FileAttributes]${original})`,
          );
        }
      } finally {
        await f.close();
      }
    }
  },
);

test(
  'Windows helper rejects UNC, device, alternate stream paths and missing parents',
  { skip: process.platform !== 'win32' },
  async () => {
    const f = await fixture();
    try {
      for (const file of [
        '\\\\localhost\\C$\\claim.json',
        '\\\\?\\C:\\claim.json',
        `${f.file}:stream`,
        path.join(f.root, 'missing', 'private'),
      ]) {
        await assert.rejects(
          windowsTestClaimFilesystem({ command: 'ensure-directory', path: file }),
          /Unsafe/,
        );
      }
    } finally {
      await f.close();
    }
  },
);
