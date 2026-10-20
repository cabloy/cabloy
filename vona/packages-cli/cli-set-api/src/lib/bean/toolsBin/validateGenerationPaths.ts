import type { VonaConfigMeta } from '@cabloy/module-info';

import { assertTestRunOwner, requiresFreshTestResources, resolveVonaLocalPaths } from 'vona-core';

import type { VonaBinConfigOptions } from './types.ts';

export function validateGenerationPaths(
  configMeta: VonaConfigMeta,
  configOptions: VonaBinConfigOptions,
) {
  const strict = requiresFreshTestResources();
  if (strict && configMeta.mode !== 'test') {
    throw new Error('Strict generation requires test mode');
  }
  const paths = resolveVonaLocalPaths(configOptions.appDir, configMeta.mode);
  if (strict && !paths.runId) {
    throw new Error('Strict generation requires an isolated test run');
  }
  if (paths.runId) {
    if (configOptions.runtimeDir !== paths.generatedDir) {
      throw new Error('Isolated test generated directory does not match its run ID');
    }
    assertTestRunOwner(paths.dataRoot, paths.runId);
    assertTestRunOwner(paths.generatedRoot, paths.runId);
  }
  return strict;
}
