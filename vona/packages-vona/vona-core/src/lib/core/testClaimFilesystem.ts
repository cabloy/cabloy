import { randomBytes } from 'node:crypto';
import { constants, lstatSync, unlinkSync } from 'node:fs';
import { lstat, mkdir, open, rename, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  windowsTestClaimFilesystem,
  windowsTestClaimFilesystemSync,
} from './testClaimFilesystemWindows.ts';

export const TEST_CLAIM_FILE_LIMIT = 4 * 1024 * 1024;

export function assertTestClaimFilesystemSafePath(file: string, allowMissing = true) {
  if (process.platform === 'win32') {
    windowsTestClaimFilesystemSync({
      command: 'safe-path',
      path: path.resolve(file),
      allowMissing,
    });
    return;
  }
  let current = path.resolve(file);
  while (true) {
    try {
      const stat = lstatSync(current);
      if (stat.isSymbolicLink() || (current !== path.resolve(file) && !stat.isDirectory()))
        throw new Error('Unsafe test claim path');
    } catch (error) {
      if (!allowMissing || (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

export async function assertTestClaimPrivateDirectory(
  directory: string,
  missingAllowed = true,
): Promise<boolean> {
  if (process.platform === 'win32') {
    const value = await windowsTestClaimFilesystem({
      command: 'directory',
      path: path.resolve(directory),
      allowMissing: missingAllowed,
    });
    return value.exists === true;
  }
  assertTestClaimFilesystemSafePath(directory, missingAllowed);
  let stat;
  try {
    stat = await lstat(directory);
  } catch (error) {
    if (missingAllowed && (error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
  if (
    !stat.isDirectory() ||
    (stat.mode & 0o077) !== 0 ||
    (process.getuid && stat.uid !== process.getuid())
  ) {
    throw new Error('Unsafe shared test claim directory');
  }
  return true;
}

export async function ensureTestClaimPrivateDirectory(directory: string) {
  if (process.platform === 'win32') {
    await windowsTestClaimFilesystem({
      command: 'ensure-directory',
      path: path.resolve(directory),
    });
    return;
  }
  assertTestClaimFilesystemSafePath(directory);
  await mkdir(directory, { mode: 0o700 }).catch(error => {
    if (error.code !== 'EEXIST') throw error;
  });
  await assertTestClaimPrivateDirectory(directory, false);
}

function assertPrivateFile(file: string) {
  assertTestClaimFilesystemSafePath(file, false);
  const stat = lstatSync(file);
  if (
    !stat.isFile() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o077) !== 0 ||
    (process.getuid && stat.uid !== process.getuid())
  ) {
    throw new Error('Unsafe test claim file');
  }
}
async function syncDirectory(directory: string) {
  const handle = await open(directory, constants.O_RDONLY);
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}
function checkContent(content: string) {
  if (Buffer.byteLength(content) > TEST_CLAIM_FILE_LIMIT)
    throw new Error('Invalid test claim file size');
}
export async function readTestClaimFile(file: string): Promise<string> {
  if (process.platform === 'win32') {
    const value = await windowsTestClaimFilesystem({ command: 'read', path: path.resolve(file) });
    if (typeof value.content !== 'string') throw new TypeError('Invalid test claim file response');
    return value.content;
  }
  assertPrivateFile(file);
  const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (
      !stat.isFile() ||
      stat.nlink !== 1 ||
      stat.size > TEST_CLAIM_FILE_LIMIT ||
      (stat.mode & 0o077) !== 0 ||
      (process.getuid && stat.uid !== process.getuid())
    ) {
      throw new Error('Invalid test claim file');
    }
    // Bound the allocation and bytes read even if the file grows after fstat.
    const buffer = Buffer.alloc(TEST_CLAIM_FILE_LIMIT + 1);
    let offset = 0;
    while (offset < buffer.length) {
      const { bytesRead } = await handle.read(buffer, offset, buffer.length - offset, null);
      if (!bytesRead) break;
      offset += bytesRead;
    }
    if (offset > TEST_CLAIM_FILE_LIMIT) throw new Error('Invalid test claim file size');
    return buffer.subarray(0, offset).toString('utf8');
  } finally {
    await handle.close();
  }
}
export async function createTestClaimFile(file: string, content: string) {
  checkContent(content);
  if (process.platform === 'win32') {
    await windowsTestClaimFilesystem({ command: 'create', path: path.resolve(file), content });
    return;
  }
  assertTestClaimFilesystemSafePath(file);
  const handle = await open(
    file,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    await handle.writeFile(content);
    await handle.sync();
  } finally {
    await handle.close();
  }
  await syncDirectory(path.dirname(file));
}
export async function replaceTestClaimFile(file: string, content: string) {
  checkContent(content);
  if (process.platform === 'win32') {
    await windowsTestClaimFilesystem({ command: 'replace', path: path.resolve(file), content });
    return;
  }
  const temp = `${file}.${randomBytes(12).toString('hex')}.tmp`;
  const handle = await open(
    temp,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    try {
      await handle.writeFile(content);
      await handle.sync();
    } finally {
      await handle.close();
    }
    assertPrivateFile(file);
    await rename(temp, file);
    await syncDirectory(path.dirname(file));
  } finally {
    await unlink(temp).catch(error => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}
export async function deleteTestClaimFile(file: string) {
  if (process.platform === 'win32') {
    await windowsTestClaimFilesystem({ command: 'delete', path: path.resolve(file) });
    return;
  }
  assertPrivateFile(file);
  await unlink(file);
}

export interface TestClaimFilesystemLock {
  release(): Promise<void>;
}
async function deleteExpiredCleanupLock(file: string, expiredBefore: number) {
  if (process.platform === 'win32') {
    const expected = await readTestClaimFile(file);
    await windowsTestClaimFilesystem({
      command: 'delete-expired-lock',
      path: path.resolve(file),
      expected,
      expiredBefore,
    });
    return;
  }
  assertPrivateFile(file);
  const observed = lstatSync(file);
  if (observed.mtimeMs >= expiredBefore)
    throw Object.assign(new Error('Cleanup lock has not expired'), { code: 'EEXIST' });
  // Read opaquely: old, incomplete lock metadata does not determine eligibility.
  const expected = await readTestClaimFile(file);
  const currentContent = await readTestClaimFile(file);
  assertPrivateFile(file);
  const current = lstatSync(file);
  if (
    currentContent !== expected ||
    current.dev !== observed.dev ||
    current.ino !== observed.ino ||
    current.mtimeMs !== observed.mtimeMs ||
    current.ctimeMs !== observed.ctimeMs ||
    current.size !== observed.size
  ) {
    throw Object.assign(new Error('Cleanup lock changed during expiry inspection'), {
      code: 'EEXIST',
    });
  }
  // No async gap after the final check. POSIX still has no atomic compare-and-unlink:
  // TTL is a lifetime policy, not fencing against an arbitrarily paused cleaner.
  unlinkSync(file);
}

export async function acquireTestClaimCleanupLock(
  file: string,
  expiredBefore?: number,
): Promise<TestClaimFilesystemLock> {
  if (expiredBefore !== undefined && !Number.isFinite(expiredBefore))
    throw new TypeError('Invalid cleanup lock expiry cutoff');
  const token = randomBytes(24).toString('hex');
  const content = `${JSON.stringify({ pid: process.pid, hostname: os.hostname(), startTime: String(Date.now() - process.uptime() * 1000), token })}\n`;
  try {
    await createTestClaimFile(file, content);
  } catch (error) {
    if (expiredBefore === undefined || (error as NodeJS.ErrnoException).code !== 'EEXIST')
      throw error;
    await deleteExpiredCleanupLock(file, expiredBefore);
    // One exclusive retry only; never reclaim a contender's newly created lock.
    await createTestClaimFile(file, content);
  }
  let released = false;
  return {
    async release() {
      if (released) return;
      if (process.platform === 'win32') {
        await windowsTestClaimFilesystem({
          command: 'release-lock',
          path: path.resolve(file),
          expected: content,
        });
      } else {
        // Reject an observed replacement; POSIX read/unlink is not an atomic CAS.
        if ((await readTestClaimFile(file)) !== content)
          throw new Error('Test claim cleanup lock identity changed');
        await unlink(file);
      }
      released = true;
    },
  };
}
