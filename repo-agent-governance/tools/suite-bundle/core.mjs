import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import { derivePostImportTasks, requiredCommandsForTasks } from './tasks.mjs';

export const ROOT_DIR = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
export const BUNDLE_DIR = '.cabloy-suite';
export const BUNDLE_VERSION = 3;
export const MAX_ENTRIES = 10_000;
export const MAX_FILE_BYTES = 64 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 256 * 1024 * 1024;

const FORBIDDEN_SEGMENTS = new Set([
  '.git',
  '.vona',
  '.zova',
  'node_modules',
  'dist',
  'dist-releases',
  'coverage',
  'test-results',
  'trace',
  '.zova-rest',
]);
const FORBIDDEN_NAMES =
  /^(?:\.env(?:\..*)?|.*\.local|pnpm-lock\.yaml|package-lock\.json|yarn\.lock|.*\.(?:db|sqlite|sqlite3|zip|tar|tgz|log|tsbuildinfo))$/;
const GENERATED_NAMES =
  /(?:^|\/)(?:package\.original\.json|package\.json\.generated|\.metadata|\.zova-rest|dist(?:-releases)?|src\/(?:api|apiMeta|apiSchema)|implementation-(?:gantt|burndown)\.svg$)(?:\/|$)/i;

export function posixPath(value) {
  return value.replaceAll('\\', '/');
}

export function safeRelativePath(value, label = 'path') {
  if (typeof value !== 'string' || !value || isAbsolute(value)) {
    throw new Error(`${label} must be a non-empty relative path`);
  }
  const normalized = posixPath(value);
  const parts = normalized.split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) {
    throw new Error(`${label} contains an unsafe segment: ${value}`);
  }
  if (/^[A-Z]:\//i.test(normalized)) {
    throw new Error(`${label} must not be an absolute Windows path: ${value}`);
  }
  return normalized;
}

export function assertInside(root, candidate, label = 'path') {
  const rootPath = resolve(root);
  const candidatePath = resolve(candidate);
  const escaped = relative(rootPath, candidatePath);
  if (escaped === '..' || escaped.startsWith(`..${sep}`) || isAbsolute(escaped)) {
    throw new Error(`${label} escapes the permitted root`);
  }
  return candidatePath;
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function detectEdition(root = ROOT_DIR) {
  const basic = existsSync(resolve(root, '__CABLOY_BASIC__'));
  const start = existsSync(resolve(root, '__CABLOY_START__'));
  if (basic && start) return { kind: 'ambiguous' };
  if (start) return { kind: 'resolved', edition: 'start' };
  if (basic) return { kind: 'resolved', edition: 'basic' };
  return { kind: 'missing' };
}

export function requireEdition(root = ROOT_DIR) {
  const edition = detectEdition(root);
  if (edition.kind !== 'resolved') {
    throw new Error(
      edition.kind === 'ambiguous'
        ? 'Both Cabloy edition markers are present; the project edition is ambiguous.'
        : 'No Cabloy edition marker is present; the project edition cannot be determined.',
    );
  }
  return edition.edition;
}

export function requireStartEdition(root = ROOT_DIR) {
  const edition = requireEdition(root);
  if (edition !== 'start') throw new Error('This operation requires a Cabloy Start project.');
  return edition;
}

export function suiteSegment(suite) {
  const value = safeRelativePath(suite, 'suite');
  if (value.includes('/')) throw new Error('suite must be one suite directory name');
  if (!/^[a-z][a-z0-9-]*$/.test(value)) throw new Error(`invalid suite name: ${suite}`);
  return value;
}

function isExcluded(relativePath) {
  const normalized = posixPath(relativePath);
  if (GENERATED_NAMES.test(normalized)) return true;
  return normalized
    .toLowerCase()
    .split('/')
    .some(
      segment =>
        segment === '.ds_store' ||
        FORBIDDEN_NAMES.test(segment) ||
        FORBIDDEN_SEGMENTS.has(segment) ||
        segment.startsWith('.cabloy-suite-import-'),
    );
}

export function listAuthoredFiles(root, directory, prefix) {
  const files = [];
  if (!existsSync(directory)) return files;
  const walk = (current, currentPrefix) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const absolute = resolve(current, entry.name);
      const path = `${currentPrefix}/${entry.name}`;
      if (isExcluded(path)) continue;
      const stat = lstatSync(absolute);
      if (stat.isSymbolicLink())
        throw new Error(`symlinks are not allowed in suite bundles: ${path}`);
      if (entry.isDirectory()) {
        walk(absolute, path);
      } else if (entry.isFile()) {
        if (stat.size > MAX_FILE_BYTES) throw new Error(`file exceeds bundle limit: ${path}`);
        files.push({ path, data: readFileSync(absolute) });
      } else {
        throw new Error(`unsupported filesystem entry in suite bundle: ${path}`);
      }
    }
  };
  walk(directory, prefix);
  return files;
}

function resourceKind(path, suite) {
  if (path.startsWith(`repo-specs/${suite}/`)) return 'specification';
  if (path.startsWith('repo-e2e/')) return 'e2e';
  if (path.endsWith('/package.json')) return 'manifest';
  return 'source';
}

function isText(data, path) {
  if (/\.(?:png|jpe?g|gif|webp|ico|pdf|woff2?|ttf|eot|zip|gz|wasm|bin)$/i.test(path)) return false;
  return !data.includes(0);
}

function readJsonIfPresent(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    throw new Error(`invalid JSON package manifest: ${path}`);
  }
}

export function collectSuiteResources(root, suite, includes = {}) {
  const suiteName = suiteSegment(suite);
  const resources = [];
  for (const [prefix, directory] of [
    [`vona/src/suite/${suiteName}`, resolve(root, `vona/src/suite/${suiteName}`)],
    [`zova/src/suite/${suiteName}`, resolve(root, `zova/src/suite/${suiteName}`)],
  ]) {
    for (const file of listAuthoredFiles(root, directory, prefix)) {
      resources.push({
        path: file.path,
        data: file.data,
        kind: resourceKind(file.path, suiteName),
        ownership: 'suite',
      });
    }
  }

  const defaultSpecRoot = `repo-specs/${suiteName}`;
  const specPaths = includes.specs?.length
    ? includes.specs
    : existsSync(resolve(root, defaultSpecRoot))
      ? [defaultSpecRoot]
      : [];
  for (const requested of specPaths)
    resources.push(...collectDeclared(root, requested, suiteName, 'specification'));
  for (const requested of includes.e2e ?? [])
    resources.push(...collectDeclared(root, requested, suiteName, 'e2e'));

  const unique = new Map();
  for (const item of resources) {
    if (unique.has(item.path)) throw new Error(`duplicate selected resource: ${item.path}`);
    unique.set(item.path, item);
  }
  return [...unique.values()].toSorted((a, b) => a.path.localeCompare(b.path));
}

function collectDeclared(root, requested, suite, kind) {
  const relativeRequested = safeRelativePath(requested, `${kind} path`);
  if (isExcluded(relativeRequested)) throw new Error(`excluded ${kind} path: ${relativeRequested}`);
  const allowed =
    kind === 'specification'
      ? relativeRequested === `repo-specs/${suite}` ||
        relativeRequested.startsWith(`repo-specs/${suite}/`)
      : relativeRequested.startsWith('repo-e2e/specs/') ||
        relativeRequested.startsWith('repo-e2e/specs/helpers/');
  if (!allowed)
    throw new Error(`${kind} path is outside the permitted suite resource roots: ${requested}`);
  const absolute = assertInside(root, resolve(root, relativeRequested), `${kind} path`);
  if (!existsSync(absolute)) throw new Error(`${kind} path does not exist: ${relativeRequested}`);
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink()) throw new Error(`symlinks are not allowed: ${relativeRequested}`);
  if (stat.isDirectory()) {
    return listAuthoredFiles(root, absolute, relativeRequested).map(file => ({
      ...file,
      kind,
      ownership: 'declared',
    }));
  }
  if (!stat.isFile()) throw new Error(`unsupported ${kind} entry: ${relativeRequested}`);
  return [{ path: relativeRequested, data: readFileSync(absolute), kind, ownership: 'declared' }];
}

export function packageMetadata(root, suite) {
  const result = [];
  for (const side of ['vona', 'zova']) {
    const suitePath = resolve(root, `${side}/src/suite/${suite}/package.json`);
    const suitePackage = readJsonIfPresent(suitePath);
    if (suitePackage)
      result.push({ path: `${side}/src/suite/${suite}/package.json`, package: suitePackage });
    const moduleRoot = resolve(root, `${side}/src/suite/${suite}/modules`);
    if (!existsSync(moduleRoot)) continue;
    for (const entry of readdirSync(moduleRoot, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (!entry.isDirectory()) continue;
      const path = resolve(moduleRoot, entry.name, 'package.json');
      const value = readJsonIfPresent(path);
      if (value) {
        result.push({
          path: `${side}/src/suite/${suite}/modules/${entry.name}/package.json`,
          package: value,
        });
      }
    }
  }
  return result;
}

function gitSource(root, edition) {
  const revision = spawnSync('git', ['rev-parse', '--short=12', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  });
  const dirty = spawnSync('git', ['status', '--porcelain=v1'], { cwd: root, encoding: 'utf8' });
  return {
    repository: `cabloy-${edition}`,
    commit: revision.status === 0 ? revision.stdout.trim() : null,
    dirty: dirty.status === 0 ? Boolean(dirty.stdout.trim()) : null,
  };
}

export function buildBundleModel(root, suite, includes = {}) {
  const edition = requireEdition(root);
  const suiteName = suiteSegment(suite);
  const resources = collectSuiteResources(root, suiteName, includes);
  if (!resources.length) throw new Error(`no authored resources found for suite: ${suiteName}`);
  const metadata = packageMetadata(root, suiteName);
  const manifestResources = resources.map(item => ({
    path: item.path,
    kind: item.kind,
    ownership: item.ownership,
    encoding: isText(item.data, item.path) ? 'utf8' : 'binary',
    operation: 'upsert',
    payloadPath: `${BUNDLE_DIR}/payload/${item.path}`,
  }));
  const postImportTasks = derivePostImportTasks({
    root,
    suite: suiteName,
    edition,
    resources,
  });
  const manifest = {
    schemaVersion: BUNDLE_VERSION,
    kind: 'cabloy-suite-bundle',
    edition,
    suite: {
      id: suiteName,
      backendPath: `vona/src/suite/${suiteName}`,
      frontendPath: `zova/src/suite/${suiteName}`,
    },
    source: {
      revision: gitSource(root, edition),
      frameworkVersion: readJsonIfPresent(resolve(root, 'package.json'))?.version ?? null,
    },
    resources: manifestResources,
    postImportTasks,
    generatedResources: [
      {
        path: 'vona/.zova-rest/**',
        command: 'npm run deps:vona',
        reason: 'Generated backend consumer output',
      },
      {
        path: 'zova/dist/**',
        command: 'npm run build:zova:isolated',
        reason: 'Generated frontend output',
      },
    ],
    requiredCommands: requiredCommandsForTasks(postImportTasks),
    externalPrerequisites: [],
  };
  const dependencyData = metadata.map(item => ({
    path: item.path,
    name: item.package.name ?? null,
    dependencies: item.package.dependencies ?? {},
    vonaModule: item.package.vonaModule ?? null,
    zovaModule: item.package.zovaModule ?? null,
  }));
  const ownership = {
    schemaVersion: 1,
    suite: suiteName,
    allowedRoots: [
      `vona/src/suite/${suiteName}`,
      `zova/src/suite/${suiteName}`,
      `repo-specs/${suiteName}`,
      'repo-e2e/specs/',
    ],
    declaredResources: resources
      .filter(item => item.ownership === 'declared')
      .map(item => item.path),
  };
  const source = { schemaVersion: 1, edition, suite: suiteName, source: manifest.source };
  const files = new Map();
  files.set(`${BUNDLE_DIR}/manifest.json`, Buffer.from(canonicalJson(manifest)));
  files.set(`${BUNDLE_DIR}/source.json`, Buffer.from(canonicalJson(source)));
  files.set(
    `${BUNDLE_DIR}/dependencies.json`,
    Buffer.from(canonicalJson({ schemaVersion: 1, packages: dependencyData })),
  );
  files.set(`${BUNDLE_DIR}/ownership.json`, Buffer.from(canonicalJson(ownership)));
  for (const item of resources) files.set(`${BUNDLE_DIR}/payload/${item.path}`, item.data);
  const checksums = {};
  for (const [path, data] of [...files.entries()].toSorted(([a], [b]) => a.localeCompare(b)))
    checksums[path] = { bytes: data.length, sha256: sha256(data) };
  files.set(
    `${BUNDLE_DIR}/checksums.json`,
    Buffer.from(canonicalJson({ schemaVersion: 1, selfExcluded: true, files: checksums })),
  );
  return { suite: suiteName, manifest, files };
}

export function isAllowedResourcePath(path, suite, ownership = 'suite') {
  const normalized = safeRelativePath(path, 'resource path');
  if (normalized !== path || /[:<>"|?*]/.test(path) || isExcluded(path)) return false;
  if (path.split('/').some(segment => /[. ]$/.test(segment) || /\p{Cc}/u.test(segment)))
    return false;
  const suiteRoot = [`vona/src/suite/${suite}/`, `zova/src/suite/${suite}/`];
  if (suiteRoot.some(prefix => normalized.startsWith(prefix)))
    return ownership === 'suite' || ownership === 'declared';
  if (normalized.startsWith(`repo-specs/${suite}/`)) return ownership === 'declared';
  if (normalized.startsWith('repo-e2e/specs/')) return ownership === 'declared';
  return false;
}

export function fileIsText(data, path) {
  return isText(data, path);
}
