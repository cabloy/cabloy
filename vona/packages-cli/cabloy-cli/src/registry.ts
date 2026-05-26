import NPMConfig from '@npmcli/config';
import npmDefinitions from '@npmcli/config/lib/definitions/index.js';

let __registry: string;

export async function getRegistry() {
  if (!__registry) {
    const npmConfig = new NPMConfig(Object.assign({ npmPath: '' }, npmDefinitions));
    await npmConfig.load();
    __registry = npmConfig.get('registry') || 'https://registry.npmjs.org/';
    if (!__registry.endsWith('/')) {
      __registry = `${__registry}/`;
    }
  }
  return __registry;
}
