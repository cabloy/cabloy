import { randomBytes } from 'node:crypto';
import { constants, lstatSync } from 'node:fs';
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
    if (typeof value.content !== 'string') throw new Error('Invalid test claim file response');
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
export async function acquireTestClaimCleanupLock(file: string): Promise<TestClaimFilesystemLock> {
  const token = randomBytes(24).toString('hex');
  const content = `${JSON.stringify({ pid: process.pid, hostname: os.hostname(), startTime: String(Date.now() - process.uptime() * 1000), token })}\n`;
  // Existence, never age, is the ownership gate. A crash leaves the lock for inspection.
  await createTestClaimFile(file, content);
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
        // Exact serialized token-bearing identity; never remove a replacement lock.
        if ((await readTestClaimFile(file)) !== content)
          throw new Error('Test claim cleanup lock identity changed');
        await unlink(file);
      }
      released = true;
    },
  };
}
