import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  assertManagedTestImports,
  managedTestImportViolations as violations,
} from './managedTestImports.ts';

const fixturePath = fileURLToPath(new URL('./managedTest.ts', import.meta.url));
const specRoot = fileURLToPath(new URL('../specs', import.meta.url));

test('all discovered application specs route runtime Playwright imports through the managed fixture', async () => {
  await assertManagedTestImports();
});

test('fixture import gate allows type-only imports and catches runtime bypass forms', () => {
  const spec = resolve(specRoot, 'example.spec.ts');
  const managed = "import { test, expect } from '../scripts/managedTest.ts';\n";
  for (const allowed of [
    "import type { Page } from '@playwright/test';",
    "import { type Page, type Browser } from '@playwright/test';",
    "type Response = import('@playwright/test').Response;",
    "export type { Page } from '@playwright/test';",
    "export { type Page } from '@playwright/test';",
  ])
    assert.deepEqual(violations(managed + allowed, spec), []);
  for (const bypass of [
    "import { test } from '@playwright/test';",
    "import { type Page, expect } from '@playwright/test';",
    "import * as playwright from '@playwright/test';",
    "import '@playwright/test';",
    "export { test } from '@playwright/test';",
    "export * from '@playwright/test';",
    "const pw = await import('@playwright/test');",
    "const pw = require('@playwright/test');",
    "import pw = require('@playwright/test');",
    "import { chromium } from 'playwright';",
    "import { chromium } from 'playwright-core';",
  ])
    assert.equal(violations(managed + bypass, spec).length, 1, bypass);
  assert.deepEqual(violations("import type { test } from '../scripts/managedTest.ts';", spec), [
    'application spec must import test from managedTest',
  ]);
  assert.deepEqual(
    violations("import { test as appTest } from '../scripts/managedTest.ts';", spec),
    [],
  );
});

test('fixture import gate rejects absolute imports even when they point to managedTest', () => {
  const spec = resolve(specRoot, 'example.spec.ts');
  assert.deepEqual(
    violations(`import { test } from ${JSON.stringify(fixturePath.replaceAll('\\', '/'))};`, spec),
    ['application spec must import test from managedTest'],
  );
});

test('production gate rejects directory links, including Windows junctions', async () => {
  const root = await mkdtemp(resolve(tmpdir(), 'cabloy-managed-directory-link-'));
  try {
    const nested = resolve(root, 'nested');
    await mkdir(nested);
    await symlink(
      nested,
      resolve(root, 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    await assert.rejects(assertManagedTestImports(root), /cannot contain symlinks/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('production gate rejects file symlinks when supported', async t => {
  // Windows OS temp and the checkout may be on different drives, preventing relative imports.
  const root = await mkdtemp(resolve(dirname(fixturePath), '.cabloy-managed-file-link-'));
  try {
    const spec = resolve(root, 'application.spec.ts');
    const managedPath = relative(root, fixturePath).replaceAll('\\', '/');
    await writeFile(spec, `import { test } from ${JSON.stringify(managedPath)};`);
    await assertManagedTestImports(root);
    try {
      await symlink(spec, resolve(root, 'linked.spec.ts'), 'file');
    } catch (error) {
      if (
        process.platform === 'win32' &&
        ['EPERM', 'EACCES', 'ENOTSUP'].includes((error as NodeJS.ErrnoException).code ?? '')
      ) {
        t.skip(
          `Windows file symlink creation unavailable (${(error as NodeJS.ErrnoException).code})`,
        );
        return;
      }
      throw error;
    }
    await assert.rejects(assertManagedTestImports(root), /cannot contain symlinks/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('production gate rejects empty trees and bypasses in nested specs', async () => {
  const root = await mkdtemp(resolve(dirname(fixturePath), '.cabloy-managed-imports-'));
  try {
    await assert.rejects(assertManagedTestImports(root), /no specs/);
    const nested = resolve(root, 'nested');
    await mkdir(nested);
    const spec = resolve(nested, 'application.spec.ts');
    await writeFile(spec, "import { test } from '@playwright/test';");
    await assert.rejects(
      assertManagedTestImports(root),
      /fixture import violation.*application\.spec\.ts/,
    );
    const managedPath = relative(nested, fixturePath).replaceAll('\\', '/');
    await writeFile(spec, `import { test } from ${JSON.stringify(managedPath)};`);
    await assertManagedTestImports(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
