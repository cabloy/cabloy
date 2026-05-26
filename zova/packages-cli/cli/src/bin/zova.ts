#!/usr/bin/env node

import { ProcessHelper } from '@cabloy/process-helper';
import semver from 'semver';

import { ZovaCommand } from '../start.ts';

const pnpm_version = '10.19.0';

const processHelper = new ProcessHelper(process.cwd());

main();

async function checkPnpm() {
  const res = await processHelper.spawnCmd({
    cmd: 'pnpm',
    args: ['--version'],
    options: {
      stdio: 'pipe',
      shell: true,
      dummy: true,
    },
  });
  const version = res.trimEnd();
  const lt = semver.lt(version, pnpm_version);
  if (lt) {
    throw new Error(`pnpm should >= ${pnpm_version}, current: ${version}`);
  }
}

async function main() {
  await checkPnpm();
  new ZovaCommand().start();
}
