#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { writeZip } from './archive.mjs';
import { buildBundleModel, ROOT_DIR, sha256 } from './core.mjs';

function usage() {
  return 'Usage: npm run cabloy-suite-pack -- --suite <suite> --out <bundle.zip> [--include-spec <path>] [--include-e2e <path>] [--dry-run]';
}

function parseArgs(argv) {
  const result = { specs: [], e2e: [], dryRun: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--dry-run') {
      result.dryRun = true;
      continue;
    }
    if (arg === '--suite') {
      result.suite = argv[++index];
      continue;
    }
    if (arg === '--out' || arg === '--output') {
      result.output = argv[++index];
      continue;
    }
    if (arg === '--include-spec') {
      result.specs.push(argv[++index]);
      continue;
    }
    if (arg === '--include-e2e') {
      result.e2e.push(argv[++index]);
      continue;
    }
    throw new Error(`unknown option: ${arg}`);
  }
  if (!result.suite || !result.output)
    throw new Error(`${usage()}\n--suite and --out are required`);
  if (result.output.startsWith('-')) throw new Error('output path is missing');
  return result;
}

export function pack({ root = ROOT_DIR, suite, output, specs = [], e2e = [], dryRun = false }) {
  const model = buildBundleModel(root, suite, { specs, e2e });
  const archive = writeZip(model.files);
  const summary = {
    suite: model.suite,
    schemaVersion: model.manifest.schemaVersion,
    resources: model.manifest.resources.length,
    bytes: archive.length,
    output: resolve(root, output),
    edition: model.manifest.edition,
    checksum: sha256(archive),
    taskCount: model.manifest.postImportTasks.tasks.length,
    requiredCommands: model.manifest.requiredCommands,
  };
  if (!dryRun) {
    const destination = resolve(root, output);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, archive);
  }
  return { ...summary, archive, model };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    }
    const result = pack({ ...args });
    process.stdout.write(
      `${JSON.stringify(
        {
          suite: result.suite,
          edition: result.edition,
          schemaVersion: result.schemaVersion,
          resources: result.resources,
          bytes: result.bytes,
          output: result.output,
          checksum: result.checksum,
          taskCount: result.taskCount,
          requiredCommands: result.requiredCommands,
          postImportTasks: result.model.manifest.postImportTasks.tasks,
          dryRun: args.dryRun,
        },
        null,
        2,
      )}\n`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
