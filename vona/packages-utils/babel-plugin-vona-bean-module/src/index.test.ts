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
