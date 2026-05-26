import type { VonaConfigMeta } from '@cabloy/module-info';

import type { VonaBinConfigOptions } from './types.ts';

import { createConfigUtils } from './configUtils.ts';
import { generateEntryFiles } from './generateEntryFiles.ts';

export async function generateVonaMeta(
  configMeta: VonaConfigMeta,
  configOptions: VonaBinConfigOptions,
) {
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
