import { existsSync } from 'node:fs';
import path from 'node:path';

export const TARGET_PATTERNS = [
  ['zova/src/module/', '.ts'],
  ['zova/src/module/', '.tsx'],
  ['zova/src/module/', '.jsx'],
  ['zova/src/module-vendor/', '.ts'],
  ['zova/src/module-vendor/', '.tsx'],
  ['zova/src/module-vendor/', '.jsx'],
  ['zova/src/suite/', '.ts'],
  ['zova/src/suite/', '.tsx'],
  ['zova/src/suite/', '.jsx'],
  ['zova/src/suite-vendor/', '.ts'],
  ['zova/src/suite-vendor/', '.tsx'],
  ['zova/src/suite-vendor/', '.jsx'],
  ['vona/src/', '.ts'],
  ['vona/src/', '.tsx'],
  ['vona/src/', '.jsx'],
];

const FORWARD_PATH_MARKERS = ['/controller/', '/dto/', '/entity/'];
const FORWARD_CONTENT_MARKERS = ['@Web.', '@Api.field', '@Api.body', 'v.openapi(', '@Dto<'];
const SHARED_REVERSE_VONA_CONTENT_MARKERS = ['ZovaRender.', 'tableActionRow(', 'tableActionBulk('];
const REVERSE_ZOVA_PATH_MARKERS = ['/src/bean/', '/src/component/', '/src/.metadata/'];
const REVERSE_ZOVA_CONTENT_MARKERS = [
  "declare module 'zova-module-a-openapi'",
  'IResourceTableActionRowRecord',
  '@TableCell<',
  '@Component(',
  '@Component<',
];

export const REVERSE_AUTO_SYNC_COMMANDS = [
  { args: ['run', 'build:zova:admin'], display: 'npm run build:zova:admin' },
  { args: ['run', 'deps:vona'], display: 'npm run deps:vona' },
];

export const EDITION_CONFIGS = {
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

const FALLBACK_REVERSE_VONA_CONTENT_MARKERS = [
  ...SHARED_REVERSE_VONA_CONTENT_MARKERS,
  ...EDITION_CONFIGS.basic.reverseVonaContentMarkers,
  ...EDITION_CONFIGS.start.reverseVonaContentMarkers,
];

export function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

export function normalizePath(root, value) {
  if (!value) return null;
  try {
    const candidate = path.isAbsolute(value) ? value : path.join(root, value);
    return toPosixPath(path.resolve(candidate));
  } catch {
    return null;
  }
}

export function resolveEdition(root) {
  const hasBasic = existsSync(path.resolve(root, '__CABLOY_BASIC__'));
  const hasStart = existsSync(path.resolve(root, '__CABLOY_START__'));
  if (hasBasic && hasStart) return { kind: 'ambiguous' };
  if (!hasBasic && !hasStart) return { kind: 'missing' };
  return { kind: 'resolved', edition: hasBasic ? EDITION_CONFIGS.basic : EDITION_CONFIGS.start };
}

function containsAny(text, needles) {
  return needles.some(needle => text.includes(needle));
}

function pathContainsAny(filePath, needles) {
  return needles.some(needle => filePath.includes(needle));
}

function getReverseVonaContentMarkers(edition) {
  if (!edition) return FALLBACK_REVERSE_VONA_CONTENT_MARKERS;
  return [...SHARED_REVERSE_VONA_CONTENT_MARKERS, ...edition.reverseVonaContentMarkers];
}

export function isCodeFile(filePath) {
  return TARGET_PATTERNS.some(
    ([prefix, suffix]) => filePath.includes(prefix) && filePath.endsWith(suffix),
  );
}

function detectForwardPath(filePath) {
  if (filePath.includes('/vona/src/') && pathContainsAny(filePath, FORWARD_PATH_MARKERS)) {
    return 'Backend contract source may have changed.';
  }
  return null;
}

function detectForwardContent(filePath, content) {
  if (filePath.includes('/vona/src/') && containsAny(content, FORWARD_CONTENT_MARKERS)) {
    return 'Backend contract source may have changed.';
  }
  return null;
}

function detectReversePath(filePath) {
  if (filePath.includes('/zova/src/') && pathContainsAny(filePath, REVERSE_ZOVA_PATH_MARKERS)) {
    return 'Frontend-owned resources or metadata may affect backend consumers.';
  }
  return null;
}

function detectReverseContent(filePath, content, reverseVonaContentMarkers) {
  if (filePath.includes('/vona/src/') && containsAny(content, reverseVonaContentMarkers)) {
    return 'Vona code is consuming frontend metadata or render resources.';
  }
  if (filePath.includes('/zova/src/') && containsAny(content, REVERSE_ZOVA_CONTENT_MARKERS)) {
    return 'Frontend-owned resources or metadata may affect backend consumers.';
  }
  return null;
}

export function analyzePath(filePath) {
  return {
    forwardReason: detectForwardPath(filePath),
    reverseReason: detectReversePath(filePath),
  };
}

export function analyze(filePath, content, edition) {
  const pathResult = analyzePath(filePath);
  return {
    forwardReason: pathResult.forwardReason ?? detectForwardContent(filePath, content),
    reverseReason:
      pathResult.reverseReason ??
      detectReverseContent(filePath, content, getReverseVonaContentMarkers(edition)),
  };
}

export function hasSignal(result) {
  return Boolean(result.forwardReason || result.reverseReason);
}

export function isHighConfidenceReverseSource(filePath) {
  return filePath.includes('/zova/src/') && pathContainsAny(filePath, REVERSE_ZOVA_PATH_MARKERS);
}

export function buildReverseGuidance(resolution) {
  if (resolution.kind !== 'resolved') {
    const resolutionMessage =
      resolution.kind === 'ambiguous'
        ? 'Both Cabloy edition markers are present, so stop before choosing an edition-specific build or generated-output path.'
        : 'No Cabloy edition marker is present, so inspect the active package scripts and repository shape before choosing an edition-specific build or generated-output path.';
    return `If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable. ${resolutionMessage} Then run \`npm run deps:vona\` once the active edition is resolved.`;
  }
  const edition = resolution.edition;
  const autoSyncCommands = edition.reverseAutoSyncCommands
    .map(command => `\`${command.display}\``)
    .join(', then ');
  return `If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable, run ${autoSyncCommands}, and also run \`${edition.reverseWebBuildCommand}\` when the Web flavor is affected in this ${edition.label} repo.`;
}

export function buildMessages(
  result,
  resolution,
  reverseSyncOutcome = { kind: 'not-applicable', message: '' },
) {
  const messages = [
    "Contract-loop gate: this change may affect Cabloy's bidirectional contract loop.",
  ];
  if (resolution.kind === 'ambiguous') {
    messages.push(
      'Both Cabloy edition markers are present, so stop before choosing an edition-specific build, generated-output path, or auto-sync action.',
    );
  }
  if (result.forwardReason) {
    messages.push(
      `Forward chain: ${result.forwardReason} If backend contract truth changed, verify the emitted OpenAPI/contract output and regenerate the frontend consumer path before considering the task done.`,
    );
    messages.push(
      'After forward regeneration, keep frontend follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource.',
    );
  }
  if (result.reverseReason) {
    messages.push(`Reverse chain: ${result.reverseReason} ${buildReverseGuidance(resolution)}`);
    if (reverseSyncOutcome.message) messages.push(reverseSyncOutcome.message);
    if (reverseSyncOutcome.kind === 'failure') {
      messages.push(
        'Please review the failure before continuing. If generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before making more source edits.',
      );
    }
  }
  return messages.join(' ');
}
