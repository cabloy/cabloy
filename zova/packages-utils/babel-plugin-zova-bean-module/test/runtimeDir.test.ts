import { transformSync } from '@babel/core';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import beanModule from '../src/index.ts';

function transform(source: string, sourceFileName: string, runtimeDir?: string) {
  return transformSync(source, {
    configFile: false,
    babelrc: false,
    sourceFileName,
    parserOpts: { plugins: ['typescript', 'jsx', 'decorators-legacy'] },
    plugins: [[beanModule, { brandName: 'zova', runtimeDir }]],
  })!.code!;
}

test('isolated generated app controllers retain their explicit framework decorator without BeanInfo', async () => {
  const source = await readFile(
    new URL('../../zova-vite/templates/app/controller.tsx_', import.meta.url),
    'utf8',
  );
  // The component plugin adds a controller decorator before the module plugin runs.
  const decorated = source.replace(
    'export class ControllerPageApp',
    '@Controller()\nexport class ControllerPageApp',
  );
  const runtimeDir = '.zova-build-ID';
  const expected = transform(decorated, '/checkout/zova/.zova/app/controller.tsx');
  for (const file of [
    `/checkout/zova/${runtimeDir}/app/controller.tsx`,
    `D:\\checkout\\zova\\${runtimeDir}\\app\\controller.tsx`,
  ]) {
    const output = transform(decorated, file, runtimeDir);
    assert.equal(output, expected);
    assert.match(output, /@Controller\(\)/);
    assert.doesNotMatch(output, /__z_BeanInfo/);
  }
});

test('ordinary module beans still receive BeanInfo and sibling names are not overmatched', () => {
  const source = '@Bean()\nexport class ServiceExample {}';
  const runtimeDir = '.zova-build-ID';
  for (const file of [
    '/checkout/zova/src/suite-vendor/a-zova/modules/a-example/src/bean/example.ts',
    '/checkout/zova/src/suite-vendor/a-zova/modules/a-example/not.zova-build-ID/app/example.ts',
  ]) {
    const output = transform(source, file, runtimeDir);
    assert.match(output, /__z_BeanInfo/);
    if (!file.includes('not.zova-build-ID')) {
      assert.match(output, /module: ["']a-example["']/);
    }
  }
});
