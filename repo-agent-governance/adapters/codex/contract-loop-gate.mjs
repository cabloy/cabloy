#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  evaluateEditedFiles,
  extractCodexEditedFilePaths,
  formatCodexHookOutput,
  readHookPayload,
} from '../../repo-agent-governance/tools/contract-loop/hook-runtime.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function runCodexHook() {
  const payload = readHookPayload();
  if (!payload) return 0;
  const evaluated = evaluateEditedFiles(ROOT, extractCodexEditedFilePaths(payload));
  if (!evaluated.length) return 0;
  const message = evaluated.map(item => item.message).join('\n\n');
  // eslint-disable-next-line
  console.log(JSON.stringify(formatCodexHookOutput(message)));
  return 0;
}

process.exit(runCodexHook());
