import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  analyze,
  buildMessages,
  isCodeFile,
  isHighConfidenceReverseSource,
  normalizePath,
  resolveEdition,
  toPosixPath,
} from './core.mjs';

const STATE_FILE = path.join(os.tmpdir(), 'cabloy-contract-loop-gate-state.json');
const AUTO_SYNC_WINDOW_SECONDS = 300;

function readText(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state), 'utf8');
  } catch {
    // State prevents duplicate convenience syncs only; it must not block guidance.
  }
}

function syncFingerprint(filePath) {
  try {
    const stats = statSync(filePath, { bigint: true });
    return `${filePath}:${stats.mtimeNs.toString()}`;
  } catch {
    return filePath;
  }
}

function shouldSkipAutoSync(root, filePath) {
  const state = loadState();
  const entry = state[toPosixPath(root)];
  return Boolean(
    entry &&
    entry.fingerprint === syncFingerprint(filePath) &&
    Date.now() - entry.timestamp <= AUTO_SYNC_WINDOW_SECONDS * 1000,
  );
}

function markAutoSync(root, filePath) {
  const state = loadState();
  state[toPosixPath(root)] = { fingerprint: syncFingerprint(filePath), timestamp: Date.now() };
  saveState(state);
}

function runNpm(root, args) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(command, [...args], { cwd: root, encoding: 'utf8' });
}

function summarizeProcess(result) {
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

function autoSyncReverse(root, filePath, edition) {
  for (const command of edition.reverseAutoSyncCommands) {
    const result = runNpm(root, command.args);
    if (result.status !== 0) {
      return {
        kind: 'failure',
        message: `Auto-sync failed during \`${command.display}\`: ${summarizeProcess(result)}`,
      };
    }
  }
  markAutoSync(root, filePath);
  return {
    kind: 'success',
    message: `Auto-sync ran ${edition.reverseAutoSyncCommands
      .map(command => `\`${command.display}\``)
      .join(' and ')} for this ${edition.label} reverse-chain edit.`,
  };
}

export function resolveReverseSyncOutcome(root, filePath, reverseReason) {
  if (!reverseReason) return { kind: 'not-applicable', message: '' };
  if (!isHighConfidenceReverseSource(filePath)) {
    return {
      kind: 'not-applicable',
      message:
        'Auto-sync did not run because this reverse-chain signal came from the consumer side rather than a high-confidence frontend source edit.',
    };
  }
  const resolution = resolveEdition(root);
  if (resolution.kind !== 'resolved') {
    return {
      kind: 'not-applicable',
      message: `Auto-sync did not run because ${resolution.kind === 'ambiguous' ? 'both Cabloy edition markers are present' : 'no Cabloy edition marker is present'}.`,
    };
  }
  if (shouldSkipAutoSync(root, filePath)) {
    return {
      kind: 'skipped',
      message:
        'Auto-sync skipped because the same reverse-source edit was already synced recently in this repo.',
    };
  }
  return autoSyncReverse(root, filePath, resolution.edition);
}

export function readHookPayload() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return null;
  }
}

export function extractClaudeEditedFilePath(payload) {
  const filePath = payload?.tool_input?.file_path;
  return typeof filePath === 'string' && filePath ? filePath : null;
}

export function extractCodexEditedFilePaths(payload) {
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string') return [];
  const paths = new Set();
  const pattern = /^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$/gm;
  for (const match of command.matchAll(pattern)) {
    const filePath = match[1].trim();
    if (filePath) paths.add(filePath);
  }
  return [...paths];
}

export function extractCursorEditedFilePath(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (typeof payload.file_path === 'string' && payload.file_path) return payload.file_path;
  const input = payload.tool_input;
  if (!input || typeof input !== 'object') return null;
  for (const key of ['path', 'file_path', 'target_file']) {
    const value = input[key];
    if (typeof value === 'string' && value) return value;
  }
  return null;
}

export function inferCursorHookEvent(payload) {
  const eventName = payload?.hook_event_name;
  if (
    eventName === 'afterFileEdit' ||
    eventName === 'afterTabFileEdit' ||
    eventName === 'postToolUse'
  ) {
    return eventName;
  }
  if (typeof payload?.file_path === 'string' && payload.file_path && !payload.tool_name) {
    return 'afterFileEdit';
  }
  return 'postToolUse';
}

export function formatClaudeHookOutput(message) {
  return {
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
    systemMessage: message,
  };
}

export function formatCodexHookOutput(message) {
  return {
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
    systemMessage: message,
  };
}

export function formatCursorHookOutput(message, eventName) {
  if (eventName !== 'postToolUse') return null;
  return { additional_context: message };
}

function inspectEditedFile(root, rawPath) {
  const filePath = normalizePath(root, rawPath);
  if (!filePath || !isCodeFile(filePath)) return null;
  const content = readText(filePath);
  if (content === null) return null;
  const resolution = resolveEdition(root);
  const result = analyze(
    filePath,
    content,
    resolution.kind === 'resolved' ? resolution.edition : null,
  );
  if (!result.forwardReason && !result.reverseReason) return null;
  return { filePath, resolution, result };
}

export function evaluateEditedFile(root, rawPath) {
  const inspected = inspectEditedFile(root, rawPath);
  if (!inspected) return null;
  const { filePath, resolution, result } = inspected;
  const reverseSyncOutcome = resolveReverseSyncOutcome(root, filePath, result.reverseReason);
  return {
    filePath,
    message: buildMessages(result, resolution, reverseSyncOutcome),
  };
}

export function evaluateEditedFiles(root, rawPaths) {
  const seenPaths = new Set();
  const inspected = [];
  for (const rawPath of rawPaths) {
    const item = inspectEditedFile(root, rawPath);
    if (item && !seenPaths.has(item.filePath)) {
      seenPaths.add(item.filePath);
      inspected.push(item);
    }
  }

  const autoSyncItem = inspected.find(
    item => item.result.reverseReason && isHighConfidenceReverseSource(item.filePath),
  );
  const autoSyncOutcome = autoSyncItem
    ? resolveReverseSyncOutcome(root, autoSyncItem.filePath, autoSyncItem.result.reverseReason)
    : null;

  return inspected.map(item => {
    let reverseSyncOutcome;
    if (item === autoSyncItem) {
      reverseSyncOutcome = autoSyncOutcome;
    } else if (item.result.reverseReason && isHighConfidenceReverseSource(item.filePath)) {
      reverseSyncOutcome = {
        kind: 'skipped',
        message:
          'Auto-sync skipped because another high-confidence reverse-source file in this Codex edit was already handled.',
      };
    } else {
      reverseSyncOutcome = resolveReverseSyncOutcome(
        root,
        item.filePath,
        item.result.reverseReason,
      );
    }
    return {
      filePath: item.filePath,
      message: buildMessages(item.result, item.resolution, reverseSyncOutcome),
    };
  });
}
