#!/usr/bin/env node

import { parseProjectPath } from '@cabloy/cli';
import mri from 'mri';

import { playAttach } from '../play.ts';
import { VonaCommand } from '../start.ts';

main();

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
    new VonaCommand(args).start();
  }
}
