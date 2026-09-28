#!/usr/bin/env node
import type { SpawnSyncReturns } from 'node:child_process';

import { spawnSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  analyze,
  buildMessages,
  isCodeFile,
  isHighConfidenceReverseSource,
  normalizePath,
  resolveEdition,
  toPosixPath,
} from '../../repo-agent-governance/tools/contract-loop/core.mjs';

interface EditionConfig {
  id: 'basic' | 'start';
  label: string;
  reverseAutoSyncCommands: ReadonlyArray<{ args: readonly string[]; display: string }>;
}

interface HookPayload {
  tool_input?: {
    file_path?: string;
  };
}

interface SyncStateEntry {
  fingerprint: string;
  timestamp: number;
}

type ReverseSyncOutcome =
  | { kind: 'not-applicable'; message: string }
  | { kind: 'skipped'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'failure'; message: string };

type SyncState = Record<string, SyncStateEntry>;

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_FILE), '../..');
const ROOT_KEY = toPosixPath(ROOT);
const STATE_FILE = path.join(os.tmpdir(), 'cabloy-contract-loop-gate-state.json');
const AUTO_SYNC_WINDOW_SECONDS = 300;

function readText(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function loadState(): SyncState {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8')) as SyncState;
  } catch {
    return {};
  }
}

function saveState(state: SyncState): void {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state), 'utf8');
  } catch {
    // State prevents duplicate convenience syncs only; it must not block guidance.
  }
}

function syncFingerprint(filePath: string): string {
  try {
    const stats = statSync(filePath, { bigint: true });
    return `${filePath}:${stats.mtimeNs.toString()}`;
  } catch {
    return filePath;
  }
}

function shouldSkipAutoSync(filePath: string): boolean {
  const state = loadState();
  const entry = state[ROOT_KEY];
  return Boolean(
    entry &&
    entry.fingerprint === syncFingerprint(filePath) &&
    Date.now() - entry.timestamp <= AUTO_SYNC_WINDOW_SECONDS * 1000,
  );
}

function markAutoSync(filePath: string): void {
  const state = loadState();
  state[ROOT_KEY] = { fingerprint: syncFingerprint(filePath), timestamp: Date.now() };
  saveState(state);
}

function runNpm(args: readonly string[]): SpawnSyncReturns<string> {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(command, [...args], { cwd: ROOT, encoding: 'utf8' });
}

function summarizeProcess(result: SpawnSyncReturns<string>): string {
  if (result.error) return result.error.message;
  const combined = [result.stdout?.trim(), result.stderr?.trim()].filter(Boolean).join('\n');
  const exitCode = result.status ?? 1;
  if (!combined) return `command exited with code ${exitCode}`;
  return `exit ${exitCode}: ${combined
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(-3)
    .join(' | ')}`;
}

function autoSyncReverse(filePath: string, edition: EditionConfig): ReverseSyncOutcome {
  for (const command of edition.reverseAutoSyncCommands) {
    const result = runNpm(command.args);
    if (result.status !== 0) {
      return {
        kind: 'failure',
        message: `Auto-sync failed during \`${command.display}\`: ${summarizeProcess(result)}`,
      };
    }
  }
  markAutoSync(filePath);
  return {
    kind: 'success',
    message: `Auto-sync ran ${edition.reverseAutoSyncCommands
      .map(command => `\`${command.display}\``)
      .join(' and ')} for this ${edition.label} reverse-chain edit.`,
  };
}

function resolveReverseSyncOutcome(
  filePath: string,
  reverseReason: string | null,
): ReverseSyncOutcome {
  if (!reverseReason) return { kind: 'not-applicable', message: '' };
  if (!isHighConfidenceReverseSource(filePath)) {
    return {
      kind: 'not-applicable',
      message:
        'Auto-sync did not run because this reverse-chain signal came from the consumer side rather than a high-confidence frontend source edit.',
    };
  }
  const resolution = resolveEdition(ROOT);
  if (resolution.kind !== 'resolved') {
    return {
      kind: 'not-applicable',
      message: `Auto-sync did not run because ${resolution.kind === 'ambiguous' ? 'both Cabloy edition markers are present' : 'no Cabloy edition marker is present'}.`,
    };
  }
  if (shouldSkipAutoSync(filePath)) {
    return {
      kind: 'skipped',
      message:
        'Auto-sync skipped because the same reverse-source edit was already synced recently in this repo.',
    };
  }
  return autoSyncReverse(filePath, resolution.edition);
}

function runClaudeHook(): number {
  let payload: HookPayload;
  try {
    payload = JSON.parse(readFileSync(0, 'utf8')) as HookPayload;
  } catch {
    return 0;
  }
  const filePath = normalizePath(ROOT, payload.tool_input?.file_path);
  if (!filePath || !isCodeFile(filePath)) return 0;
  const content = readText(filePath);
  if (content === null) return 0;

  const resolution = resolveEdition(ROOT);
  const result = analyze(
    filePath,
    content,
    resolution.kind === 'resolved' ? resolution.edition : null,
  );
  if (!result.forwardReason && !result.reverseReason) return 0;

  const reverseSyncOutcome = resolveReverseSyncOutcome(filePath, result.reverseReason);
  const message = buildMessages(result, resolution, reverseSyncOutcome);
  // eslint-disable-next-line
  console.log(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
      systemMessage: message,
    }),
  );
  return 0;
}

process.exit(runClaudeHook());
