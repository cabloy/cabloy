import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const coreVersion = readFileSync(join(root, 'vona/pnpm-workspace.yaml'), 'utf8').match(
  /^\s*zova-core@(\d+\.\d+\.\d+):\s+patches\/zova-core@\1\.patch\s*$/m,
)![1];
const coauthor = ' -m "Co-Authored-By: Claude <noreply@anthropic.com>"';
const sourceChecks = [
  'node scripts/typecheck.ts native zova --noEmit --incremental false --project tsconfig.vue-tsc.json',
  'node scripts/typecheck.ts native vona --noEmit --incremental false --project tsconfig.json',
];
const patch = readFileSync(join(root, `vona/patches/zova-core@${coreVersion}.patch`), 'utf8');

function fixture(
  options: {
    mismatch?: boolean;
    missingPatch?: boolean;
    failVerification?: boolean;
    failSubprojects?: boolean;
    failSourceCheck?: boolean;
    failRootCheck?: boolean;
    baseline?: string;
    marker?: string;
    rootTags?: string[];
    missingPackageTag?: boolean;
    progressDuringSubprojects?: boolean;
  } = {},
) {
  const dir = mkdtempSync(join(tmpdir(), 'cabloy-release-'));
  const write = (file: string, content: string) => {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), content);
  };
  const scripts = Object.fromEntries(
    [
      'release-patch',
      'release-minor',
      'release-major',
      'release',
      'release:dry-run',
      'release:changelog',
      'release:publish',
      'release:github',
    ].map(name => {
      const command = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts[name];
      return [name, command];
    }),
  );
  write('__CABLOY_BASIC__', '');
  write(
    'package.json',
    JSON.stringify({
      name: 'cabloy',
      type: 'module',
      version: options.baseline ?? '5.1.252',
      scripts,
    }),
  );
  write('.cabloy-version', `${options.marker ?? options.baseline ?? '5.1.252'}\n`);
  write('vona/package.json', '{}');
  write('vona/package.original.json', '{}');
  write('zova/package.json', '{}');
  write('zova/package.original.json', '{}');
  write('zova/pnpm-lock.yaml', 'initial lockfile\n');
  write(
    'zova/packages-zova/zova-core/package.json',
    JSON.stringify({ name: 'zova-core', version: options.mismatch ? '5.1.97' : '5.1.96' }),
  );
  write(
    'vona/pnpm-workspace.yaml',
    'patchedDependencies:\n  zova-core@5.1.96: patches/zova-core@5.1.96.patch\n',
  );
  write('vona/pnpm-lock.yaml', 'zova-core@5.1.96:\n');
  if (!options.missingPatch) write('vona/patches/zova-core@5.1.96.patch', patch);
  mkdirSync(join(dir, 'scripts'));
  copyFileSync(join(root, 'scripts/release.ts'), join(dir, 'scripts/release.ts'));
  symlinkSync(
    join(root, 'node_modules'),
    join(dir, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  // Intercept every subprocess, including git/npm, so the real release entrypoint cannot publish.
  write(
    'hooks.mjs',
    `
    import { registerHooks } from 'node:module';
    const source = ${JSON.stringify(String.raw`
      import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
      import { dirname, join } from 'node:path';
      const root = process.cwd();
      let dirty = false;
      function write(file, content) {
        mkdirSync(dirname(join(root, file)), { recursive: true });
        writeFileSync(join(root, file), content);
      }
      export function execSync(command, options = {}) {
        appendFileSync(join(root, 'calls.jsonl'), JSON.stringify({ command, cwd: options.cwd }) + '\n');
        if (command === 'git rev-parse --is-inside-work-tree') return 'true';
        if (command === 'git status --porcelain') return dirty ? ' M zova/pnpm-lock.yaml' : '';
        if (command === 'git tag -l') return ${JSON.stringify(options.missingPackageTag ? '' : 'zova-core@5.1.97\nzova-core@5.1.96')};
        if (command.startsWith('git tag -l')) return ${JSON.stringify((options.rootTags ?? ['cabloy@5.1.252']).join('\n'))};
        if (command === 'lerna list --json') return JSON.stringify([JSON.parse(readFileSync(join(root, 'zova/packages-zova/zova-core/package.json'), 'utf8'))]);
        if (command.includes('diff --name-only')) return 'scripts/release.ts';
        if (command.startsWith('git commit')) { dirty = false; return ''; }
        if (/^git (add|tag|push)\b/.test(command)) return '';
        if (command.startsWith('lerna publish')) {
          if (${Boolean(options.failSubprojects)}) throw new Error('synthetic subproject failure');
          if (command !== 'lerna publish from-package --yes') {
            write('zova/packages-zova/zova-core/package.json', JSON.stringify({ name: 'zova-core', version: '5.1.97' }));
            dirty = true;
          }
          if (${Boolean(options.progressDuringSubprojects)}) {
            const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
            pkg.version = '5.1.253';
            write('package.json', JSON.stringify(pkg));
            write('.cabloy-version', '5.1.253\n');
          }
          return '';
        }
        if (command.startsWith('node scripts/typecheck.ts native ')) {
          if (${Boolean(options.failSourceCheck)}) throw new Error('synthetic source check failure');
          return '';
        }
        if (command === 'npm run tsc' && ${Boolean(options.failRootCheck)}) throw new Error('synthetic root check failure');
        if (command === 'pnpm install' || command.startsWith('pnpm --dir ')) {
          const workspace = readFileSync(join(root, 'vona/pnpm-workspace.yaml'), 'utf8');
          write('vona/pnpm-lock.yaml', workspace.includes('zova-core@5.1.97:') ? 'zova-core@5.1.97:\n' : 'unpatched\n');
          if (options.cwd === join(root, 'zova')) write('zova/pnpm-lock.yaml', 'refreshed lockfile\n');
          return '';
        }
        if (command.startsWith('pnpm patch ')) {
          const editDir = command.match(/--edit-dir "([^"]+)"/)[1];
          const files = {
            'dist/bean/resource/error/errorGlobal.d.ts': 'declare global {}\n',
            'dist/types/utils/env.d.ts': 'declare global {\n    namespace NodeJS {\n        interface ProcessEnv {\n        }\n    }\n}\n',
            'dist/types/interface/module.d.ts': "declare module '@cabloy/module-info' {\n    interface IModule {\n    }\n}\n",
          };
          for (const [file, content] of Object.entries(files)) {
            const path = join(editDir, file);
            mkdirSync(dirname(path), { recursive: true });
            writeFileSync(path, content);
          }
          return '';
        }
        if (command.startsWith('pnpm patch-commit ')) {
          write('vona/patches/zova-core@5.1.97.patch', ${JSON.stringify(patch)});
          write('vona/pnpm-workspace.yaml', 'patchedDependencies:\n  zova-core@5.1.97: patches/zova-core@5.1.97.patch\n');
          return '';
        }
        if (command.startsWith('pnpm exec tsc ')) {
          if (${Boolean(options.failVerification)}) throw new Error('synthetic patch verification failure');
          return '';
        }
        if (command === 'npm publish' || command === 'npm run build:zova:isolated -- cabloyBasicAdmin cabloyBasicWeb') return '';
        if (/^npm run (test:agent-governance|agent:governance:check|agent:governance:pack-check|tsc|zova :tools:deps|deps:vona|build:zova:admin|build:zova:web)$/.test(command)) return '';
        throw new Error('Unexpected subprocess: ' + command);
      }
    `)};
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier === 'node:child_process' && context.parentURL.endsWith('/scripts/release.ts')) {
        return { url: 'data:text/javascript,' + encodeURIComponent(source), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    } });
  `,
  );
  return {
    dir,
    run(args: string[]) {
      const result = spawnSync(
        process.execPath,
        [
          '--import',
          './hooks.mjs',
          'scripts/release.ts',
          '--skip-changelog',
          '--skip-release',
          ...args,
        ],
        { cwd: dir, encoding: 'utf8', timeout: 30_000 },
      );
      assert.equal(result.error, undefined);
      assert.equal(result.signal, null, result.stderr);
      const calls = readFileSync(join(dir, 'calls.jsonl'), 'utf8')
        .trim()
        .split('\n')
        .map(line => JSON.parse(line).command as string);
      return { ...result, calls };
    },
    dispose() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

test('synchronizes and verifies the patch after one subproject release and before the root snapshot', () => {
  const f = fixture();
  try {
    const result = f.run([]);
    assert.equal(result.status, 0, result.stderr);
    const { calls } = result;
    const lerna = calls.indexOf('lerna publish patch --yes');
    const patching = calls.findIndex(command => command.startsWith('pnpm patch zova-core@5.1.97 '));
    const verify = calls.indexOf('pnpm exec tsc -p tsconfig.json --noEmit');
    const commit = calls.indexOf(`git commit -m "chore: pre-release commit"${coauthor}`);
    const version = calls.indexOf(`git commit -m "chore: release v5.1.253"${coauthor}`);
    const publish = calls.indexOf('npm publish');
    assert.ok(
      lerna >= 0 &&
        patching > lerna &&
        verify > patching &&
        commit > verify &&
        version > commit &&
        publish > version,
    );
    assert.equal(calls.filter(command => command.startsWith('lerna publish')).length, 1);
    assert.equal(calls.filter(command => command === 'npm publish').length, 1);
    assert.ok(calls.every(command => !command.startsWith('node ')));
    assert.match(
      readFileSync(join(f.dir, 'vona/pnpm-workspace.yaml'), 'utf8'),
      /zova-core@5\.1\.97/,
    );
    assert.equal(readFileSync(join(f.dir, 'zova/pnpm-lock.yaml'), 'utf8'), 'refreshed lockfile\n');
  } finally {
    f.dispose();
  }
});

test('resumes assigned subproject versions and verifies compensation before the root snapshot', () => {
  const f = fixture({ mismatch: true });
  try {
    const coreFile = join(f.dir, 'zova/packages-zova/zova-core/package.json');
    const before = readFileSync(coreFile, 'utf8');
    const result = f.run(['patch', '--resume-subprojects', '5.1.253']);
    assert.equal(result.status, 0, result.stderr);
    const { calls } = result;
    const lerna = calls.indexOf('lerna publish from-package --yes');
    const prep = calls.indexOf('npm run zova :tools:deps');
    const build = calls.indexOf('npm run build:zova:isolated -- cabloyBasicAdmin cabloyBasicWeb');
    const patching = calls.findIndex(command => command.startsWith('pnpm patch zova-core@5.1.97 '));
    const verify = calls.indexOf('pnpm exec tsc -p tsconfig.json --noEmit');
    const fullCheck = calls.indexOf('npm run tsc');
    const version = calls.indexOf(`git commit -m "chore: release v5.1.253"${coauthor}`);
    assert.ok(
      sourceChecks.every(command => calls.includes(command) && calls.indexOf(command) < lerna),
    );
    assert.ok(
      lerna >= 0 &&
        prep > lerna &&
        build > prep &&
        patching > build &&
        verify > patching &&
        fullCheck > verify &&
        version > fullCheck,
    );
    assert.equal(calls.filter(command => command.startsWith('lerna publish')).length, 1);
    assert.equal(calls.filter(command => command === 'npm run tsc').length, 1);
    assert.ok(
      !calls.includes('npm run build:zova:admin') && !calls.includes('npm run build:zova:web'),
    );
    assert.equal(readFileSync(coreFile, 'utf8'), before);
    assert.equal(JSON.parse(readFileSync(join(f.dir, 'package.json'), 'utf8')).version, '5.1.253');
    assert.equal(readFileSync(join(f.dir, '.cabloy-version'), 'utf8'), '5.1.253\n');
    assert.equal(calls.filter(command => command === 'npm publish').length, 1);
    assert.ok(
      calls
        .filter(command => command.startsWith('git commit'))
        .every(command => command.endsWith(coauthor)),
    );
  } finally {
    f.dispose();
  }
});

test('rejects invalid resume targets, conflicting modes, and progressed root snapshots before mutation', () => {
  const cases = [
    { args: ['--resume-subprojects'], error: /requires an explicit target/ },
    { args: ['--resume-subprojects', 'invalid'], error: /requires an explicit target/ },
    { args: ['--resume-subprojects', '5.1.254'], error: /target must be the patch bump/ },
    {
      args: ['--resume-subprojects', '5.1.253', '--publish-only'],
      error: /requires a full release/,
    },
    {
      args: ['--resume-subprojects', '5.1.253', '--changelog-only'],
      error: /requires a full release/,
    },
    {
      args: ['--resume-subprojects', '5.1.253', '--release-only'],
      error: /requires a full release/,
    },
    { options: { marker: '5.1.251' }, error: /must agree/ },
    { options: { baseline: '5.1.253' }, error: /target must be the patch bump/ },
    {
      options: { rootTags: ['cabloy@5.1.253', 'cabloy@5.1.252'] },
      error: /target tag.*already exists/,
    },
    { options: { rootTags: ['cabloy@5.1.251'] }, error: /newest root release tag/ },
    { options: { missingPackageTag: true }, error: /manifest version has no matching tag/ },
  ];
  for (const entry of cases) {
    const f = fixture(entry.options);
    try {
      const result = f.run(entry.args ?? ['--resume-subprojects', '5.1.253']);
      assert.equal(result.status, 1);
      assert.match(result.stderr, entry.error);
      assert.ok(
        result.calls.every(
          command => command.startsWith('git ') || command === 'lerna list --json',
        ),
      );
      assert.equal(
        readFileSync(join(f.dir, '.cabloy-version'), 'utf8'),
        `${entry.options?.baseline ?? entry.options?.marker ?? '5.1.252'}\n`,
      );
    } finally {
      f.dispose();
    }
  }
});

test('resume stops on source, subproject, or final typecheck failure and rechecks the root target', () => {
  for (const options of [
    { failSourceCheck: true },
    { failSubprojects: true },
    { failRootCheck: true },
    { progressDuringSubprojects: true },
  ]) {
    const f = fixture({ mismatch: true, ...options });
    try {
      const result = f.run(['--resume-subprojects', '5.1.253']);
      assert.equal(result.status, 1);
      assert.ok(!result.calls.includes('npm publish'));
      assert.ok(!result.calls.some(command => command.startsWith('git tag cabloy@')));
      if (options.failSourceCheck) {
        assert.match(result.stderr, /synthetic source check failure/);
        assert.ok(!result.calls.some(command => command.startsWith('lerna publish')));
      }
      if (options.failSubprojects) {
        assert.match(result.stderr, /synthetic subproject failure/);
        assert.ok(
          !result.calls.some(command =>
            /^(pnpm |npm run (zova|build|deps)|git commit)/.test(command),
          ),
        );
      }
      if (options.failRootCheck) assert.match(result.stderr, /synthetic root check failure/);
      if (options.progressDuringSubprojects)
        assert.match(result.stderr, /target must be the patch bump/);
    } finally {
      f.dispose();
    }
  }
});

test('patch verification failure prevents root versioning and publication', () => {
  const f = fixture({ failVerification: true });
  try {
    const result = f.run([]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /synthetic patch verification failure/);
    assert.ok(!result.calls.includes('npm publish'));
    assert.ok(!result.calls.some(command => command.startsWith('git tag cabloy@')));
  } finally {
    f.dispose();
  }
});

test('publish-only cannot bypass a mismatched or missing patch', () => {
  for (const options of [{ mismatch: true }, { missingPatch: true }]) {
    const f = fixture(options);
    try {
      const result = f.run(['--publish-only', '--skip-compensation']);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /patch must match before publishing|patch is missing or empty/);
      assert.ok(!result.calls.includes('npm publish'));
      assert.ok(!result.calls.some(command => command.startsWith('lerna publish')));
    } finally {
      f.dispose();
    }
  }
});

test('publish-only accepts an aligned snapshot without publishing subprojects', () => {
  const f = fixture();
  try {
    const result = f.run(['--publish-only']);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.calls.filter(command => command === 'npm publish').length, 1);
    assert.ok(!result.calls.some(command => command.startsWith('lerna publish')));
    assert.ok(!result.calls.some(command => command.startsWith('git commit')));
  } finally {
    f.dispose();
  }
});

test('dry-run previews ordinary and resume synchronization without changing release files', () => {
  for (const resume of [false, true]) {
    const f = fixture({ mismatch: true });
    try {
      const files = [
        'package.json',
        '.cabloy-version',
        'vona/pnpm-workspace.yaml',
        'vona/pnpm-lock.yaml',
        'zova/pnpm-lock.yaml',
        'zova/packages-zova/zova-core/package.json',
      ];
      const before = files.map(file => readFileSync(join(f.dir, file), 'utf8'));
      const result = f.run(['--dry-run', ...(resume ? ['--resume-subprojects', '5.1.253'] : [])]);
      assert.equal(result.status, 0, result.stderr);
      const lerna = result.stdout.indexOf('[dry-run] lerna publish');
      const sync = result.stdout.indexOf('Synchronizing the Vona zova-core patch');
      const publish = result.stdout.indexOf('[dry-run] npm publish');
      assert.ok(lerna >= 0 && sync > lerna && publish > sync);
      assert.ok(
        result.calls.every(
          command => command.startsWith('git ') || (resume && command === 'lerna list --json'),
        ),
      );
      if (resume) {
        assert.match(result.stdout, /\[dry-run\] lerna publish from-package --yes/);
        assert.match(
          result.stdout,
          /\[dry-run\] npm run build:zova:isolated -- cabloyBasicAdmin cabloyBasicWeb/,
        );
        assert.ok(!result.stdout.includes('[dry-run] Run npm run build:zova:admin'));
      }
      assert.deepEqual(
        files.map(file => readFileSync(join(f.dir, file), 'utf8')),
        before,
      );
    } finally {
      f.dispose();
    }
  }
});
