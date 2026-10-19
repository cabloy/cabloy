import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import { extractRestDependencies } from '../src/lib/common/restDependencies.ts';
import { extractRestDependencyVersions } from '../src/lib/common/restDependencyVersions.ts';

const sideEffectModules = [
  'zova-module-a-fetch',
  'zova-module-a-app',
  'zova-module-a-logger',
  'zova-module-a-meta',
  'zova-module-a-ssrhmr',
  'zova-module-a-zod',
  'zova-module-a-zova',
  'zova-module-a-rbac',
  'zova-module-pay-paypal',
  'zova-module-pay-stripe',
  'zova-module-a-behaviors',
  'zova-module-a-routerstack',
  'zova-module-a-ssrserver',
];

async function withFixture(callback: (projectPath: string) => Promise<void>): Promise<void> {
  const projectPath = await mkdtemp(path.join(os.tmpdir(), 'rest-dependency-'));
  try {
    await callback(projectPath);
  } finally {
    await rm(projectPath, { recursive: true, force: true });
  }
}

async function writeFixtureFile(
  projectPath: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const filePath = path.join(projectPath, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function writePackage(
  projectPath: string,
  relativePath: string,
  packageJson: Record<string, unknown>,
): Promise<void> {
  await writeFixtureFile(
    projectPath,
    path.join(relativePath, 'package.json'),
    JSON.stringify(packageJson),
  );
}

async function writeLockfile(projectPath: string, content: string): Promise<void> {
  await writeFixtureFile(projectPath, 'pnpm-lock.yaml', content);
}

describe('extractRestDependencies', () => {
  it('retains consecutive side-effect imports before named imports', () => {
    const content = `${sideEffectModules.map(name => `import "${name}";`).join('\n')}
import type { Schema } from 'zod';
//#region bundled declarations
export declare const schema: Schema;
`;
    assert.deepEqual(extractRestDependencies(content), [...sideEffectModules, 'zod'].sort());
  });

  it('collects imports and re-exports without relying on region comments', () => {
    assert.deepEqual(
      extractRestDependencies(`
import type {
  Foo,
} from '@scope/types/subpath';
import Default from "plain-package";
export * from '@scope/exported';
export type { Bar } from 'exported/subpath';
export { Default };
`),
      ['@scope/exported', '@scope/types', 'exported', 'plain-package'],
    );
  });

  it('collects nested import types and external import assignments after region comments', () => {
    assert.deepEqual(
      extractRestDependencies(`
//#region generated
import Legacy = require('legacy/subpath');
export type Options = {
  value: import('@scope/types/options').Options;
  factory: typeof import('factory');
};
export * from 'after-region';
`),
      ['@scope/types', 'after-region', 'factory', 'legacy'],
    );
  });

  it('does not treat module declarations or import-like text as dependencies', () => {
    assert.deepEqual(
      extractRestDependencies(`
// import 'comment-only';
/** export * from 'comment-export'; */
declare const text: "import 'string-only'";
declare module 'bundled-business-module' {
  import type { External } from 'real-dependency';
  export type Value = import('@scope/nested').Value;
}
declare module 'augmentation-target' {
  interface Options { enabled: boolean }
}
`),
      ['@scope/nested', 'real-dependency'],
    );
  });

  it('ignores local paths, builtins, internal aliases and virtual identifiers', () => {
    assert.deepEqual(
      extractRestDependencies(`
import './local.js';
import '../parent.js';
import '/absolute/file.js';
import 'C:/absolute/file.js';
import 'node:fs/promises';
import 'fs/promises';
import 'path';
import '#internal';
import 'virtual:generated';
import '\\0virtual';
import 'file:///local/file.js';
import 'https://example.invalid/module.js';
`),
      [],
    );
  });

  it('deduplicates package roots and sorts deterministically', () => {
    assert.deepEqual(
      extractRestDependencies(`
import 'zod';
export * from 'zod/v4';
import '@scope/pkg';
export type Value = import('@scope/pkg/subpath').Value;
import 'alpha/subpath';
`),
      ['@scope/pkg', 'alpha', 'zod'],
    );
    assert.deepEqual(extractRestDependencies(''), []);
  });

  it('rejects malformed declarations instead of returning partial dependencies', () => {
    assert.throws(
      () => extractRestDependencies("import 'valid-package';\nexport type Broken = {"),
      /Invalid REST declaration at index\.d\.mts:2:23: .+/,
    );
  });

  it('rejects path and type reference directives', () => {
    for (const [kind, target] of [
      ['path', './external.d.ts'],
      ['types', 'external-types'],
    ]) {
      assert.throws(
        () =>
          extractRestDependencies(`/// <reference ${kind}="${target}" />\nimport 'valid-package';`),
        {
          message:
            `Unsupported REST declaration reference directive: ${kind} ${JSON.stringify(target)}. ` +
            'The current REST bundling workflow does not support this directive.',
        },
      );
    }
  });

  it('does not treat compiler lib references as package dependencies', () => {
    assert.deepEqual(
      extractRestDependencies(`
/// <reference lib="esnext" />
/// <reference no-default-lib="true" />
import 'real-package';
`),
      ['real-package'],
    );
  });

  it('rejects empty and incomplete scoped package references', () => {
    for (const specifier of ['', '@scope', '@scope/', '@/package', '@']) {
      assert.throws(
        () => extractRestDependencies(`import '${specifier}';`),
        /(?:Invalid|Unsupported) REST declaration package reference:/,
      );
    }
  });

  it('rejects colon-containing package references that are not URL schemes', () => {
    for (const specifier of ['@scope/package:invalid', 'package/subpath:invalid']) {
      assert.throws(
        () => extractRestDependencies(`export * from '${specifier}';`),
        /Unsupported REST declaration package reference:/,
      );
    }
  });

  it('rejects nonliteral import types and non-string module specifiers', () => {
    assert.throws(
      () => extractRestDependencies('export type Value = import(PackageName).Value;'),
      /Unsupported REST declaration import type/,
    );
    assert.throws(
      () => extractRestDependencies('export type Value = import(42).Value;'),
      /Unsupported REST declaration module specifier/,
    );
  });

  it('rejects dynamic import calls instead of silently omitting their dependencies', () => {
    assert.throws(
      () => extractRestDependencies("const value = import('runtime-package');"),
      /Unsupported REST declaration dynamic import/,
    );
  });

  it('retains external import assignments and ignores internal import aliases', () => {
    assert.deepEqual(
      extractRestDependencies(`
import Scoped = require('@scope/legacy/subpath');
import Local = require('./local.js');
import Builtin = require('node:fs');
import Internal = require('#internal');
import Remote = require('https://example.invalid/module.js');
declare namespace Existing { interface Value {} }
import Alias = Existing.Value;
`),
      ['@scope/legacy'],
    );
  });
});

describe('extractRestDependencyVersions', () => {
  it('uses the root importer range when the dependency is declared there', async () => {
    await withFixture(async projectPath => {
      await writeLockfile(
        projectPath,
        `lockfileVersion: '9.0'
importers:
  .:
    dependencies:
      root-package:
        specifier: ^1.2.3
        version: 1.2.3
`,
      );
      assert.deepEqual(await extractRestDependencyVersions(projectPath, ['root-package']), {
        'root-package': '^1.2.3',
      });
    });
  });

  it('resolves a dependency from its owning module importer', async () => {
    await withFixture(async projectPath => {
      const moduleRoot = 'zova/src/suite/example/modules/example-one';
      await writeLockfile(
        projectPath,
        `lockfileVersion: '9.0'
importers:
  .:
    dependencies: {}
  ${moduleRoot}:
    dependencies:
      owned-package:
        specifier: ^2.0.4
        version: 2.0.4
`,
      );
      assert.deepEqual(
        await extractRestDependencyVersions(projectPath, ['owned-package'], [moduleRoot]),
        { 'owned-package': '^2.0.4' },
      );
    });
  });

  it('falls back to an installed module dependency when the lock importer is absent', async () => {
    await withFixture(async projectPath => {
      const moduleRoot = 'zova/src/module/example-one';
      await writePackage(projectPath, moduleRoot, {
        name: 'zova-module-example-one',
        dependencies: { 'installed-package': '^3.1.0' },
      });
      await writePackage(projectPath, path.join(moduleRoot, 'node_modules', 'installed-package'), {
        name: 'installed-package',
        version: '3.1.7',
      });
      await writeLockfile(
        projectPath,
        "lockfileVersion: '9.0'\nimporters:\n  .:\n    dependencies: {}\n",
      );
      assert.deepEqual(
        await extractRestDependencyVersions(projectPath, ['installed-package'], [moduleRoot]),
        { 'installed-package': '^3.1.7' },
      );
    });
  });

  it('rejects conflicting module dependency versions', async () => {
    await withFixture(async projectPath => {
      const firstModule = 'zova/src/module/first';
      const secondModule = 'zova/src/module/second';
      await writeLockfile(
        projectPath,
        `lockfileVersion: '9.0'
importers:
  .:
    dependencies: {}
  ${firstModule}:
    dependencies:
      conflicting-package:
        specifier: ^1.0.0
        version: 1.0.0
  ${secondModule}:
    dependencies:
      conflicting-package:
        specifier: ^2.0.0
        version: 2.0.0
`,
      );
      await assert.rejects(
        extractRestDependencyVersions(
          projectPath,
          ['conflicting-package'],
          [firstModule, secondModule],
        ),
        /Conflicting REST dependency versions for conflicting-package/,
      );
    });
  });

  it('preserves npm aliases and strips peer suffixes from locked versions', async () => {
    await withFixture(async projectPath => {
      await writeLockfile(
        projectPath,
        `
importers:
  .:
    dependencies:
      zod:
        specifier: npm:@cabloy/zod@4.3.8
        version: '@cabloy/zod@4.3.8'
    devDependencies:
      peer-package:
        specifier: ^1.2.0
        version: 1.2.3(vue@3.5.42)
    optionalDependencies:
      optional-package:
        specifier: ^2.0.0
        version: 2.0.1
`,
      );
      assert.deepEqual(
        await extractRestDependencyVersions(projectPath, [
          'zod',
          'peer-package',
          'optional-package',
        ]),
        { 'zod': 'npm:@cabloy/zod@4.3.8', 'peer-package': '^1.2.3', 'optional-package': '^2.0.1' },
      );
    });
  });

  it('accepts matching module candidates with absolute and relative module roots', async () => {
    await withFixture(async projectPath => {
      const firstModule = 'src/module/first';
      const secondModule = 'src/module/second';
      await writeLockfile(
        projectPath,
        `
importers:
  ${firstModule}:
    dependencies:
      shared-package:
        version: 1.2.3(vue@3.5.42)
  ${secondModule}:
    dependencies:
      shared-package:
        version: 1.2.3(vue@3.5.43)
`,
      );
      assert.deepEqual(
        await extractRestDependencyVersions(
          projectPath,
          ['shared-package'],
          [firstModule, path.join(projectPath, secondModule)],
        ),
        { 'shared-package': '^1.2.3' },
      );
    });
  });

  it('uses an installed root package for a linked dependency', async () => {
    await withFixture(async projectPath => {
      await writeLockfile(
        projectPath,
        `
importers:
  .:
    dependencies:
      linked-package:
        specifier: workspace:*
        version: link:packages/linked-package
`,
      );
      await writePackage(projectPath, 'node_modules/linked-package', { version: '5.1.2' });
      assert.deepEqual(await extractRestDependencyVersions(projectPath, ['linked-package']), {
        'linked-package': '^5.1.2',
      });
    });
  });

  it('rejects dependencies without a resolvable version', async () => {
    await withFixture(async projectPath => {
      await writeLockfile(
        projectPath,
        "lockfileVersion: '9.0'\nimporters:\n  .:\n    dependencies: {}\n",
      );
      await assert.rejects(
        extractRestDependencyVersions(projectPath, ['missing-package']),
        /Unable to resolve REST dependency version for missing-package/,
      );
    });
  });
});
