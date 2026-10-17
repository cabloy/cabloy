import type { IModule } from '@cabloy/module-info';
import type { VonaApplication } from 'vona';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import loadModuleConfigs from '../../../../../../packages-vona/vona-core/src/lib/module/config.ts';
import configureApplication from '../../../../../backend/config/config/config.ts';
import { config } from '../src/config/config.ts';

function createApplication(enabled?: string): VonaApplication {
  return {
    meta: {
      env: {
        CABLOY_MCP_ENABLED: enabled,
        SERVER_PUBLICDIR: '/synthetic/public',
        LOGGER_DIR: '/synthetic/log',
        DATABASE_CLIENT_SQLITE3_FILENAME: ':memory:',
        DATABASE_DEFAULT_CLIENT: 'better-sqlite3',
      },
    },
    config: { modules: {} },
    util: { monkeyModule: async () => {} },
  } as unknown as VonaApplication;
}

async function loadConfig(app: VonaApplication) {
  await loadModuleConfigs(app, {
    'cabloy-mcp': {
      info: { relativeName: 'cabloy-mcp' },
      resource: { config },
    } as unknown as IModule,
  });
  return app.config.modules['cabloy-mcp'];
}

describe('MCP configuration foundation', () => {
  it('defaults on and returns independent configuration objects', async () => {
    const app = createApplication();
    const first = config(app);
    assert.deepEqual(first, { enabled: true });
    first.enabled = false;
    assert.deepEqual(config(app), { enabled: true });
    assert.deepEqual(await loadConfig(app), { enabled: true });
  });

  for (const value of [
    undefined,
    '',
    'true',
    '0',
    '1',
    'FALSE',
    'False',
    'TRUE',
    'True',
    ' false',
    'false ',
    ' true',
    'true ',
  ]) {
    it(`stays enabled for ${JSON.stringify(value)} without an application mapping`, async () => {
      const app = createApplication(value);
      const applicationConfig = await configureApplication(app);
      assert.equal(Object.hasOwn(applicationConfig.modules!, 'cabloy-mcp'), false);
      assert.deepEqual(config(app), { enabled: true });
      assert.deepEqual(await loadConfig(app), { enabled: true });
    });
  }

  it('disables only for literal false in the module configuration', async () => {
    const app = createApplication('false');
    const applicationConfig = await configureApplication(app);
    assert.equal(Object.hasOwn(applicationConfig.modules!, 'cabloy-mcp'), false);
    assert.deepEqual(config(app), { enabled: false });
    assert.deepEqual(await loadConfig(app), { enabled: false });
  });

  it('keeps an explicit application disablement over the enabled module default', async () => {
    const app = createApplication();
    app.config.modules['cabloy-mcp'] = { enabled: false };
    assert.deepEqual(await loadConfig(app), { enabled: false });
    assert.deepEqual(config(app), { enabled: true });
  });

  it('keeps an explicit application override over the environment-derived module value', async () => {
    const app = createApplication('false');
    app.config.modules['cabloy-mcp'] = { enabled: true };
    assert.deepEqual(await loadConfig(app), { enabled: true });
    assert.deepEqual(config(app), { enabled: false });
  });
});
