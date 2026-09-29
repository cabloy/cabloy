#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  evaluateEditedFile,
  extractClaudeEditedFilePath,
  formatClaudeHookOutput,
  readHookPayload,
} from '../../repo-agent-governance/tools/contract-loop/hook-runtime.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function runClaudeHook(): number {
  // Cursor can import this Claude-compatible bridge alongside its native hook. Its native
  // Cursor adapter owns that event, so avoid duplicate context and reverse auto-sync work.
  if (process.env.CURSOR_PROJECT_DIR) return 0;
  const payload = readHookPayload();
  if (!payload) return 0;
  const evaluated = evaluateEditedFile(ROOT, extractClaudeEditedFilePath(payload));
  if (!evaluated) return 0;
  // eslint-disable-next-line
  console.log(JSON.stringify(formatClaudeHookOutput(evaluated.message)));
  return 0;
}

process.exit(runClaudeHook());
