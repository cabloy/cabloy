import { spawnSync } from 'node:child_process';
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';

import { sha256 } from './core.mjs';

export function baselinePath(root, edition, suite) {
  const env = { ...process.env };
  delete env.GIT_DIR;
  delete env.GIT_WORK_TREE;
  delete env.GIT_COMMON_DIR;
  const result = spawnSync('git', ['rev-parse', '--show-toplevel', '--absolute-git-dir'], {
    cwd: root,
    env,
    encoding: 'utf8',
  });
  const [worktree, gitDir] = result.stdout?.trimEnd().split(/\r?\n/) ?? [];
  if (result.status !== 0 || !worktree || !gitDir || realpathSync(worktree) !== realpathSync(root))
    throw new Error('suite import requires a Git worktree at the destination project root');
  return resolve(gitDir, 'cabloy-suite-import', `${edition}-${suite}.snapshot`);
}

function checkStateDirectory(directory) {
  const stat = lstatSync(directory, { throwIfNoEntry: false });
  if (stat && !stat.isDirectory()) throw new Error('suite import state is not a directory');
  return Boolean(stat);
}

export function readBaseline(path) {
  if (!checkStateDirectory(dirname(path))) return null;
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat) return null;
  if (!stat.isFile()) throw new Error('suite import baseline is not a regular file');
  // One atomic record keeps the SHA-256 and the original ZIP bytes together.
  const record = readFileSync(path);
  const checksum = record.subarray(0, 64).toString('ascii');
  const buffer = record.subarray(65);
  if (record[64] !== 10 || !/^[a-f0-9]{64}$/.test(checksum) || sha256(buffer) !== checksum)
    throw new Error('saved suite import baseline failed checksum validation');
  return { buffer, checksum };
}

export function withBaselineUpdate(path, previousChecksum, incoming, apply) {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  checkStateDirectory(directory);
  const lock = resolve(directory, 'apply.lock');
  try {
    mkdirSync(lock, { mode: 0o700 });
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error('another suite import is active or left an apply lock');
    throw error;
  }
  try {
    if ((readBaseline(path)?.checksum ?? null) !== previousChecksum)
      throw new Error('suite import baseline changed after planning; run a new dry run');
    const staged = resolve(lock, 'incoming.snapshot');
    writeFileSync(staged, `${incoming.checksum}\n`, { flag: 'wx', mode: 0o600 });
    writeFileSync(staged, incoming.buffer, { flag: 'a', flush: true });
    apply(() => renameSync(staged, path));
  } finally {
    try {
      rmSync(lock, { recursive: true });
    } catch (error) {
      process.emitWarning(`Could not clean up suite import apply lock: ${error.code}`);
    }
  }
}
