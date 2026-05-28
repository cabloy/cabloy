import type { SpawnOptions } from 'node:child_process';

import spawn from 'cross-spawn';
import { createWriteStream } from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';

import { NPM_REGISTRY, PACKAGE_NAME } from './constants.ts';

const validNameRegex = /^(?:@[a-z0-9][-a-z0-9]*[a-z0-9]\/)?[a-z0-9][-a-z0-9]*[a-z0-9]$/;

export function isValidPackageName(name: string): boolean {
  return validNameRegex.test(name);
}

export function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

export async function fetchLatestTarballUrl(): Promise<string> {
  const url = `${NPM_REGISTRY}/${PACKAGE_NAME}/latest`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch package info: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { dist: { tarball: string } };
  return data.dist.tarball;
}

export async function downloadTarball(tarballUrl: string): Promise<string> {
  const tmpFile = join(tmpdir(), `create-cabloy-${Date.now()}.tgz`);
  const res = await fetch(tarballUrl);
  if (!res.ok) {
    throw new Error(`Failed to download tarball: ${res.status} ${res.statusText}`);
  }
  if (!res.body) {
    throw new Error('Failed to download tarball: empty response body');
  }
  await mkdir(dirname(tmpFile), { recursive: true });
  const fileStream = createWriteStream(tmpFile);
  // @ts-expect-error Node.js ReadableStream vs Web ReadableStream
  await pipeline(res.body, fileStream);
  return tmpFile;
}

export async function extractTarball(tarballPath: string, targetDir: string): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const exitCode = await spawnAsync('tar', [
    '--strip-components=1',
    '-xzf',
    tarballPath,
    '-C',
    targetDir,
  ]);
  if (exitCode !== 0) {
    throw new Error('Failed to extract tarball');
  }
}

export async function downloadAndExtract(targetDir: string): Promise<void> {
  const tarballUrl = await fetchLatestTarballUrl();
  const tarballPath = await downloadTarball(tarballUrl);
  try {
    await extractTarball(tarballPath, targetDir);
  } finally {
    await unlink(tarballPath).catch(() => {});
  }
}

export function spawnAsync(
  command: string,
  args: string[],
  options?: SpawnOptions,
): Promise<number | null> {
  return new Promise(resolve => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('close', code => {
      resolve(code);
    });
    child.on('error', () => {
      resolve(1);
    });
  });
}
