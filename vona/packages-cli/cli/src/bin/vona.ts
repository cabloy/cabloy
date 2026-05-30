#!/usr/bin/env node

import { parseProjectPath } from '@cabloy/cli';
import { ProcessHelper } from '@cabloy/process-helper';
import mri from 'mri';
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
  const rawArgv = process.argv.slice(2);
  const _args = mri(rawArgv, {
    boolean: ['force', 'help', 'version'],
    alias: { h: 'help', v: 'version' },
  });
  const projectPath = parseProjectPath(_args.projectPath);
  // args
  let args: string[] = [];
  const isPlay = _args._[0] === 'play';
  const isPlayAttach = isPlay && (rawArgv.includes('-a') || rawArgv.includes('--attach'));
  if (isPlay) {
    if (!isPlayAttach) {
      args = args.concat([':bin:play']);
    }
    const indexPlay = rawArgv.indexOf('play');
    args = args.concat(rawArgv.slice(indexPlay + 1)).concat(['--dummy']);
    if (_args.projectPath) {
      args = [`--projectPath=${_args.projectPath}`].concat(args);
    }
  } else {
    args = rawArgv;
  }
  // run
  if (isPlayAttach) {
    await playAttach(projectPath, args);
  } else {
    if (!isPlay) {
      await checkPnpm();
    }
    new VonaCommand(args).start();
  }
}
