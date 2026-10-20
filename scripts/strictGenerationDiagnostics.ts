import type { StdioOptions } from 'node:child_process';

import { Writable } from 'node:stream';

import { requiresFreshTestResources } from '../vona/packages-vona/vona-core/src/lib/core/testStrictMode.ts';

export type StrictGenerationStage =
  | 'arguments'
  | 'preparation'
  | 'startup'
  | 'operation'
  | 'shutdown'
  | 'operation-and-shutdown'
  | 'generator'
  | 'cleanup'
  | 'run';

const failureStages = new WeakMap<object, StrictGenerationStage>();

export class StrictGenerationError extends Error {
  readonly stage: StrictGenerationStage;

  constructor(stage: StrictGenerationStage) {
    super(`Strict contract generation failed: ${stage}`);
    this.name = 'StrictGenerationError';
    this.stage = stage;
    failureStages.set(this, stage);
  }
}

export function strictGenerationFailure(stage: StrictGenerationStage, error?: unknown) {
  const previous = error && typeof error === 'object' ? failureStages.get(error) : undefined;
  return new StrictGenerationError(previous ?? stage);
}

export function usesStrictGeneration(env: NodeJS.ProcessEnv): boolean {
  try {
    return requiresFreshTestResources(env);
  } catch {
    throw new StrictGenerationError('arguments');
  }
}

export function guardianStdio(strict: boolean): StdioOptions {
  return strict ? ['ignore', 'ignore', 'ignore', 'ipc'] : ['inherit', 'inherit', 'inherit', 'ipc'];
}

export function discardNativeOutput() {
  const discard = () =>
    new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
  return { stdout: discard(), stderr: discard() };
}

export function reportIsolatedDiagnostic(strict: boolean, category: string, value?: unknown) {
  if (strict) console.error(`Strict contract generation: ${category}`);
  else console.error(value);
}
