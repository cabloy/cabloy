import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  analyze,
  buildMessages,
  hasSignal,
  isCodeFile,
  normalizePath,
  resolveEdition,
} from './core.mjs';

const SCRIPT_FILE = fileURLToPath(import.meta.url);
const ROOT_DIR = resolve(dirname(SCRIPT_FILE), '..', '..', '..');

function parseArgs(args) {
  let file;
  let format = 'text';
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--file') {
      file = args[++index];
    } else if (args[index] === '--format') {
      format = args[++index];
    } else {
      throw new Error(`Unknown argument: ${args[index]}`);
    }
  }
  if (!file) throw new Error('Usage: contract-loop/check.mjs --file <path> [--format text|json]');
  if (!['text', 'json'].includes(format)) throw new Error(`Unsupported format: ${format}`);
  return { file, format };
}

function main() {
  const { file, format } = parseArgs(process.argv.slice(2));
  const filePath = normalizePath(ROOT_DIR, file);
  if (!filePath || !isCodeFile(filePath)) {
    throw new Error(`File is not a supported Vona/Zova source path: ${file}`);
  }
  const content = readFileSync(filePath, 'utf8');
  const resolution = resolveEdition(ROOT_DIR);
  const result = analyze(
    filePath,
    content,
    resolution.kind === 'resolved' ? resolution.edition : null,
  );
  const output = {
    edition: resolution.kind === 'resolved' ? resolution.edition.id : resolution.kind,
    file: filePath,
    signal: hasSignal(result),
    ...result,
    message: hasSignal(result) ? buildMessages(result, resolution) : null,
  };
  if (format === 'json') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(output, null, 2));
  } else if (output.message) {
    // eslint-disable-next-line no-console
    console.log(output.message);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Contract-loop check: no signal for ${file}.`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Contract-loop check failed: ${error.message}`);
  process.exitCode = 1;
}
