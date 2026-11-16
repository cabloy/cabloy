import type { BeanCliBase } from '@cabloy/cli';
import type { OnionScenesMeta } from '@cabloy/module-info';

import assert from 'node:assert/strict';
import test from 'node:test';

import { generateOptionsPackage } from '../src/lib/bean/toolsMetadata/generateOptionsPackage.ts';

test('metadata removes the last generated scene registration without removing unrelated options', async () => {
  const scenes = { aop: { optionsPackage: true } } as unknown as OnionScenesMeta;
  for (const unrelated of [false, true]) {
    const pkg = {
      zovaModule: {
        dependencies: { 'basic-app': '5.0.0' },
        onionsConfig: {
          aop: { studentResource: { match: 'rest-resource.model.resource' } },
          ...(unrelated ? { custom: { retained: true } } : {}),
        },
      },
    };
    let saved: unknown;
    const cli = {
      helper: {
        loadJSONFile: async () => structuredClone(pkg),
        saveJSONFile: async (_file: string, value: unknown) => {
          saved = value;
        },
      },
    } as unknown as BeanCliBase;
    await generateOptionsPackage(cli, [], scenes, 'training-student', '/synthetic-module');
    assert.deepEqual(saved, {
      zovaModule: {
        dependencies: { 'basic-app': '5.0.0' },
        ...(unrelated ? { onionsConfig: { custom: { retained: true } } } : {}),
      },
    });
    assert.ok(pkg.zovaModule.onionsConfig.aop.studentResource);
  }
});
