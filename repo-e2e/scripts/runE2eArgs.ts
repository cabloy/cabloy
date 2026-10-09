import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type ParsedE2eArgs = {
  specNames: string[];
  playwrightArgs: string[];
  tags: string[];
};

const SPEC_NAME_PATTERN = /^[a-z0-9][\w-]*$/i;
const VALUE_OPTIONS = new Set([
  '--browser',
  '--config',
  '--grep',
  '--grep-invert',
  '--global-timeout',
  '--ignore-snapshots',
  '--last-failed',
  '--max-failures',
  '--output',
  '--pass-with-no-tests',
  '--project',
  '--repeat-each',
  '--reporter',
  '--shard',
  '--timeout',
  '--trace',
]);

function optionName(arg: string): string {
  const equalsIndex = arg.indexOf('=');
  return equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildTagGrep(tags: string[]): string | undefined {
  if (tags.length === 0) return undefined;
  return tags.map(tag => `(?=.*${escapeRegExp(tag)})`).join('');
}

export function parseE2eArgs(args: string[], specsDir: string): ParsedE2eArgs {
  const specNames: string[] = [];
  const playwrightArgs: string[] = [];
  const tags: string[] = [];
  let optionStarted = false;
  let pendingValueFor: string | undefined;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (
      arg === '--clean' ||
      arg.startsWith('--clean=') ||
      arg === '--fast' ||
      arg.startsWith('--fast=')
    ) {
      throw new Error(`Unsupported E2E option: ${arg}. Use the single managed test:e2e command.`);
    }

    if (pendingValueFor) {
      if (!arg || arg.startsWith('--')) {
        throw new Error(`Missing value for ${pendingValueFor}.`);
      }
      if (pendingValueFor === '--tag') {
        tags.push(arg);
      } else {
        playwrightArgs.push(arg);
      }
      pendingValueFor = undefined;
      continue;
    }

    if (arg === '--tag' || arg.startsWith('--tag=')) {
      optionStarted = true;
      const value = arg.slice('--tag'.length).replace(/^=/, '');
      if (value) {
        tags.push(value);
      } else {
        pendingValueFor = '--tag';
      }
      continue;
    }

    if (arg === '--config' || arg.startsWith('--config=') || arg.startsWith('-c')) {
      throw new Error('The E2E runner manages --config; do not provide it.');
    }
    if (arg === '--workers' || arg.startsWith('--workers=') || arg.startsWith('-j')) {
      throw new Error('The E2E runner manages --workers; do not provide it.');
    }

    if (!optionStarted && !arg.startsWith('-')) {
      if (!SPEC_NAME_PATTERN.test(arg)) {
        throw new Error(`Invalid E2E spec name: ${arg}`);
      }
      const specPath = resolve(specsDir, `${arg}.spec.ts`);
      if (!existsSync(specPath)) {
        throw new Error(`Unknown E2E spec: ${arg} (expected ${specPath}).`);
      }
      specNames.push(arg);
      continue;
    }

    if (arg.startsWith('-')) {
      optionStarted = true;
      const name = optionName(arg);
      if (VALUE_OPTIONS.has(name) && !arg.includes('=')) {
        pendingValueFor = name;
      }
      playwrightArgs.push(arg);
      continue;
    }

    playwrightArgs.push(arg);
  }

  if (pendingValueFor) {
    throw new Error(`Missing value for ${pendingValueFor}.`);
  }

  return { specNames, playwrightArgs, tags };
}

export function combineGreps(args: string[], tags: string[]): string[] {
  const tagGrep = buildTagGrep(tags);
  if (!tagGrep) return args;

  const result = [...args];
  const grepIndex = result.findIndex(arg => arg === '--grep' || arg.startsWith('--grep='));
  if (grepIndex === -1) {
    result.push('--grep', tagGrep);
    return result;
  }

  if (result[grepIndex].includes('=')) {
    const [name, value] = result[grepIndex].split(/=(.*)/s, 2);
    result[grepIndex] = `${name}=(?=.*(?:${value}))${tagGrep}`;
  } else {
    const value = result[grepIndex + 1];
    result[grepIndex + 1] = `(?=.*(?:${value}))${tagGrep}`;
  }
  return result;
}
