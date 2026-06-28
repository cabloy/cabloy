#!/usr/bin/env node
import { readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface HookPayload {
  tool_input?: {
    file_path?: string;
  };
}

interface AnalysisResult {
  forwardReason: string | null;
  reverseReason: string | null;
}

interface SyncStateEntry {
  fingerprint: string;
  timestamp: number;
}

type SyncState = Record<string, SyncStateEntry>;

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_FILE), '../..');
const ROOT_KEY = toPosixPath(ROOT);
const STATE_FILE = path.join(os.tmpdir(), 'cabloy-contract-loop-gate-state.json');
const AUTO_SYNC_WINDOW_SECONDS = 300;

const TARGET_PATTERNS: Array<readonly [string, string]> = [
  ['zova/src/module/', '.ts'],
  ['zova/src/module/', '.tsx'],
  ['zova/src/module/', '.jsx'],
  ['zova/src/suite/', '.ts'],
  ['zova/src/suite/', '.tsx'],
  ['zova/src/suite/', '.jsx'],
  ['vona/src/', '.ts'],
  ['vona/src/', '.tsx'],
  ['vona/src/', '.jsx'],
];

const FORWARD_PATH_MARKERS = ['/controller/', '/dto/', '/entity/'];

const FORWARD_CONTENT_MARKERS = ['@Web.', '@Api.field', '@Api.body', 'v.openapi(', '@Dto<'];

const REVERSE_VONA_CONTENT_MARKERS = [
  'zova-rest-cabloy-basic-admin',
  'ZovaRender.',
  'tableActionRow(',
  'tableActionBulk(',
  'ZovaRender.field(',
  'ZovaRender.cell(',
];

const REVERSE_ZOVA_PATH_MARKERS = ['/src/bean/', '/src/component/', '/src/.metadata/'];

const REVERSE_ZOVA_CONTENT_MARKERS = [
  "declare module 'zova-module-a-openapi'",
  'IResourceTableActionRowRecord',
  '@TableCell<',
  '@Component(',
  '@Component<',
];

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function normalizePath(value?: string): string | null {
  if (!value) return null;
  try {
    const candidate = path.isAbsolute(value) ? value : path.join(ROOT, value);
    return toPosixPath(path.resolve(candidate));
  } catch {
    return null;
  }
}

function isCodeFile(filePath: string): boolean {
  return TARGET_PATTERNS.some(([prefix, suffix]) => filePath.includes(prefix) && filePath.endsWith(suffix));
}

function containsAny(text: string, needles: readonly string[]): boolean {
  return needles.some(needle => text.includes(needle));
}

function pathContainsAny(filePath: string, needles: readonly string[]): boolean {
  return needles.some(needle => filePath.includes(needle));
}

function detectForward(filePath: string, content: string): string | null {
  if (!filePath.includes('/vona/src/')) return null;
  if (pathContainsAny(filePath, FORWARD_PATH_MARKERS) || containsAny(content, FORWARD_CONTENT_MARKERS)) {
    return 'Backend contract source may have changed.';
  }
  return null;
}

function detectReverse(filePath: string, content: string): string | null {
  if (filePath.includes('/vona/src/') && containsAny(content, REVERSE_VONA_CONTENT_MARKERS)) {
    return 'Vona code is consuming frontend metadata or render resources.';
  }
  if (
    filePath.includes('/zova/src/') &&
    (pathContainsAny(filePath, REVERSE_ZOVA_PATH_MARKERS) ||
      containsAny(content, REVERSE_ZOVA_CONTENT_MARKERS))
  ) {
    return 'Frontend-owned resources or metadata may affect backend consumers.';
  }
  return null;
}

function analyze(filePath: string, content: string): AnalysisResult {
  return {
    forwardReason: detectForward(filePath, content),
    reverseReason: detectReverse(filePath, content),
  };
}

function hasSignal(result: AnalysisResult): boolean {
  return Boolean(result.forwardReason || result.reverseReason);
}

function isHighConfidenceReverseSource(filePath: string): boolean {
  return filePath.includes('/zova/src/') && pathContainsAny(filePath, REVERSE_ZOVA_PATH_MARKERS);
}

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
    // ignore state persistence failures
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
  const fingerprint = syncFingerprint(filePath);
  const entry = state[ROOT_KEY];
  if (!entry) return false;
  if (entry.fingerprint !== fingerprint) return false;
  if (Date.now() - entry.timestamp > AUTO_SYNC_WINDOW_SECONDS * 1000) return false;
  return true;
}

function markAutoSync(filePath: string): void {
  const state = loadState();
  state[ROOT_KEY] = {
    fingerprint: syncFingerprint(filePath),
    timestamp: Date.now(),
  };
  saveState(state);
}

function runNpm(args: string[]): SpawnSyncReturns<string> {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

function summarizeProcess(result: SpawnSyncReturns<string>): string {
  if (result.error) {
    return result.error.message;
  }
  const combined = [result.stdout?.trim(), result.stderr?.trim()].filter(Boolean).join('\n');
  const exitCode = result.status ?? 1;
  if (!combined) {
    return `command exited with code ${exitCode}`;
  }
  const lines = combined
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const tail = lines.slice(-3).join(' | ');
  return `exit ${exitCode}: ${tail}`;
}

function autoSyncReverse(filePath: string): readonly [boolean, string] {
  const buildResult = runNpm(['run', 'build:zova:admin']);
  if (buildResult.status !== 0) {
    return [false, `Auto-sync failed during \`npm run build:zova:admin\`: ${summarizeProcess(buildResult)}`];
  }

  const depsResult = runNpm(['run', 'deps:vona']);
  if (depsResult.status !== 0) {
    return [false, `Auto-sync failed during \`npm run deps:vona\`: ${summarizeProcess(depsResult)}`];
  }

  markAutoSync(filePath);
  return [true, 'Auto-sync ran `npm run build:zova:admin` and `npm run deps:vona` for this reverse-chain edit.'];
}

function buildMessages(filePath: string, result: AnalysisResult): string {
  const messages = ["Contract-loop gate: this change may affect Cabloy's bidirectional contract loop."];

  if (result.forwardReason) {
    messages.push(
      `Forward chain: ${result.forwardReason} If backend contract truth changed, verify the emitted OpenAPI/contract output and regenerate the frontend consumer path before considering the task done.`,
    );
    messages.push(
      'After forward regeneration, keep frontend follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource.',
    );
  }

  if (result.reverseReason) {
    messages.push(
      `Reverse chain: ${result.reverseReason} If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable, run the relevant Zova build first, and then run \`npm run deps:vona\` for the Cabloy Basic path. Use \`npm run build:zova:admin\` for Admin changes, and also run \`npm run build:zova:web\` when the Web flavor is affected.`,
    );
    if (isHighConfidenceReverseSource(filePath)) {
      if (shouldSkipAutoSync(filePath)) {
        messages.push('Auto-sync skipped because the same reverse-source edit was already synced recently in this repo.');
      } else {
        const [ok, detail] = autoSyncReverse(filePath);
        messages.push(detail);
        if (!ok) {
          messages.push(
            'Please review the failure before continuing. If generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before making more source edits.',
          );
          return messages.join(' ');
        }
      }
    } else {
      messages.push(
        'Auto-sync did not run because this reverse-chain signal came from the consumer side rather than a high-confidence frontend source edit.',
      );
    }
    messages.push(
      'For Cabloy Start, apply the same reverse-chain logic but resolve the Start-specific flavor names and generated-output paths from the active Start repo before executing edition-specific steps.',
    );
  }

  return messages.join(' ');
}

function runClaudeHook(): number {
  let payload: HookPayload;
  try {
    const raw = readFileSync(0, 'utf8');
    payload = JSON.parse(raw) as HookPayload;
  } catch {
    return 0;
  }

  const filePath = normalizePath(payload.tool_input?.file_path);
  if (!filePath || !isCodeFile(filePath)) return 0;

  const content = readText(filePath);
  if (content === null) return 0;

  const result = analyze(filePath, content);
  if (!hasSignal(result)) return 0;

  const message = buildMessages(filePath, result);
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: message,
      },
      systemMessage: message,
    }),
  );
  return 0;
}

process.exit(runClaudeHook());
