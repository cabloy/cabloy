import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';

const configUrl = new URL('../src/configUtils.ts?fixture=chunk-paths', import.meta.url).href;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === configUrl) {
      const source = {
        '@cabloy/module-glob': `export async function glob({projectPath}) {
          const separator = projectPath.includes('\\\\') ? '\\\\' : '/';
          const appDir = projectPath.replaceAll('/', separator);
          return {modules:{'a-form':{root:appDir+separator+'src/suite-vendor/a-zova/modules/a-form'.replaceAll('/',separator),package:{}},
            'a-external':{root:appDir+separator+'node_modules/zova-module-a-external'.replaceAll('/',separator),package:{}}}};
        }`,
        '@cabloy/dotenv':
          "export function loadEnvs() { throw Error('Environment loading is not part of chunk grouping'); }",
      }[specifier];
      if (source)
        return { url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
let createConfigUtils;
try {
  ({ createConfigUtils } = await import(configUrl));
} finally {
  hooks.deregister();
}

for (const appDir of ['/checkout/zova', 'D:\\checkout\\zova', 'D:\\checkout/zova']) {
  test(`module chunk groups match normalized Vite IDs for ${appDir}`, async () => {
    const config = createConfigUtils(
      { flavor: 'cabloyBasicAdmin', mode: 'production', appMode: 'ssr' },
      { appDir },
    );
    await config.loadModulesMeta();
    const groups = config.codeSplittingGroups();
    const form = groups.find(group => group.name === 'a-form');
    assert.equal(form.test, '/src/suite-vendor/a-zova/modules/a-form/');
    assert.ok(
      `${appDir.replaceAll('\\', '/')}/src/suite-vendor/a-zova/modules/a-form/src/index.ts`.includes(
        form.test,
      ),
    );
    const external = groups.find(group => group.name === 'a-external');
    assert.equal(external.test, '/zova-module-a-external/');
    assert.ok(
      `${appDir.replaceAll('\\', '/')}/node_modules/zova-module-a-external/src/index.ts`.includes(
        external.test,
      ),
    );
  });
}
