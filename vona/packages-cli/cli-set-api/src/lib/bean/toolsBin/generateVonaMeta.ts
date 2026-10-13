import type { VonaConfigMeta } from '@cabloy/module-info';

import { assertTestRunOwner, resolveVonaLocalPaths } from 'vona-core';

import type { VonaBinConfigOptions } from './types.ts';

import { createConfigUtils } from './configUtils.ts';
import { generateEntryFiles } from './generateEntryFiles.ts';

export async function generateVonaMeta(
  configMeta: VonaConfigMeta,
  configOptions: VonaBinConfigOptions,
) {
  const paths = resolveVonaLocalPaths(configOptions.appDir, configMeta.mode);
  if (paths.runId) {
    if (configOptions.runtimeDir !== paths.generatedDir) {
      throw new Error('Isolated test generated directory does not match its run ID');
    }
    assertTestRunOwner(paths.dataRoot, paths.runId);
    assertTestRunOwner(paths.generatedRoot, paths.runId);
  }
  // config utils
  const configUtils = createConfigUtils(configMeta, configOptions);
  // env
  const env = configUtils.loadEnvs();
  // modulesMeta
  const modulesMeta = await configUtils.loadModulesMeta();
  // generateEntryFiles
  await generateEntryFiles(configMeta, configOptions, modulesMeta, env);
  // ok
  return {
    env,
    modulesMeta,
  };
}
