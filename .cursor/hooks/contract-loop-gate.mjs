#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  evaluateEditedFile,
  extractCursorEditedFilePath,
  formatCursorHookOutput,
  inferCursorHookEvent,
  readHookPayload,
} from '../../repo-agent-governance/tools/contract-loop/hook-runtime.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function runCursorHook() {
  const payload = readHookPayload();
  if (!payload) return 0;
  const evaluated = evaluateEditedFile(ROOT, extractCursorEditedFilePath(payload));
  if (!evaluated) return 0;
  const output = formatCursorHookOutput(evaluated.message, inferCursorHookEvent(payload));
  if (output) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(output));
  }
  return 0;
}

process.exit(runCursorHook());
