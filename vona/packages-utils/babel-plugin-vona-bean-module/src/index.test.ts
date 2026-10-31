import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isValidBeanModuleFile } from './index.ts';

test('excludes timestamped generated Vona roots from bean module transforms', () => {
  assert.equal(
    isValidBeanModuleFile('/project/vona/.vona-test-20261014010203-a1b2c3d4/app.ts'),
    false,
  );
  assert.equal(
    isValidBeanModuleFile('C:\\project\\vona\\.vona-test-20261014010203-a1b2c3d4\\app.ts'),
    false,
  );
  assert.equal(isValidBeanModuleFile('/project/vona/src/module/foo/src/index.ts'), true);
});

for (const relativePath of [
  'src/boot/app/index.ts',
  '.zova/app/index.ts',
  'src/backend/view.tsx',
  '.vona/app.ts',
]) {
  for (const separator of ['/', '\\']) {
    test(`excludes ${relativePath} with ${JSON.stringify(separator)} separators`, () => {
      const fileName = `/project/vona-bin-build-fresh-a1b2c3/${relativePath}`.replaceAll(
        '/',
        separator,
      );
      assert.equal(isValidBeanModuleFile(fileName), false);
    });
  }
}

for (const separator of ['/', '\\']) {
  test(`includes module source with ${JSON.stringify(separator)} separators`, () => {
    const fileName = '/project/vona/src/module/test-fixture/src/service/main.ts'.replaceAll(
      '/',
      separator,
    );
    assert.equal(isValidBeanModuleFile(fileName), true);
  });
}
