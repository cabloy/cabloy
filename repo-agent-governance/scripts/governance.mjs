import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const EXECUTABLE_PATH = process.env.CABLOY_GOVERNANCE_EXECUTABLE
  ? resolve(process.env.CABLOY_GOVERNANCE_EXECUTABLE)
  : SCRIPT_FILE;
export const ROOT_DIR = process.env.CABLOY_GOVERNANCE_ROOT
  ? resolve(process.env.CABLOY_GOVERNANCE_ROOT)
  : resolve(dirname(SCRIPT_FILE), '..', '..');
export const GOVERNANCE_DIR = resolve(ROOT_DIR, 'repo-agent-governance');
const ACTIVE_SCRIPT_FILE = process.env.CABLOY_GOVERNANCE_ROOT
  ? resolve(GOVERNANCE_DIR, 'scripts/governance.mjs')
  : SCRIPT_FILE;
const MANIFEST_PATH = resolve(GOVERNANCE_DIR, 'manifest.json');
const LOCK_PATH = resolve(GOVERNANCE_DIR, 'managed-assets.json');
const GENERATED_HEADER =
  '<!-- Generated from repo-agent-governance/. Do not edit this adapter output directly. -->\n\n';
const CURSOR_HEADER =
  '---\ndescription: Cabloy repository governance generated from repo-agent-governance.\nglobs: []\nalwaysApply: true\n---\n\n';
const ALLOWED_TARGET_ROOTS = [
  'CLAUDE.md',
  'AGENTS.md',
  '.claude/',
  '.agents/',
  '.cursor/',
  '.codex/',
];
const FORBIDDEN_TARGET_SEGMENTS = [
  'settings.local.json',
  'worktrees',
  'CLAUDE.local.md',
  'scheduled_tasks',
];

function normalizeText(value) {
  return `${value.replace(/\r\n?/g, '\n').replace(/\n*$/, '')}\n`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function toPosix(value) {
  return value.split(sep).join('/');
}

function assertSafeRelativePath(value, label) {
  if (typeof value !== 'string' || !value || isAbsolute(value)) {
    throw new Error(`${label} must be a non-empty relative path`);
  }
  const normalized = toPosix(value);
  if (normalized.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`${label} must not contain empty, dot, or parent segments: ${value}`);
  }
  return normalized;
}

function assertInside(base, candidate, label) {
  const result = relative(base, candidate);
  if (result === '' || (!result.startsWith(`..${sep}`) && result !== '..' && !isAbsolute(result)))
    return;
  throw new Error(`${label} escapes its permitted directory: ${candidate}`);
}

function assertAllowedTarget(target) {
  const value = assertSafeRelativePath(target, 'Managed target');
  const allowed = ALLOWED_TARGET_ROOTS.some(root =>
    root.endsWith('/') ? value.startsWith(root) : value === root,
  );
  if (!allowed) {
    throw new Error(`Managed target is outside the allowed roots: ${value}`);
  }
  const segments = value.split('/');
  if (FORBIDDEN_TARGET_SEGMENTS.some(segment => segments.includes(segment))) {
    throw new Error(`Managed target is forbidden: ${value}`);
  }
  return value;
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function assertKeys(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) throw new Error(`${label} has unsupported key: ${key}`);
  }
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to parse ${label}: ${error.message}`);
  }
}

function assertFile(path, label) {
  if (!existsSync(path) || !lstatSync(path).isFile())
    throw new Error(`${label} is missing: ${path}`);
  assertInside(GOVERNANCE_DIR, path, label);
}

function readCanonical(source) {
  const safeSource = assertSafeRelativePath(source, 'Canonical source');
  const path = resolve(GOVERNANCE_DIR, safeSource);
  assertFile(path, 'Canonical source');
  return { source: safeSource, content: normalizeText(readFileSync(path, 'utf8')) };
}

function validateSkill(content, source) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error(`Skill must begin with YAML front matter: ${source}`);
  const lines = match[1].split('\n');
  const names = lines.filter(line => line.startsWith('name: '));
  const descriptions = lines.filter(line => line.startsWith('description: '));
  if (
    names.length !== 1 ||
    descriptions.length !== 1 ||
    !names[0].slice(6).trim() ||
    !descriptions[0].slice(13).trim()
  ) {
    throw new Error(
      `Skill front matter requires exactly one non-empty name and description: ${source}`,
    );
  }
  return names[0].slice(6).trim();
}

function listFiles(directory, prefix = '') {
  const results = [];
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (entry.name === '.DS_Store') continue;
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(path, relativePath));
    } else if (entry.isFile()) {
      results.push(relativePath);
    } else {
      throw new Error(`Skill bundle contains an unsupported filesystem entry: ${path}`);
    }
  }
  return results;
}

function validateManifest() {
  const manifest = requireObject(
    readJson(MANIFEST_PATH, 'governance manifest'),
    'Governance manifest',
  );
  assertKeys(
    manifest,
    ['schemaVersion', 'policy', 'skills', 'commands', 'claude', 'cursor', 'codex'],
    'Governance manifest',
  );
  if (manifest.schemaVersion !== 1) throw new Error('Governance manifest must use schemaVersion 1');

  const policy = requireObject(manifest.policy, 'Governance manifest policy');
  assertKeys(policy, ['source', 'targets'], 'Governance manifest policy');
  const policySource = readCanonical(policy.source);
  if (!Array.isArray(policy.targets) || !policy.targets.length)
    throw new Error('Policy targets must be a non-empty array');

  const skills = requireObject(manifest.skills, 'Governance manifest skills');
  assertKeys(skills, ['sourceDirectory', 'targets'], 'Governance manifest skills');
  const skillsDirectory = assertSafeRelativePath(skills.sourceDirectory, 'Skill source directory');
  const skillsPath = resolve(GOVERNANCE_DIR, skillsDirectory);
  if (!existsSync(skillsPath) || !lstatSync(skillsPath).isDirectory())
    throw new Error(`Skill source directory is missing: ${skillsDirectory}`);
  assertInside(GOVERNANCE_DIR, skillsPath, 'Skill source directory');
  if (!Array.isArray(skills.targets) || !skills.targets.length)
    throw new Error('Skill targets must be a non-empty array');

  if (!Array.isArray(manifest.commands)) throw new Error('Commands must be an array');
  const commands = manifest.commands.map((command, index) => {
    const item = requireObject(command, `Command ${index}`);
    assertKeys(item, ['adapter', 'source', 'target'], `Command ${index}`);
    return {
      ...item,
      source: readCanonical(item.source).source,
      target: assertAllowedTarget(item.target),
    };
  });

  const claude = requireObject(manifest.claude, 'Claude manifest section');
  assertKeys(claude, ['settings', 'hooks'], 'Claude manifest section');
  const settings = requireObject(claude.settings, 'Claude settings manifest section');
  assertKeys(settings, ['source', 'target'], 'Claude settings manifest section');
  const hooks = Array.isArray(claude.hooks)
    ? claude.hooks
    : (() => {
        throw new Error('Claude hooks must be an array');
      })();
  const cursor = requireObject(manifest.cursor, 'Cursor manifest section');
  assertKeys(cursor, ['hooksJson', 'hooks'], 'Cursor manifest section');
  const cursorHooksJson = requireObject(cursor.hooksJson, 'Cursor hooks.json manifest section');
  assertKeys(cursorHooksJson, ['source', 'target'], 'Cursor hooks.json manifest section');
  const cursorHooks = Array.isArray(cursor.hooks)
    ? cursor.hooks
    : (() => {
        throw new Error('Cursor hooks must be an array');
      })();
  const codex = requireObject(manifest.codex, 'Codex manifest section');
  assertKeys(codex, ['hooksJson', 'hooks'], 'Codex manifest section');
  const codexHooksJson = requireObject(codex.hooksJson, 'Codex hooks.json manifest section');
  assertKeys(codexHooksJson, ['source', 'target'], 'Codex hooks.json manifest section');
  const codexHooks = Array.isArray(codex.hooks)
    ? codex.hooks
    : (() => {
        throw new Error('Codex hooks must be an array');
      })();

  const targets = new Set();
  const claimTarget = target => {
    const safeTarget = assertAllowedTarget(target);
    if (targets.has(safeTarget))
      throw new Error(`Managed target is declared more than once: ${safeTarget}`);
    targets.add(safeTarget);
    return safeTarget;
  };

  const normalizedPolicyTargets = policy.targets.map((item, index) => {
    const target = requireObject(item, `Policy target ${index}`);
    assertKeys(target, ['adapter', 'target'], `Policy target ${index}`);
    if (!['claude', 'codex', 'cursor'].includes(target.adapter))
      throw new Error(`Unsupported policy adapter: ${target.adapter}`);
    return { adapter: target.adapter, target: claimTarget(target.target) };
  });

  const normalizedSkillTargets = skills.targets.map((item, index) => {
    const target = requireObject(item, `Skill target ${index}`);
    assertKeys(target, ['adapter', 'targetDirectory'], `Skill target ${index}`);
    if (!['claude', 'codex', 'cursor'].includes(target.adapter))
      throw new Error(`Unsupported skill adapter: ${target.adapter}`);
    return {
      adapter: target.adapter,
      targetDirectory: assertAllowedTarget(`${target.targetDirectory}/placeholder`).replace(
        /\/placeholder$/,
        '',
      ),
    };
  });

  for (const command of commands) claimTarget(command.target);
  const normalizedSettings = {
    source: readCanonical(settings.source).source,
    target: claimTarget(settings.target),
  };
  const normalizedHooks = hooks.map((item, index) => {
    const hook = requireObject(item, `Claude hook ${index}`);
    assertKeys(hook, ['source', 'target'], `Claude hook ${index}`);
    return { source: readCanonical(hook.source).source, target: claimTarget(hook.target) };
  });
  const normalizedCursorHooksJson = {
    source: readCanonical(cursorHooksJson.source).source,
    target: claimTarget(cursorHooksJson.target),
  };
  const normalizedCursorHooks = cursorHooks.map((item, index) => {
    const hook = requireObject(item, `Cursor hook ${index}`);
    assertKeys(hook, ['source', 'target'], `Cursor hook ${index}`);
    return { source: readCanonical(hook.source).source, target: claimTarget(hook.target) };
  });
  const normalizedCodexHooksJson = {
    source: readCanonical(codexHooksJson.source).source,
    target: claimTarget(codexHooksJson.target),
  };
  const normalizedCodexHooks = codexHooks.map((item, index) => {
    const hook = requireObject(item, `Codex hook ${index}`);
    assertKeys(hook, ['source', 'target'], `Codex hook ${index}`);
    return { source: readCanonical(hook.source).source, target: claimTarget(hook.target) };
  });

  return {
    manifest,
    policy: {
      source: policySource.source,
      content: policySource.content,
      targets: normalizedPolicyTargets,
    },
    skills: { directory: skillsDirectory, path: skillsPath, targets: normalizedSkillTargets },
    commands,
    claude: { settings: normalizedSettings, hooks: normalizedHooks },
    cursor: { hooksJson: normalizedCursorHooksJson, hooks: normalizedCursorHooks },
    codex: { hooksJson: normalizedCodexHooksJson, hooks: normalizedCodexHooks },
  };
}

function policyForAdapter(content, adapter) {
  if (adapter === 'cursor') return `${CURSOR_HEADER}${content}`;
  return `${GENERATED_HEADER}${content}`;
}

function buildAssets() {
  const config = validateManifest();
  const assets = [];
  const add = (target, content, source, adapter, category) => {
    assets.push({ target, content: normalizeText(content), source, adapter, category });
  };

  for (const target of config.policy.targets) {
    add(
      target.target,
      policyForAdapter(config.policy.content, target.adapter),
      config.policy.source,
      target.adapter,
      'policy',
    );
  }

  const skillDirectories = readdirSync(config.skills.path, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));
  const skillNames = new Set();
  for (const directory of skillDirectories) {
    const skillPath = resolve(config.skills.path, directory.name);
    const files = listFiles(skillPath);
    if (!files.includes('SKILL.md'))
      throw new Error(`Skill bundle is missing SKILL.md: ${directory.name}`);
    const skillSource = `${config.skills.directory}/${directory.name}/SKILL.md`;
    const skillName = validateSkill(readCanonical(skillSource).content, skillSource);
    if (skillName !== directory.name)
      throw new Error(`Skill directory and front-matter name must match: ${directory.name}`);
    if (skillNames.has(skillName)) throw new Error(`Skill name is duplicated: ${skillName}`);
    skillNames.add(skillName);
    for (const skillTarget of config.skills.targets) {
      for (const file of files) {
        const source = `${config.skills.directory}/${directory.name}/${file}`;
        const canonical = readCanonical(source);
        add(
          `${skillTarget.targetDirectory}/${directory.name}/${file}`,
          canonical.content,
          canonical.source,
          skillTarget.adapter,
          'skill',
        );
      }
    }
  }

  for (const command of config.commands) {
    add(
      command.target,
      readCanonical(command.source).content,
      command.source,
      command.adapter,
      'command',
    );
  }
  add(
    config.claude.settings.target,
    readCanonical(config.claude.settings.source).content,
    config.claude.settings.source,
    'claude',
    'runtime',
  );
  for (const hook of config.claude.hooks) {
    add(hook.target, readCanonical(hook.source).content, hook.source, 'claude', 'runtime');
  }
  add(
    config.cursor.hooksJson.target,
    readCanonical(config.cursor.hooksJson.source).content,
    config.cursor.hooksJson.source,
    'cursor',
    'runtime',
  );
  for (const hook of config.cursor.hooks) {
    add(hook.target, readCanonical(hook.source).content, hook.source, 'cursor', 'runtime');
  }
  add(
    config.codex.hooksJson.target,
    readCanonical(config.codex.hooksJson.source).content,
    config.codex.hooksJson.source,
    'codex',
    'runtime',
  );
  for (const hook of config.codex.hooks) {
    add(hook.target, readCanonical(hook.source).content, hook.source, 'codex', 'runtime');
  }

  const targets = new Set();
  for (const asset of assets) {
    assertAllowedTarget(asset.target);
    if (targets.has(asset.target)) throw new Error(`Generated target collision: ${asset.target}`);
    targets.add(asset.target);
  }
  return assets.sort((left, right) => left.target.localeCompare(right.target));
}

function lockFromAssets(assets) {
  return {
    schemaVersion: 1,
    assets: assets.map(asset => ({
      adapter: asset.adapter,
      category: asset.category,
      sha256: sha256(asset.content),
      source: asset.source,
      target: asset.target,
    })),
  };
}

function lockText(assets) {
  return `${JSON.stringify(lockFromAssets(assets), null, 2)}\n`;
}

function previousManagedAssets() {
  if (!existsSync(LOCK_PATH)) return [];
  try {
    const lock = readJson(LOCK_PATH, 'managed governance lock');
    if (lock?.schemaVersion !== 1 || !Array.isArray(lock.assets)) return [];
    const targets = new Set();
    return lock.assets.map(asset => {
      if (
        !asset ||
        typeof asset !== 'object' ||
        typeof asset.target !== 'string' ||
        !/^[a-f0-9]{64}$/.test(asset.sha256)
      ) {
        throw new Error('invalid managed asset');
      }
      const target = assertAllowedTarget(asset.target);
      if (targets.has(target)) throw new Error('duplicate managed asset');
      targets.add(target);
      return { target, sha256: asset.sha256 };
    });
  } catch {
    return [];
  }
}

function targetPath(target) {
  const path = resolve(ROOT_DIR, target);
  assertInside(ROOT_DIR, path, 'Managed target');
  return path;
}

function writeAtomic(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-governance-${process.pid}`;
  try {
    writeFileSync(temporary, content);
    renameSync(temporary, path);
  } finally {
    if (existsSync(temporary)) rmSync(temporary, { force: true });
  }
}

export function render() {
  const assets = buildAssets();
  const previousAssets = previousManagedAssets();
  for (const asset of assets) {
    const path = targetPath(asset.target);
    const existing = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (existing !== asset.content) writeAtomic(path, asset.content);
  }
  const activeTargets = new Set(assets.map(asset => asset.target));
  for (const asset of previousAssets) {
    if (activeTargets.has(asset.target)) continue;
    const path = targetPath(asset.target);
    if (existsSync(path) && sha256(readFileSync(path, 'utf8')) === asset.sha256) {
      rmSync(path, { force: true });
    }
  }
  const lock = lockText(assets);
  const existingLock = existsSync(LOCK_PATH) ? readFileSync(LOCK_PATH, 'utf8') : null;
  if (existingLock !== lock) writeAtomic(LOCK_PATH, lock);
  return { assets };
}

export function check() {
  const assets = buildAssets();
  const problems = [];
  for (const asset of assets) {
    const path = targetPath(asset.target);
    if (!existsSync(path)) {
      problems.push(`Missing managed output: ${asset.target}`);
    } else if (readFileSync(path, 'utf8') !== asset.content) {
      problems.push(`Stale managed output: ${asset.target}`);
    }
  }
  const expectedLock = lockText(assets);
  if (!existsSync(LOCK_PATH)) {
    problems.push('Missing managed lock: repo-agent-governance/managed-assets.json');
  } else if (readFileSync(LOCK_PATH, 'utf8') !== expectedLock) {
    problems.push('Stale managed lock: repo-agent-governance/managed-assets.json');
  }
  return { assets, problems };
}

async function readState(path) {
  if (!existsSync(path)) return null;
  try {
    const state = JSON.parse(await readFile(path, 'utf8'));
    if (state?.schemaVersion !== 1 || !Array.isArray(state.assets))
      throw new Error('unsupported state shape');
    const targets = new Set();
    for (const asset of state.assets) {
      if (
        !asset ||
        typeof asset !== 'object' ||
        Object.keys(asset).some(key => !['target', 'sha256'].includes(key))
      ) {
        throw new Error('invalid state asset shape');
      }
      const target = assertAllowedTarget(asset.target);
      if (!/^[a-f0-9]{64}$/.test(asset.sha256) || targets.has(target)) {
        throw new Error(`invalid state asset: ${asset.target}`);
      }
      targets.add(target);
    }
    return {
      schemaVersion: state.schemaVersion,
      assets: state.assets.map(asset => ({
        target: assertAllowedTarget(asset.target),
        sha256: asset.sha256,
      })),
    };
  } catch (error) {
    throw new Error(`Unable to parse governance installer state: ${error.message}`);
  }
}

function statePath() {
  return resolve(ROOT_DIR, '.cabloy-agent-governance-state.json');
}

export async function adopt({ apply = false, force = [] } = {}) {
  const assets = buildAssets();
  const path = statePath();
  const state = await readState(path);
  const previous = new Map((state?.assets ?? []).map(asset => [asset.target, asset.sha256]));
  const forceSet = new Set(force);
  const created = [];
  const updated = [];
  const deleted = [];
  const conflicts = [];

  for (const asset of assets) {
    const target = targetPath(asset.target);
    if (!existsSync(target)) {
      created.push(asset.target);
      if (apply) writeAtomic(target, asset.content);
      continue;
    }
    const current = readFileSync(target, 'utf8');
    if (current === asset.content) continue;
    if (
      forceSet.has(asset.target) ||
      (previous.has(asset.target) && previous.get(asset.target) === sha256(current))
    ) {
      updated.push(asset.target);
      if (apply) writeAtomic(target, asset.content);
    } else {
      conflicts.push(asset.target);
    }
  }

  for (const [target, previousHash] of previous) {
    if (assets.some(asset => asset.target === target)) continue;
    const targetFile = targetPath(target);
    if (!existsSync(targetFile)) continue;
    if (sha256(readFileSync(targetFile, 'utf8')) === previousHash) {
      deleted.push(target);
      if (apply) rmSync(targetFile, { force: true });
    } else {
      conflicts.push(target);
    }
  }

  if (apply) {
    const conflictSet = new Set(conflicts);
    const retained = (state?.assets ?? []).filter(
      asset => !deleted.includes(asset.target) && conflictSet.has(asset.target),
    );
    const adopted = assets
      .filter(asset => !conflictSet.has(asset.target))
      .map(asset => ({ target: asset.target, sha256: sha256(asset.content) }));
    writeAtomic(
      path,
      `${JSON.stringify({ schemaVersion: 1, assets: [...retained, ...adopted].sort((left, right) => left.target.localeCompare(right.target)) }, null, 2)}\n`,
    );
  }
  return { created, updated, deleted, conflicts };
}

export async function cleanFixture(path) {
  await rm(path, { recursive: true, force: true });
}

function parseArgs(args) {
  const command = args[0];
  const options = args.slice(1);
  if (!['render', 'check', 'adopt'].includes(command)) {
    throw new Error('Usage: governance.mjs <render|check|adopt> [--apply] [--force <target>]');
  }
  return { command, options };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === 'render') {
    const result = render();
    // eslint-disable-next-line no-console
    console.log(`Rendered ${result.assets.length} managed governance assets.`);
    return;
  }
  if (command === 'check') {
    const result = check();
    if (result.problems.length) {
      console.error(`${result.problems.join('\n')}\nRun: npm run agent:governance:render`);
      process.exitCode = 1;
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`Governance outputs are current (${result.assets.length} assets).`);
    return;
  }
  const force = [];
  for (let index = 0; index < options.length; index++) {
    if (options[index] === '--force') {
      const target = options[++index];
      if (!target) throw new Error('--force requires a managed target path');
      force.push(assertAllowedTarget(target));
    }
  }
  const result = await adopt({ apply: options.includes('--apply'), force });
  for (const [label, paths] of Object.entries(result)) {
    // eslint-disable-next-line no-console
    if (paths.length) console.log(`${label}: ${paths.join(', ')}`);
  }
  if (!Object.values(result).some(paths => paths.length)) {
    // eslint-disable-next-line no-console
    console.log('No governance adoption changes are needed.');
  }
  if (result.conflicts.length) process.exitCode = 2;
}

if (
  resolve(process.argv[1] ?? '') === EXECUTABLE_PATH ||
  (process.env.CABLOY_GOVERNANCE_ROOT &&
    existsSync(ACTIVE_SCRIPT_FILE) &&
    realpathSync(resolve(process.argv[1] ?? '')) === realpathSync(ACTIVE_SCRIPT_FILE))
) {
  main().catch(error => {
    // eslint-disable-next-line no-console
    console.error(`Agent governance failed: ${error.message}`);
    process.exitCode = 1;
  });
}
