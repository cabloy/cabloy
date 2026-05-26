#!/usr/bin/env node

import { ProcessHelper } from '@cabloy/process-helper';
import semver from 'semver';

import { playAttach } from '../play.ts';
import { VonaCommand } from '../start.ts';

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
  // args
  let args: string[] = [];
  const rawArgv = process.argv.slice(2);
  const isPlay = rawArgv[0] === 'play';
  const isPlayAttach = isPlay && (rawArgv.includes('-a') || rawArgv.includes('--attach'));
  if (isPlay) {
    if (!isPlayAttach) {
      args = args.concat([':bin:play']);
    }
    args = args.concat(rawArgv.slice(1)).concat(['--dummy']);
  } else {
    args = rawArgv;
  }
  // run
  if (isPlayAttach) {
    await playAttach(process.cwd(), args);
  } else {
    if (!isPlay) {
      await checkPnpm();
    }
    new VonaCommand(args).start();
  }
}
