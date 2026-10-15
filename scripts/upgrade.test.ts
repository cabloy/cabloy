import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

import { mergeFrameworkE2eAssets, reconcileFrameworkE2ePackageJson } from './upgrade.ts';

const frameworkFiles = [
  'repo-e2e/config/playwright.config.ts',
  'repo-e2e/scripts/runE2e.ts',
  'repo-e2e/specs/cabloy-basic.spec.ts',
  'repo-e2e/specs/home-user-account.spec.ts',
  'repo-e2e/specs/a-commerce.spec.ts',
];

function writeFile(root: string, path: string, content: string): void {
  const file = resolve(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function readPackage(root: string): {
  scripts: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} {
  return JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
}

function fixture(): { root: string; project: string; source: string; dispose(): void } {
  const root = mkdtempSync(resolve(tmpdir(), 'cabloy-upgrade-e2e-'));
  const project = resolve(root, 'project');
  const source = resolve(root, 'source');
  writeFile(project, '__CABLOY_BASIC__', '');
  writeFile(
    project,
    'package.json',
    `${JSON.stringify(
      {
        scripts: {
          'test:e2e': 'node repo-e2e/scripts/runE2e.ts --clean',
          'test:e2e:fast': 'node repo-e2e/scripts/runE2e.ts --fast',
          'test:project': 'node project-tests.ts',
        },
        dependencies: { '@playwright/test': '^1.0.0', 'project-owned': '^2.0.0' },
        devDependencies: { 'another-tool': '^3.0.0' },
      },
      null,
      2,
    )}\n`,
  );
  writeFile(
    source,
    'package.json',
    `${JSON.stringify({ scripts: { 'test:e2e': 'node repo-e2e/scripts/runE2e.ts' }, devDependencies: { '@playwright/test': '^1.62.1' } })}\n`,
  );
  for (const path of frameworkFiles) {
    writeFile(project, path, `old ${path}`);
    writeFile(source, path, `new ${path}`);
  }
  writeFile(project, 'repo-e2e/specs/project-owned.spec.ts', 'project browser test');
  writeFile(project, 'repo-e2e/config/playwright.basic.config.ts', 'legacy config');
  return { root, project, source, dispose: () => rmSync(root, { recursive: true, force: true }) };
}

test('reconciles one managed E2E script and removes only the known retired fast script', () => {
  const { project, source, dispose } = fixture();
  try {
    reconcileFrameworkE2ePackageJson(false, project, source);
    const first = readFileSync(resolve(project, 'package.json'), 'utf-8');
    const pkg = readPackage(project);
    assert.equal(pkg.scripts['test:e2e'], 'node repo-e2e/scripts/runE2e.ts');
    assert.equal(Object.hasOwn(pkg.scripts, 'test:e2e:fast'), false);
    assert.equal(pkg.scripts['test:project'], 'node project-tests.ts');
    assert.deepEqual(pkg.dependencies, { 'project-owned': '^2.0.0' });
    assert.deepEqual(pkg.devDependencies, {
      'another-tool': '^3.0.0',
      '@playwright/test': '^1.62.1',
    });
    reconcileFrameworkE2ePackageJson(false, project, source);
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), first);
  } finally {
    dispose();
  }
});

test('preserves a customized fast alias and project-owned browser specs', () => {
  const { project, source, dispose } = fixture();
  try {
    const pkg = readPackage(project);
    pkg.scripts['test:e2e:fast'] = 'node project-tests.ts --quick';
    writeFile(project, 'package.json', `${JSON.stringify(pkg, null, 2)}\n`);
    reconcileFrameworkE2ePackageJson(false, project, source);
    mergeFrameworkE2eAssets(false, project, source);
    assert.equal(readPackage(project).scripts['test:e2e:fast'], 'node project-tests.ts --quick');
    for (const path of frameworkFiles) {
      assert.equal(readFileSync(resolve(project, path), 'utf-8'), `new ${path}`);
    }
    assert.equal(
      readFileSync(resolve(project, 'repo-e2e/specs/project-owned.spec.ts'), 'utf-8'),
      'project browser test',
    );
    assert.equal(existsSync(resolve(project, 'repo-e2e/config/playwright.basic.config.ts')), false);
  } finally {
    dispose();
  }
});

test('isolated dry-run reports changes without writing files or contacting npm', () => {
  const { project, source, dispose } = fixture();
  const before = readFileSync(resolve(project, 'package.json'), 'utf-8');
  try {
    reconcileFrameworkE2ePackageJson(true, project, source);
    mergeFrameworkE2eAssets(true, project, source);
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), before);
    assert.equal(
      readFileSync(resolve(project, 'repo-e2e/scripts/runE2e.ts'), 'utf-8'),
      'old repo-e2e/scripts/runE2e.ts',
    );
    assert.equal(existsSync(resolve(project, 'repo-e2e/config/playwright.basic.config.ts')), true);
    assert.equal(
      readFileSync(resolve(project, 'repo-e2e/specs/project-owned.spec.ts'), 'utf-8'),
      'project browser test',
    );
  } finally {
    dispose();
  }
});

const isolatedContractCommand = 'node scripts/generateOpenapiIsolated.ts';

function reconcileContract(project: string, source: string, dryRun = false): string {
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import { reconcileContractPackageJson } from ${JSON.stringify(new URL('./upgrade.ts', import.meta.url).href)};
       reconcileContractPackageJson(${dryRun}, ${JSON.stringify(project)}, ${JSON.stringify(source)});`,
    ],
    { encoding: 'utf8' },
  );
  const output = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, output);
  return output;
}

function addIncomingContractCommand(source: string): void {
  const pkg = readPackage(source);
  pkg.scripts['contract:generate:isolated'] = isolatedContractCommand;
  writeFile(source, 'package.json', `${JSON.stringify(pkg)}\n`);
}

test('adopts the missing isolated contract command without changing other package entries', () => {
  const { project, source, dispose } = fixture();
  try {
    addIncomingContractCommand(source);
    const before = readPackage(project);
    assert.match(reconcileContract(project, source), /Added missing.*contract:generate:isolated/);
    assert.deepEqual(readPackage(project), {
      ...before,
      scripts: { ...before.scripts, 'contract:generate:isolated': isolatedContractCommand },
    });
    const first = readFileSync(resolve(project, 'package.json'), 'utf-8');
    assert.equal(reconcileContract(project, source), '');
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), first);
  } finally {
    dispose();
  }
});

test('isolated contract reconciliation creates a missing scripts object', () => {
  const { project, source, dispose } = fixture();
  try {
    addIncomingContractCommand(source);
    writeFile(project, 'package.json', '{"name":"project-owned"}\n');
    reconcileContract(project, source);
    assert.deepEqual(readPackage(project), {
      name: 'project-owned',
      scripts: { 'contract:generate:isolated': isolatedContractCommand },
    });
  } finally {
    dispose();
  }
});

test('isolated contract reconciliation visibly preserves customized values, including empty commands', () => {
  const { project, source, dispose } = fixture();
  try {
    addIncomingContractCommand(source);
    for (const command of ['node project-contract.ts', '']) {
      const pkg = readPackage(project);
      pkg.scripts['contract:generate:isolated'] = command;
      const before = `${JSON.stringify(pkg)}\n`;
      writeFile(project, 'package.json', before);
      for (const dryRun of [false, true]) {
        const output = reconcileContract(project, source, dryRun);
        assert.match(output, /Preserved customized.*contract:generate:isolated/);
        assert.ok(output.includes(isolatedContractCommand), output);
        assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), before);
      }
    }
  } finally {
    dispose();
  }
});

test('isolated contract dry-run reports adoption without writing and matching commands are a byte-preserving no-op', () => {
  const { project, source, dispose } = fixture();
  try {
    addIncomingContractCommand(source);
    const before = readFileSync(resolve(project, 'package.json'), 'utf-8');
    assert.match(
      reconcileContract(project, source, true),
      /\[dry-run\] Add missing.*contract:generate:isolated/,
    );
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), before);

    const pkg = readPackage(project);
    pkg.scripts['contract:generate:isolated'] = isolatedContractCommand;
    const matching = `${JSON.stringify(pkg)}\n`;
    writeFile(project, 'package.json', matching);
    assert.equal(reconcileContract(project, source), '');
    assert.equal(reconcileContract(project, source, true), '');
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), matching);
  } finally {
    dispose();
  }
});

test('isolated contract reconciliation tolerates an older incoming package without the command', () => {
  const { project, source, dispose } = fixture();
  try {
    const before = readFileSync(resolve(project, 'package.json'), 'utf-8');
    assert.equal(reconcileContract(project, source), '');
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), before);
  } finally {
    dispose();
  }
});

test('Start edition is not reconciled by the Basic framework E2E upgrader', () => {
  const { project, source, dispose } = fixture();
  try {
    rmSync(resolve(project, '__CABLOY_BASIC__'));
    writeFile(project, '__CABLOY_START__', '');
    const before = readFileSync(resolve(project, 'package.json'), 'utf-8');
    reconcileFrameworkE2ePackageJson(false, project, source);
    mergeFrameworkE2eAssets(false, project, source);
    assert.equal(readFileSync(resolve(project, 'package.json'), 'utf-8'), before);
    assert.equal(
      readFileSync(resolve(project, 'repo-e2e/scripts/runE2e.ts'), 'utf-8'),
      'old repo-e2e/scripts/runE2e.ts',
    );
  } finally {
    dispose();
  }
});
