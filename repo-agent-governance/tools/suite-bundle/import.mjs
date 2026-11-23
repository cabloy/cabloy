#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { baselinePath, readBaseline, withBaselineUpdate } from './baseline.mjs';
import { fileIsText, ROOT_DIR, requireEdition, sha256 } from './core.mjs';
import { inspectBundle } from './inspect.mjs';
import { runPostImportTasks, validatePostImportDestination } from './tasks.mjs';

const classifications = [
  'ADD',
  'UNCHANGED',
  'UPDATE',
  'LOCAL-ONLY',
  'MERGED',
  'CONFLICT',
  'BINARY-CONFLICT',
];

function readCurrent(root, path) {
  const segments = path.split('/');
  let destination = root;
  for (const [index, segment] of segments.entries()) {
    destination = resolve(destination, segment);
    const stat = lstatSync(destination, { throwIfNoEntry: false });
    if (!stat) return null;
    if (index === segments.length - 1 && stat.isFile())
      return { data: readFileSync(destination), mode: stat.mode & 0o777 };
    if (!stat.isDirectory() || index === segments.length - 1)
      throw new Error(`destination is not a regular file path: ${path}`);
  }
}

function same(a, b) {
  return a === null ? b === null : b !== null && a.equals(b);
}

function gitMerge(base, current, incoming) {
  const directory = mkdtempSync(join(tmpdir(), 'cabloy-suite-merge-'));
  try {
    const paths = ['base', 'current', 'incoming'].map(name => resolve(directory, name));
    writeFileSync(paths[0], base);
    writeFileSync(paths[1], current);
    writeFileSync(paths[2], incoming);
    const result = spawnSync(
      'git',
      [
        'merge-file',
        '-p',
        '-L',
        'current',
        '-L',
        'baseline',
        '-L',
        'incoming',
        paths[1],
        paths[0],
        paths[2],
      ],
      {
        encoding: null,
        maxBuffer: Math.max(1024 * 1024, 4 * (base.length + current.length + incoming.length)),
      },
    );
    if (result.status === 0) return { kind: 'MERGED', data: result.stdout };
    if (result.status > 0 && result.status <= 127) {
      return {
        kind: 'CONFLICT',
        data: result.stdout,
        reason: 'current and incoming edits overlap',
      };
    }
    return {
      kind: 'CONFLICT',
      data: null,
      reason: `git merge-file failed (${result.error?.code ?? result.signal ?? result.status})`,
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

export function planImport({ root = ROOT_DIR, buffer, baselineBuffer }) {
  root = resolve(root);
  const { manifest, suite, payload } = inspectBundle(buffer);
  const edition = requireEdition(root);
  if (manifest.edition !== edition) {
    throw new Error(
      `bundle edition ${manifest.edition} does not match destination edition ${edition}`,
    );
  }
  validatePostImportDestination({ root, plan: manifest.postImportTasks });
  const statePath = baselinePath(root, edition, suite);
  const saved = readBaseline(statePath);
  if (saved && baselineBuffer) throw new Error('a saved import baseline already exists');
  if (baselineBuffer?.equals(buffer))
    throw new Error('the explicit baseline must be the previous release, not the incoming ZIP');
  const previous = saved?.buffer ?? baselineBuffer;
  const baseline = previous ? inspectBundle(previous) : null;
  if (baseline && (baseline.suite !== suite || baseline.manifest.edition !== edition))
    throw new Error('import baseline must match the incoming edition and suite');

  const plan = [];
  for (const [path, incoming] of payload) {
    const base = baseline?.payload.get(path) ?? null;
    const existing = readCurrent(root, path);
    const current = existing?.data ?? null;
    let kind;
    let data = incoming;
    let reason;
    if (same(current, incoming)) {
      kind = 'UNCHANGED';
    } else if (base === null) {
      if (current === null) {
        kind = 'ADD';
      } else {
        kind = 'CONFLICT';
        reason = 'no verified baseline for an existing file with different content';
      }
    } else if (same(current, base)) {
      kind = 'UPDATE';
    } else if (same(incoming, base)) {
      kind = 'LOCAL-ONLY';
    } else if (current === null) {
      kind = 'CONFLICT';
      reason = 'the file was deleted locally and changed in the incoming snapshot';
    } else if (fileIsText(current, path) && fileIsText(incoming, path) && fileIsText(base, path)) {
      const merged = gitMerge(base, current, incoming);
      kind = merged.kind;
      data = merged.data;
      reason = merged.reason;
    } else {
      kind = 'BINARY-CONFLICT';
    }
    if (!classifications.includes(kind)) throw new Error(`unknown import classification: ${kind}`);
    plan.push({ path, kind, reason, data, current, mode: existing?.mode });
  }
  return {
    root,
    suite,
    manifest,
    edition,
    plan,
    postImportTasks: manifest.postImportTasks,
    baseline: {
      source: saved ? 'saved' : baseline ? 'explicit' : 'none',
      sha256: saved?.checksum ?? (previous ? sha256(previous) : null),
    },
    statePath,
    previousChecksum: saved?.checksum ?? null,
    incoming: { buffer, checksum: sha256(buffer) },
  };
}

export function executePostImport(planResult, options = {}) {
  if (!planResult?.postImportTasks) throw new Error('import plan has no post-import task plan');
  return runPostImportTasks({
    root: options.root ?? ROOT_DIR,
    plan: planResult.postImportTasks,
    execute: options.execute,
  });
}

export function applyPlan(planResult) {
  const blockers = planResult.plan.filter(item =>
    ['CONFLICT', 'BINARY-CONFLICT'].includes(item.kind),
  );
  if (blockers.length) {
    const error = new Error(
      `import has unresolved conflicts: ${blockers.map(item => item.path).join(', ')}`,
    );
    error.code = 2;
    throw error;
  }
  const { root, plan, statePath, previousChecksum, incoming } = planResult;
  const changed = plan.filter(item => ['ADD', 'UPDATE', 'MERGED'].includes(item.kind));
  const verifyCurrent = item => {
    const current = readCurrent(root, item.path);
    if (!same(current?.data ?? null, item.current) || current?.mode !== item.mode)
      throw new Error(`destination changed after planning: ${item.path}; run a new dry run`);
  };
  withBaselineUpdate(statePath, previousChecksum, incoming, commit => {
    if (requireEdition(root) !== planResult.edition)
      throw new Error('destination edition changed after planning');
    validatePostImportDestination({ root, plan: planResult.postImportTasks });
    for (const item of plan) verifyCurrent(item);
    const staged = [];
    const createdDirectories = [];
    let committed = false;
    const cleanUp = (relativePath, action) => {
      try {
        action();
      } catch (error) {
        process.emitWarning(`Could not clean up suite import for ${relativePath}: ${error.code}`);
      }
    };
    try {
      for (const item of changed) {
        verifyCurrent(item);
        const destination = resolve(root, item.path);
        const parent = dirname(destination);
        const firstCreated = mkdirSync(parent, { recursive: true });
        if (firstCreated) {
          const directories = [parent];
          while (directories.at(-1) !== firstCreated) directories.push(dirname(directories.at(-1)));
          createdDirectories.push(...directories.reverse());
        }
        const directory = mkdtempSync(join(parent, '.cabloy-suite-import-'));
        const backup = join(directory, 'original');
        const replacement = join(directory, 'incoming');
        const entry = {
          path: item.path,
          destination,
          directory,
          backup,
          backedUp: false,
          written: false,
        };
        staged.push(entry);
        writeFileSync(replacement, item.data, { flag: 'wx', flush: true });
        if (item.current !== null) {
          chmodSync(replacement, item.mode);
          renameSync(destination, backup);
          entry.backedUp = true;
        }
        renameSync(replacement, destination);
        entry.written = true;
      }
      commit();
      committed = true;
    } catch (error) {
      const failed = [];
      for (const entry of staged.toReversed()) {
        try {
          if (entry.backedUp) renameSync(entry.backup, entry.destination);
          else if (entry.written) rmSync(entry.destination);
        } catch {
          entry.keepBackup = true;
          failed.push(`${entry.path} (staging directory: ${basename(entry.directory)})`);
        }
      }
      if (failed.length) {
        throw new Error(`suite import failed and could not restore: ${failed.join(', ')}`, {
          cause: error,
        });
      }
      throw error;
    } finally {
      for (const entry of staged) {
        if (!entry.keepBackup)
          cleanUp(entry.path, () => rmSync(entry.directory, { recursive: true, force: true }));
      }
      if (!committed) {
        for (const directory of createdDirectories.toReversed())
          cleanUp(relative(root, directory), () => rmdirSync(directory));
      }
    }
  });
}

const usage =
  'Usage: npm run cabloy-suite-import -- <bundle.zip> [--baseline <previous.zip>] [--dry-run|--apply] [--run-post-import]';

function parseArgs(argv) {
  const result = { apply: false, runPostImport: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--apply') {
      result.apply = true;
    } else if (arg === '--run-post-import') {
      result.runPostImport = true;
    } else if (arg === '--dry-run') {
      result.apply = false;
    } else if (arg === '--help' || arg === '-h') {
      return { help: true };
    } else if (arg === '--baseline') {
      const input = argv[++index];
      if (result.baseline || !input || input.startsWith('-')) {
        throw new Error(
          '--baseline requires exactly one path to a previously imported release ZIP',
        );
      }
      result.baseline = input;
    } else if (!result.input && !arg.startsWith('-')) {
      result.input = arg;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!result.input) throw new Error(usage);
  if (result.runPostImport && !result.apply) throw new Error('--run-post-import requires --apply');
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(`${usage}\n`);
      process.exit(0);
    }
    const result = planImport({
      buffer: readFileSync(args.input),
      baselineBuffer: args.baseline ? readFileSync(args.baseline) : undefined,
    });
    process.stdout.write(
      `${JSON.stringify(
        {
          edition: result.edition,
          suite: result.suite,
          schemaVersion: result.manifest.schemaVersion,
          baseline: result.baseline,
          incomingSha256: result.incoming.checksum,
          mergePlan: result.plan.map(({ kind, path, reason }) => ({ kind, path, reason })),
          postImportTasks: result.postImportTasks.tasks,
        },
        null,
        2,
      )}\n`,
    );
    if (args.apply) {
      applyPlan(result);
      process.stdout.write('Source applied and import baseline saved.\n');
    } else {
      process.stdout.write('Dry run only; no files were changed.\n');
    }
    if (args.runPostImport) {
      const execution = executePostImport(result);
      if (execution.failed) throw new Error(`post-import task failed: ${execution.failed.id}`);
      process.stdout.write(`Post-import tasks completed: ${execution.results.length}\n`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(error?.code === 2 ? 2 : 1);
  }
}
