#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
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

interface CommandPlan {
  args: readonly string[];
  display: string;
}

interface EditionConfig {
  id: 'basic' | 'start';
  label: string;
  reverseVonaContentMarkers: readonly string[];
  reverseAutoSyncCommands: readonly CommandPlan[];
  reverseWebBuildCommand: string;
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

const SHARED_REVERSE_VONA_CONTENT_MARKERS = [
  'ZovaRender.',
  'tableActionRow(',
  'tableActionBulk(',
];

const REVERSE_ZOVA_PATH_MARKERS = ['/src/bean/', '/src/component/', '/src/.metadata/'];

const REVERSE_ZOVA_CONTENT_MARKERS = [
  "declare module 'zova-module-a-openapi'",
  'IResourceTableActionRowRecord',
  '@TableCell<',
  '@Component(',
  '@Component<',
];

const REVERSE_AUTO_SYNC_COMMANDS: readonly CommandPlan[] = [
  { args: ['run', 'build:zova:admin'], display: 'npm run build:zova:admin' },
  { args: ['run', 'deps:vona'], display: 'npm run deps:vona' },
];

const EDITION_CONFIGS: Record<'basic' | 'start', EditionConfig> = {
  basic: {
    id: 'basic',
    label: 'Cabloy Basic',
    reverseVonaContentMarkers: ['zova-rest-cabloy-basic-admin'],
    reverseAutoSyncCommands: REVERSE_AUTO_SYNC_COMMANDS,
    reverseWebBuildCommand: 'npm run build:zova:web',
  },
  start: {
    id: 'start',
    label: 'Cabloy Start',
    reverseVonaContentMarkers: ['zova-rest-cabloy-start-admin'],
    reverseAutoSyncCommands: REVERSE_AUTO_SYNC_COMMANDS,
    reverseWebBuildCommand: 'npm run build:zova:web',
  },
};

const ACTIVE_EDITION = resolveEdition();
const FALLBACK_REVERSE_VONA_CONTENT_MARKERS = [
  ...SHARED_REVERSE_VONA_CONTENT_MARKERS,
  ...EDITION_CONFIGS.basic.reverseVonaContentMarkers,
  ...EDITION_CONFIGS.start.reverseVonaContentMarkers,
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

function resolveEdition(): EditionConfig | null {
  if (existsSync(path.resolve(ROOT, '__CABLOY_BASIC__'))) {
    return EDITION_CONFIGS.basic;
  }
  if (existsSync(path.resolve(ROOT, '__CABLOY_START__'))) {
    return EDITION_CONFIGS.start;
  }
  return null;
}

function getReverseVonaContentMarkers(edition: EditionConfig | null): readonly string[] {
  if (!edition) return FALLBACK_REVERSE_VONA_CONTENT_MARKERS;
  return [...SHARED_REVERSE_VONA_CONTENT_MARKERS, ...edition.reverseVonaContentMarkers];
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

function detectReverse(
  filePath: string,
  content: string,
  reverseVonaContentMarkers: readonly string[],
): string | null {
  if (filePath.includes('/vona/src/') && containsAny(content, reverseVonaContentMarkers)) {
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

function analyze(filePath: string, content: string, edition: EditionConfig | null): AnalysisResult {
  return {
    forwardReason: detectForward(filePath, content),
    reverseReason: detectReverse(filePath, content, getReverseVonaContentMarkers(edition)),
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

function runNpm(args: readonly string[]): SpawnSyncReturns<string> {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawnSync(command, [...args], {
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
  const commands = edition.reverseAutoSyncCommands.map(command => `\`${command.display}\``).join(' and ');
  return {
    kind: 'success',
    message: `Auto-sync ran ${commands} for this ${edition.label} reverse-chain edit.`,
  };
}

function buildReverseGuidance(edition: EditionConfig | null): string {
  if (!edition) {
    return 'If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable, resolve the active Cabloy edition marker before choosing the relevant Zova build and generated-output path, and then run `npm run deps:vona`.';
  }

  const autoSyncCommands = edition.reverseAutoSyncCommands
    .map(command => `\`${command.display}\``)
    .join(', then ');
  return `If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable, run ${autoSyncCommands}, and also run \`${edition.reverseWebBuildCommand}\` when the Web flavor is affected in this ${edition.label} repo.`;
}

function resolveReverseSyncOutcome(
  filePath: string,
  result: AnalysisResult,
  edition: EditionConfig | null,
): ReverseSyncOutcome {
  if (!result.reverseReason) {
    return {
      kind: 'not-applicable',
      message: '',
    };
  }

  if (!isHighConfidenceReverseSource(filePath)) {
    return {
      kind: 'not-applicable',
      message:
        'Auto-sync did not run because this reverse-chain signal came from the consumer side rather than a high-confidence frontend source edit.',
    };
  }

  if (shouldSkipAutoSync(filePath)) {
    return {
      kind: 'skipped',
      message: 'Auto-sync skipped because the same reverse-source edit was already synced recently in this repo.',
    };
  }

  if (!edition) {
    return {
      kind: 'not-applicable',
      message:
        'Auto-sync did not run because the active Cabloy edition marker could not be resolved for this repo.',
    };
  }

  return autoSyncReverse(filePath, edition);
}

function buildMessages(
  result: AnalysisResult,
  edition: EditionConfig | null,
  reverseSyncOutcome: ReverseSyncOutcome,
): string {
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
    messages.push(`Reverse chain: ${result.reverseReason} ${buildReverseGuidance(edition)}`);
    if (reverseSyncOutcome.message) {
      messages.push(reverseSyncOutcome.message);
    }
    if (reverseSyncOutcome.kind === 'failure') {
      messages.push(
        'Please review the failure before continuing. If generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before making more source edits.',
      );
    }
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

  const result = analyze(filePath, content, ACTIVE_EDITION);
  if (!hasSignal(result)) return 0;

  const reverseSyncOutcome = resolveReverseSyncOutcome(filePath, result, ACTIVE_EDITION);
  const message = buildMessages(result, ACTIVE_EDITION, reverseSyncOutcome);
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
