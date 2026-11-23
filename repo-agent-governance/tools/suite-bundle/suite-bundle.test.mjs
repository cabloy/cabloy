import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { readZip, verifyChecksums, writeZip } from './archive.mjs';
import { readBaseline } from './baseline.mjs';
import { BUNDLE_DIR, buildBundleModel, canonicalJson, detectEdition, sha256 } from './core.mjs';
import { planImport, applyPlan, executePostImport } from './import.mjs';
import { inspectBundle } from './inspect.mjs';

const valuePath = 'vona/src/suite/demo/src/value.ts';
const pagePath = 'zova/src/suite/demo/src/page.tsx';

function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
}

function fixture(edition = 'start', { withSsr = false } = {}) {
  const root = mkdtempSync(resolve(tmpdir(), 'cabloy-suite-bundle-'));
  git(root, 'init', '--quiet');
  writeFileSync(resolve(root, edition === 'basic' ? '__CABLOY_BASIC__' : '__CABLOY_START__'), '');
  mkdirSync(resolve(root, 'vona/src/suite/demo/src'), { recursive: true });
  mkdirSync(resolve(root, 'zova/src/suite/demo/src'), { recursive: true });
  mkdirSync(resolve(root, 'repo-specs/demo'), { recursive: true });
  writeFileSync(
    resolve(root, 'package.json'),
    `${JSON.stringify({
      scripts: {
        'vona': 'node vona-cli',
        'zova': 'node zova-cli',
        'deps:zova': 'pnpm --dir zova run zova :tools:deps',
        'deps:vona': 'pnpm --dir vona run vona :tools:deps',
        'build:zova:isolated': 'node scripts/buildZovaIsolated.ts',
        'contract:generate:isolated': 'node scripts/generateOpenapiIsolated.ts',
        'spec:charts':
          'node ./repo-agent-governance/tools/spec-charts/generate-implementation-charts.mjs',
      },
    })}\n`,
  );
  mkdirSync(resolve(root, 'zova'), { recursive: true });
  writeFileSync(
    resolve(root, 'zova/package.original.json'),
    `${JSON.stringify({
      scripts: {
        'build:isolated': 'node ../scripts/buildZovaIsolated.ts',
      },
    })}\n`,
  );
  writeFileSync(resolve(root, 'vona/src/suite/demo/package.json'), '{"name":"vona-suite-demo"}\n');
  writeFileSync(resolve(root, valuePath), 'export const value = "base";\n');
  writeFileSync(resolve(root, pagePath), 'export const page = "base";\n');
  writeFileSync(resolve(root, 'repo-specs/demo/prd.md'), '# Demo\n');
  if (withSsr) {
    mkdirSync(resolve(root, 'vona/src/suite/demo/modules/demo-site/src/bean'), { recursive: true });
    writeFileSync(
      resolve(root, 'vona/src/suite/demo/modules/demo-site/src/bean/ssrSite.demo.ts'),
      "@SsrSite({\n  siteId: 'demo',\n  publicPath: 'demo',\n  bundlePath: 'ssr-demo',\n  diagnostics: {\n    buildCommand: 'npm run build:zova:demo',\n  },\n})\n",
    );
    const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    packageJson.scripts['build:zova:demo'] = 'node scripts/buildZovaIsolated.ts demo';
    writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(packageJson)}\n`);
    const zovaPackage = JSON.parse(
      readFileSync(resolve(root, 'zova/package.original.json'), 'utf8'),
    );
    zovaPackage.scripts['build:ssr:demo'] = 'npm run build:isolated -- --operation ssr demo';
    zovaPackage.scripts['build:rest:demo'] = 'npm run build:isolated -- --operation rest demo';
    writeFileSync(resolve(root, 'zova/package.original.json'), `${JSON.stringify(zovaPackage)}\n`);
  }
  return root;
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

function bundle(root) {
  return writeZip(buildBundleModel(root, 'demo').files);
}

function legacyBundle(root, embeddedBase) {
  const { files, manifest } = buildBundleModel(root, 'demo');
  manifest.schemaVersion = 2;
  for (const resource of manifest.resources) {
    resource.basePath = `${BUNDLE_DIR}/base/${resource.path}`;
    files.set(
      resource.basePath,
      embeddedBase.get(resource.path) ?? files.get(resource.payloadPath),
    );
  }
  const checksumsPath = `${BUNDLE_DIR}/checksums.json`;
  const checksums = JSON.parse(files.get(checksumsPath));
  files.set(`${BUNDLE_DIR}/manifest.json`, Buffer.from(canonicalJson(manifest)));
  for (const [path, data] of files) {
    if (path !== checksumsPath)
      checksums.files[path] = { bytes: data.length, sha256: sha256(data) };
  }
  files.set(checksumsPath, Buffer.from(canonicalJson(checksums)));
  return writeZip(files);
}

test('version 3 packs each resource once and keeps the typed handoff', () => {
  const root = fixture();
  try {
    assert.deepEqual(detectEdition(root), { kind: 'resolved', edition: 'start' });
    const model = buildBundleModel(root, 'demo');
    assert.equal(model.manifest.kind, 'cabloy-suite-bundle');
    assert.equal(model.manifest.schemaVersion, 3);
    assert.ok([...model.files.keys()].every(path => !path.startsWith(`${BUNDLE_DIR}/base/`)));
    assert.ok(model.manifest.resources.every(resource => !Object.hasOwn(resource, 'basePath')));
    assert.ok(model.files.has(`${BUNDLE_DIR}/payload/repo-specs/demo/prd.md`));
    assert.ok(model.manifest.postImportTasks.tasks.length);
  } finally {
    cleanup(root);
  }
});

test('SSR task planning discovers paired flavor mappings', () => {
  const root = fixture('start', { withSsr: true });
  try {
    const model = buildBundleModel(root, 'demo');
    const registration = model.manifest.postImportTasks.tasks[0];
    assert.equal(registration.kind, 'ensureSsrRegistration');
    assert.deepEqual(registration.flavors, ['demo']);
    assert.equal(model.manifest.postImportTasks.tasks[4].kind, 'zovaBuildPair');
    assert.deepEqual(model.manifest.postImportTasks.tasks[4].flavors, ['demo']);
  } finally {
    cleanup(root);
  }
});

test('Basic and Start bundles preserve edition and reject cross-edition import', () => {
  const source = fixture('basic');
  const target = fixture('start');
  try {
    const model = buildBundleModel(source, 'demo');
    assert.equal(model.manifest.edition, 'basic');
    assert.throws(
      () => planImport({ root: target, buffer: writeZip(model.files) }),
      /does not match/,
    );
  } finally {
    cleanup(source);
    cleanup(target);
  }
});

test('ZIP output is deterministic and checksums validate', () => {
  const root = fixture();
  try {
    const model = buildBundleModel(root, 'demo');
    const first = writeZip(model.files);
    const second = writeZip(model.files);
    assert.deepEqual(first, second);
    const archive = readZip(first);
    verifyChecksums(archive.files);
    assert.equal(inspectBundle(first).suite, 'demo');
  } finally {
    cleanup(root);
  }
});

test('dry-run import does not write and clean apply is idempotent', () => {
  const source = fixture();
  const target = fixture();
  try {
    const archive = bundle(source);
    const before = readFileSync(resolve(target, valuePath));
    rmSync(resolve(target, pagePath));
    const planned = planImport({ root: target, buffer: archive });
    assert.equal(planned.baseline.source, 'none');
    assert.equal(planned.plan.find(item => item.path === valuePath).kind, 'UNCHANGED');
    assert.equal(planned.plan.find(item => item.path === pagePath).kind, 'ADD');
    assert.equal(existsSync(resolve(target, pagePath)), false);
    assert.equal(existsSync(resolve(planned.statePath, '..')), false);
    assert.deepEqual(readFileSync(resolve(target, valuePath)), before);
    applyPlan(planned);
    const repeated = planImport({ root: target, buffer: archive });
    assert.deepEqual(repeated.baseline, { source: 'saved', sha256: sha256(archive) });
    assert.ok(repeated.plan.every(item => item.kind === 'UNCHANGED'));
  } finally {
    cleanup(source);
    cleanup(target);
  }
});

test('post-import execution uses fixed commands and stops on failure', () => {
  const root = fixture();
  try {
    const model = buildBundleModel(root, 'demo');
    const archive = writeZip(model.files);
    const result = planImport({ root, buffer: archive });
    applyPlan(result);
    const calls = [];
    const execution = executePostImport(result, {
      root,
      execute(command, args, options) {
        calls.push({ command, args, options });
        return { status: calls.length === 2 ? 1 : 0 };
      },
    });
    assert.equal(execution.failed?.id, 'zova-metadata-demo');
    assert.equal(execution.pending.length > 0, true);
    assert.equal(calls[0].command, 'npm');
    assert.equal(calls[0].options.shell, false);
    assert.equal(calls[0].args.includes('install'), false);
    assert.deepEqual(readBaseline(result.statePath).buffer, archive);
  } finally {
    cleanup(root);
  }
});

for (const edition of ['basic', 'start']) {
  test(`${edition}: skipped releases merge against the actual import and preserve upstream bytes`, () => {
    const source = fixture(edition);
    const target = fixture(edition);
    const value = (upstream, local = 'original') =>
      `// ${upstream}\n\nexport const value = 1;\n\n// ${local}\n`;
    try {
      rmSync(resolve(target, valuePath));
      writeFileSync(resolve(source, valuePath), value('v1'));
      const v1 = bundle(source);
      applyPlan(planImport({ root: target, buffer: v1 }));

      writeFileSync(resolve(target, valuePath), value('v1', 'local'));
      writeFileSync(resolve(source, valuePath), value('v2'));
      assert.notDeepEqual(bundle(source), v1);
      writeFileSync(resolve(source, valuePath), value('v3'));
      rmSync(resolve(source, pagePath));
      const v3 = bundle(source);
      const upgrade = planImport({ root: target, buffer: v3 });
      assert.equal(upgrade.baseline.sha256, sha256(v1));
      assert.equal(upgrade.plan.find(item => item.path === valuePath).kind, 'MERGED');
      assert.deepEqual(readBaseline(upgrade.statePath).buffer, v1);
      applyPlan(upgrade);
      assert.equal(readFileSync(resolve(target, valuePath), 'utf8'), value('v3', 'local'));
      assert.ok(existsSync(resolve(target, pagePath)), 'absent upstream files are not deleted');
      assert.deepEqual(readBaseline(upgrade.statePath).buffer, v3);

      const repeated = planImport({ root: target, buffer: v3 });
      assert.equal(repeated.plan.find(item => item.path === valuePath).kind, 'LOCAL-ONLY');
      writeFileSync(resolve(source, valuePath), value('v4', 'publisher'));
      const conflict = planImport({ root: target, buffer: bundle(source) });
      assert.equal(conflict.plan.find(item => item.path === valuePath).kind, 'CONFLICT');
      assert.throws(() => applyPlan(conflict), { code: 2 });
      assert.equal(readFileSync(resolve(target, valuePath), 'utf8'), value('v3', 'local'));
      assert.deepEqual(readBaseline(upgrade.statePath).buffer, v3);
    } finally {
      cleanup(source);
      cleanup(target);
    }
  });
}

test('legacy embedded base is ignored; migration requires an explicit original release', () => {
  const source = fixture();
  const target = fixture();
  try {
    const oldValue = readFileSync(resolve(target, valuePath));
    const v1 = legacyBundle(source, new Map());
    const newValue = Buffer.from('export const value = "upstream";\n');
    writeFileSync(resolve(source, valuePath), newValue);
    const incoming = legacyBundle(source, new Map([[valuePath, oldValue]]));
    const first = planImport({ root: target, buffer: incoming });
    assert.equal(first.plan.find(item => item.path === valuePath).kind, 'CONFLICT');
    assert.throws(() => applyPlan(first), { code: 2 });
    assert.equal(readBaseline(first.statePath), null);
    assert.deepEqual(readFileSync(resolve(target, valuePath)), oldValue);
    assert.throws(
      () => planImport({ root: target, buffer: incoming, baselineBuffer: incoming }),
      /previous release, not the incoming ZIP/,
    );

    const migration = planImport({ root: target, buffer: incoming, baselineBuffer: v1 });
    assert.deepEqual(migration.baseline, { source: 'explicit', sha256: sha256(v1) });
    assert.equal(migration.plan.find(item => item.path === valuePath).kind, 'UPDATE');
    applyPlan(migration);
    assert.deepEqual(readFileSync(resolve(target, valuePath)), newValue);
    assert.deepEqual(readBaseline(migration.statePath).buffer, incoming);
    assert.throws(
      () => planImport({ root: target, buffer: incoming, baselineBuffer: v1 }),
      /saved import baseline already exists/,
    );
  } finally {
    cleanup(source);
    cleanup(target);
  }
});

test('ordinary ZIP and a damaged saved release are not accepted as suite snapshots', () => {
  const root = fixture();
  try {
    const ordinary = writeZip(new Map([['README.md', Buffer.from('# Attachment')]]));
    assert.throws(() => planImport({ root, buffer: ordinary }), /missing checksums/);
    const archive = bundle(root);
    const first = planImport({ root, buffer: archive });
    applyPlan(first);
    writeFileSync(first.statePath, 'damaged');
    assert.throws(() => planImport({ root, buffer: archive }), /failed checksum validation/);
  } finally {
    cleanup(root);
  }
});

test('a stale import plan cannot replace an intervening baseline or local edit', () => {
  const source = fixture();
  const target = fixture();
  try {
    const archive = bundle(source);
    const first = planImport({ root: target, buffer: archive });
    const stale = planImport({ root: target, buffer: archive });
    applyPlan(first);
    assert.throws(() => applyPlan(stale), /baseline changed after planning/);

    writeFileSync(resolve(source, valuePath), '// upstream\n');
    const upgrade = planImport({ root: target, buffer: bundle(source) });
    writeFileSync(resolve(target, valuePath), '// local\n');
    assert.throws(() => applyPlan(upgrade), /destination changed after planning/);
    assert.equal(readFileSync(resolve(target, valuePath), 'utf8'), '// local\n');
    assert.deepEqual(readBaseline(first.statePath).buffer, archive);
  } finally {
    cleanup(source);
    cleanup(target);
  }
});

test('linked Git worktrees do not share an import baseline', () => {
  const root = fixture();
  const linked = mkdtempSync(resolve(tmpdir(), 'cabloy-suite-linked-'));
  try {
    git(root, 'add', '.');
    git(
      root,
      '-c',
      'user.name=Suite Test',
      '-c',
      'user.email=suite@example.test',
      'commit',
      '--no-gpg-sign',
      '-m',
      'Fixture',
    );
    git(root, 'worktree', 'add', '--detach', linked);
    const archive = bundle(root);
    const first = planImport({ root, buffer: archive });
    applyPlan(first);
    const second = planImport({ root: linked, buffer: archive });
    assert.equal(second.baseline.source, 'none');
    assert.notEqual(second.statePath, first.statePath);
    applyPlan(second);
    assert.deepEqual(readBaseline(second.statePath).buffer, archive);
  } finally {
    cleanup(linked);
    cleanup(root);
  }
});

test('a source write error restores earlier files and leaves the saved baseline intact', () => {
  const source = fixture();
  const target = fixture();
  const parent = resolve(target, pagePath, '..');
  try {
    const original = bundle(source);
    applyPlan(planImport({ root: target, buffer: original }));
    const newPath = 'repo-specs/demo/new/branch/notes.md';
    mkdirSync(resolve(source, newPath, '..'), { recursive: true });
    writeFileSync(resolve(source, newPath), '# New notes\n');
    const beforeValue = readFileSync(resolve(target, valuePath));
    const beforePage = readFileSync(resolve(target, pagePath));
    writeFileSync(resolve(source, valuePath), '// changed\n');
    writeFileSync(resolve(source, pagePath), '// changed\n');
    const upgrade = planImport({ root: target, buffer: bundle(source) });
    assert.deepEqual(
      upgrade.plan.filter(item => item.kind === 'UPDATE').map(item => item.path),
      [valuePath, pagePath],
    );
    if (process.platform === 'win32' || process.getuid?.() === 0) {
      // Exercise the same rollback with a write failure where POSIX permissions cannot do it.
      upgrade.plan.find(item => item.path === pagePath).data = undefined;
      assert.throws(() => applyPlan(upgrade), { code: 'ERR_INVALID_ARG_TYPE' });
    } else {
      chmodSync(parent, 0o555);
      assert.throws(() => applyPlan(upgrade), { code: 'EACCES' });
    }
    assert.deepEqual(readFileSync(resolve(target, valuePath)), beforeValue);
    assert.deepEqual(readFileSync(resolve(target, pagePath)), beforePage);
    assert.equal(existsSync(resolve(target, 'repo-specs/demo/new')), false);
    assert.deepEqual(readBaseline(upgrade.statePath).buffer, original);
  } finally {
    chmodSync(parent, 0o755);
    cleanup(source);
    cleanup(target);
  }
});
