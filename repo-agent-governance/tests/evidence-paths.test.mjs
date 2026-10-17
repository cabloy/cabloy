import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { Readable, Writable } from 'node:stream';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  checkPaths,
  createMatcher,
  DEFAULT_REPO_ROOT,
  FILE_LIMIT,
  LINE_LIMIT,
  runCli,
  sanitizeStream,
} from '../tools/evidence-paths/sanitize.mjs';

const CLI = fileURLToPath(new URL('../tools/evidence-paths/sanitize.mjs', import.meta.url));
const matcher = createMatcher({
  repoRoot: '/synthetic/checkout',
  maps: [{ root: '/synthetic/other', alias: 'OTHER' }],
});

async function fixture(t, files = {}) {
  const root = await mkdtemp(join(await realpath(tmpdir()), 'evidence-paths-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, name)), { recursive: true });
    await writeFile(join(root, name), content);
  }
  return root;
}

function cli(args, input = '', options = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    input,
    maxBuffer: 4 * LINE_LIMIT,
    ...options,
  });
}

async function symlinkOrSkip(t, target, path, type) {
  try {
    await symlink(target, path, type);
    return true;
  } catch (error) {
    if (process.platform === 'win32' && ['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
      t.skip(`Windows ${type} link creation unavailable (${error.code})`);
      return false;
    }
    throw error;
  }
}

function sink() {
  let text = '';
  const stream = new Writable({
    write(chunk, _encoding, done) {
      text += chunk.toString('utf8');
      done();
    },
  });
  return { stream, text: () => text };
}

async function streamed(chunks, options = {}) {
  const output = sink();
  await sanitizeStream(Readable.from(chunks), output.stream, { matcher, ...options });
  return output.text();
}

test('module import is inert and repo default is anchored to the tool rather than cwd', async t => {
  assert.equal(DEFAULT_REPO_ROOT, resolve(CLI, '../../../..'));
  const cwd = await fixture(t);
  const imported = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(CLI).href)})`],
    {
      cwd,
      encoding: 'utf8',
      input: 'unconsumed input',
    },
  );
  assert.equal(imported.status, 0);
  assert.equal(imported.stdout, '');
  assert.equal(imported.stderr, '');
  const result = cli(['sanitize'], `${join(DEFAULT_REPO_ROOT, 'sample.mjs')}\n`, { cwd });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, 'sample.mjs\n');
});

test('native paths with spaces and Unicode work in matchers, CLI arguments and checker scopes', async t => {
  const root = await fixture(t, {
    'repo space-é/source 文件.txt': 'clean\n',
    'mapped space-🙂/evidence.txt': '/home/Secret/a\n',
  });
  const repoRoot = join(root, 'repo space-é');
  const mappedRoot = join(root, 'mapped space-🙂');
  const source = join(repoRoot, 'source 文件.txt');
  const evidence = join(mappedRoot, 'evidence.txt');
  const nativeMatcher = createMatcher({ repoRoot, maps: [{ root: mappedRoot, alias: 'OTHER' }] });
  const input = `"${source}":3:4\n"${evidence}"\n${pathToFileURL(source).href}\n`;
  const expected = '"source 文件.txt":3:4\n"<OTHER>/evidence.txt"\nsource 文件.txt\n';
  assert.equal(nativeMatcher.find(input).length, 3);
  assert.equal(nativeMatcher.sanitize(input), expected);
  assert.equal(nativeMatcher.find(expected).length, 0);
  const sanitized = cli(
    ['sanitize', '--repo-root', repoRoot, '--map', `${mappedRoot}=OTHER`],
    input,
  );
  assert.equal(sanitized.status, 0);
  assert.equal(sanitized.stdout, expected);
  assert.equal(sanitized.stderr, '');

  const checked = await checkPaths([root], { matcher: nativeMatcher });
  assert.deepEqual(checked, {
    status: 1,
    diagnostics: ['scope-1/mapped space-🙂/evidence.txt:1 PATH_FOUND'],
  });
  const command = cli(['check', '--repo-root', repoRoot, '--', root]);
  assert.equal(command.status, checked.status);
  assert.equal(command.stdout, `${checked.diagnostics.join('\n')}\n`);
  assert.equal(command.stderr, '');
  assert.deepEqual(await checkPaths([source, evidence], { matcher: nativeMatcher }), {
    status: 1,
    diagnostics: ['scope-2/evidence.txt:1 PATH_FOUND'],
  });
  const relative = cli(['check', '--', 'source 文件.txt', '../mapped space-🙂/evidence.txt'], '', {
    cwd: repoRoot,
  });
  assert.equal(relative.status, 1);
  assert.equal(relative.stdout, 'scope-2/evidence.txt:1 PATH_FOUND\n');
  assert.equal(relative.stderr, '');
  if (process.platform === 'win32') {
    assert.deepEqual(
      await checkPaths([source.replaceAll('\\', '/'), evidence.replaceAll('\\', '/')], {
        matcher: nativeMatcher,
      }),
      { status: 1, diagnostics: ['scope-2/evidence.txt:1 PATH_FOUND'] },
    );
  }
});

test('checkout, explicit aliases, overlap priority and root boundary semantics', () => {
  const overlap = createMatcher({
    repoRoot: '/synthetic/repo',
    maps: [
      { root: '/synthetic', alias: 'WORK' },
      { root: '/synthetic/repo/vendor', alias: '<VENDOR>' },
    ],
  });
  const input =
    '/synthetic/repo /synthetic/repo/a.ts:10:2 /synthetic/repo/vendor/b.js /synthetic/repository/c';
  assert.equal(overlap.sanitize(input), '. a.ts:10:2 <VENDOR>/b.js <WORK>/repository/c');
  assert.equal(
    matcher.sanitize('/synthetic/checkout-other/a /synthetic/otherness/a x/synthetic/checkout/a'),
    '/synthetic/checkout-other/a /synthetic/otherness/a x/synthetic/checkout/a',
  );
  assert.equal(matcher.sanitize('/synthetic/other /synthetic/other/a'), '<OTHER> <OTHER>/a');
  assert.equal(
    matcher.sanitize('/synthetic/other/../private /synthetic/checkout/../private'),
    '<PRIVATE_PATH> <PRIVATE_PATH>',
  );
  assert.equal(
    matcher.sanitize('"/synthetic/checkout/folder /home/Secret/a"'),
    '"folder <PRIVATE_PATH>"',
  );
  const homeRepo = createMatcher({ repoRoot: '/Users/Example/project' });
  assert.equal(
    homeRepo.sanitize('/Users/Example/project/src/a /Users/Example/elsewhere/a'),
    'src/a <PRIVATE_PATH>',
  );
});

test('invalid aliases, roots and conflicting replacements fail with safe constant errors', () => {
  for (const alias of ['secret-name', 'Name', '<BAD', 'A/B', '', '<NAME>\n']) {
    assert.throws(
      () => createMatcher({ maps: [{ root: '/synthetic/map', alias }] }),
      /^Error: INVALID_ALIAS$/u,
    );
  }
  for (const root of ['relative/private', '/', 'C:\\', '/synthetic/../private', '/secret\npath']) {
    assert.throws(() => createMatcher({ repoRoot: root }), /^Error: INVALID_ROOT$/u);
  }
  assert.throws(
    () =>
      createMatcher({
        repoRoot: '/synthetic/root',
        maps: [{ root: '/synthetic/root', alias: 'ROOT' }],
      }),
    /^Error: CONFLICTING_ROOT$/u,
  );
  assert.throws(
    () => createMatcher({ repoRoot: 'C:\\Repo', maps: [{ root: 'c:/repo/', alias: 'ROOT' }] }),
    /^Error: CONFLICTING_ROOT$/u,
  );
  const duplicate = createMatcher({
    maps: [
      { root: '/synthetic/root/', alias: 'ROOT' },
      { root: '/synthetic/root', alias: '<ROOT>' },
    ],
  });
  assert.equal(duplicate.sanitize('/synthetic/root/file'), '<ROOT>/file');
});

test('bounded POSIX private coverage removes identity and full tokens, preserving stack suffixes', () => {
  const roots = [
    '/Users/Identity',
    '/home/Identity',
    '/tmp',
    '/private/tmp',
    '/var/folders/ab/Identity',
    '/private/var/folders/ab/Identity',
  ];
  for (const root of roots) {
    assert.equal(
      matcher.sanitize(`at (${root}/private/project/file.ts:123:45)`),
      'at (<PRIVATE_PATH>:123:45)',
    );
    assert.equal(matcher.sanitize(`"${root}/folder with spaces/file.txt"`), '"<PRIVATE_PATH>"');
  }
  for (const root of [homedir(), tmpdir()]) {
    assert.equal(matcher.sanitize(`"${root}/identity-sensitive/file"`), '"<PRIVATE_PATH>"');
  }
  assert.equal(matcher.sanitize('"/Users/Full Name/private folder/file"'), '"<PRIVATE_PATH>"');
});

test('Windows native, forward, escaped and UNC conventions', () => {
  const input = [
    String.raw`C:\Users\Secret\project\a.ts:3:4`,
    'D:/Users/Secret/project/a.ts:3:4',
    String.raw`C:\\Users\\Secret\\project\\a.ts:3:4`,
    String.raw`C:\Temp\private\file`,
    String.raw`C:\Windows\Temp\private\file`,
    String.raw`\\private-server\private-share\account\file:2:8`,
    String.raw`\\\\private-server\\private-share\\account\\file:2:8`,
    String.raw`"C:\Users\Full Name\private folder\file"`,
  ];
  for (const value of input) {
    const output = matcher.sanitize(value);
    assert.ok(output.includes('<PRIVATE_PATH>'), JSON.stringify(value));
    assert.doesNotMatch(
      output,
      /Secret|private-server|private-share|account|Full Name|private folder/u,
    );
    if (value.endsWith(':3:4')) assert.ok(output.endsWith(':3:4'));
  }
  const windows = createMatcher({
    repoRoot: String.raw`C:\Workspace\Repo`,
    maps: [
      { root: String.raw`\\host\share\root`, alias: 'SHARED' },
      { root: String.raw`D:\Work Area`, alias: 'WORK' },
    ],
  });
  assert.equal(windows.sanitize(String.raw`c:\workspace\repo\src\file.ts:1:2`), 'src/file.ts:1:2');
  assert.equal(windows.sanitize(String.raw`C:\\Workspace\\Repo\\src\\file.ts`), 'src/file.ts');
  assert.equal(windows.sanitize(String.raw`\\host\share\root\file`), '<SHARED>/file');
  assert.equal(
    windows.sanitize(String.raw`"D:\Work Area\folder name\file"`),
    '"<WORK>/folder name/file"',
  );
});

test('file URLs decode local paths while non-file URLs, API and container paths are untouched', () => {
  const cases = [
    ['file:///synthetic/checkout/src/a.ts:3:2', 'src/a.ts:3:2'],
    ['file:///synthetic/other/folder%20name/a', '<OTHER>/folder name/a'],
    ['file:///Users/Secret/folder%20name/a.ts:3:2', '<PRIVATE_PATH>:3:2'],
    ['file:///C:/Users/Secret/a', '<PRIVATE_PATH>'],
    ['file://private-host/share/Secret/a', '<PRIVATE_PATH>'],
    ['file://localhost/home/Secret/a', '<PRIVATE_PATH>'],
    ['file:///Users/%XX/private', '<PRIVATE_PATH>'],
  ];
  for (const [input, output] of cases) assert.equal(matcher.sanitize(input), output);
  const negatives = [
    'https://example.test/Users/Secret/a?root=/synthetic/checkout/a',
    'http://host/tmp/one',
    's3://bucket/home/name',
    'ssh://host/Users/name',
    '/api/Users/Secret/a',
    '/api/tmp/a',
    '/app/src/main.ts',
    '/workspace/src/main.ts',
    '/usr/bin/node',
    '/temporary/a',
    '/homebrew/a',
    '/UsersExtra/name/a',
    'prefix/tmp/file',
    './tmp/file',
    '../home/name/file',
    '<OTHER>/suffix',
    '<PRIVATE_PATH>',
    '//host/Users/name/a',
  ];
  for (const input of negatives) assert.equal(matcher.sanitize(input), input);
});

test('recognition and sanitization agree and remain idempotent across mixed evidence', () => {
  const input = [
    '/synthetic/checkout/a:2:4',
    '/synthetic/other/b',
    '/Users/Secret/a',
    String.raw`C:\\Users\\Secret\\a`,
    'file:///home/Secret/a',
    'https://host/Users/Secret/a',
    '/api/a',
    'plain',
  ].join('\n');
  assert.equal(matcher.find(input).length, 5);
  const sanitized = matcher.sanitize(input);
  assert.equal(matcher.find(sanitized).length, 0);
  assert.equal(matcher.sanitize(sanitized), sanitized);
});

test('stream handles split UTF-8, split paths, CRLF, empty lines and final unterminated line', async () => {
  const bytes = Buffer.from('é🙂 /synthetic/checkout/a\r\n\r\n/home/Secret/file:9:2');
  const chunks = Array.from(bytes, byte => Buffer.from([byte]));
  assert.equal(await streamed(chunks), 'é🙂 a\r\n\r\n<PRIVATE_PATH>:9:2');
  assert.equal(await streamed([]), '');
  assert.equal(await streamed([Buffer.from('\n')]), '\n');
});

test('stream fatal UTF-8 and line limit never emit raw fragments of the failing line', async () => {
  for (const chunks of [
    [Buffer.from('/Users/Secret/a '), Buffer.from([0xc3])],
    [Buffer.from('/Users/Secret/a '), Buffer.from([0xff, 10])],
  ]) {
    const output = sink();
    await assert.rejects(
      sanitizeStream(Readable.from(chunks), output.stream, { matcher }),
      /^Error: INVALID_UTF8$/u,
    );
    assert.equal(output.text(), '');
  }
  const output = sink();
  await assert.rejects(
    sanitizeStream(
      Readable.from([Buffer.from('good\n/Users/Secret/'), Buffer.alloc(LINE_LIMIT, 97)]),
      output.stream,
      { matcher },
    ),
    /^Error: LINE_LIMIT$/u,
  );
  assert.equal(output.text(), 'good\n');
  assert.equal(
    (await streamed([Buffer.alloc(LINE_LIMIT, 97), Buffer.from('\n')])).length,
    LINE_LIMIT + 1,
  );
  await assert.rejects(
    streamed([Buffer.from(`${'é'.repeat(LINE_LIMIT / 2)}x`)]),
    /^Error: LINE_LIMIT$/u,
  );
  await assert.rejects(streamed(['/Users/Secret/raw']), /^Error: INVALID_INPUT$/u);
});

test('stream rejects binary control bytes on complete and final lines without raw fragments', async () => {
  for (const byte of [0, 1, 27, 127]) {
    for (const ending of ['', '\n']) {
      const bytes = Buffer.concat([
        Buffer.from('/Users/Secret/file '),
        Buffer.from([byte]),
        Buffer.from(ending),
      ]);
      const output = sink();
      await assert.rejects(
        sanitizeStream(Readable.from([bytes]), output.stream, { matcher }),
        /^Error: BINARY$/u,
      );
      assert.equal(output.text(), '');
      const result = cli(['sanitize'], bytes);
      assert.equal(result.status, 2);
      assert.equal(result.stdout, '');
      assert.equal(result.stderr, 'evidence-paths: BINARY\n');
    }
  }
  assert.equal(await streamed([Buffer.from('plain\ttext\f\r\n')]), 'plain\ttext\f\r\n');
});

test('stream input/output failures and CLI diagnostics never expose raw exception text or stacks', async () => {
  const input = Readable.from(
    (async function* () {
      throw new Error('/Users/Secret/raw error');
    })(),
  );
  await assert.rejects(sanitizeStream(input, sink().stream, { matcher }), /^Error: INPUT_ERROR$/u);
  const broken = new Writable({
    write(_chunk, _encoding, done) {
      done(new Error('/Users/Secret/output'));
    },
  });
  const errors = sink();
  assert.equal(
    await runCli(['sanitize'], {
      input: Readable.from([Buffer.from('/home/Secret/a\n')]),
      output: broken,
      error: errors.stream,
    }),
    2,
  );
  assert.equal(errors.text(), 'evidence-paths: OUTPUT_ERROR\n');
  const helpBroken = new Writable({
    write(_chunk, _encoding, done) {
      done(new Error('private'));
    },
  });
  assert.equal(await runCli(['--help'], { output: helpBroken, error: sink().stream }), 2);
});

test('checker scans sorted recursive text of any extension, only reports safe locations, and never writes', async t => {
  const root = await fixture(t, {
    'z.data': '/home/Secret/z\n',
    'a/note.weird': 'ordinary\n/synthetic/checkout/source.ts\n/home/Secret/private\n',
    'clean': 'https://host/Users/Secret/a\n/api/resource\n',
  });
  const paths = ['z.data', 'a/note.weird', 'clean'];
  const before = await Promise.all(
    paths.map(async name => ({
      bytes: await readFile(join(root, name)),
      mtime: (await stat(join(root, name))).mtimeMs,
    })),
  );
  const result = await checkPaths([root], { matcher });
  assert.deepEqual(result, {
    status: 1,
    diagnostics: [
      'scope-1/a/note.weird:2 PATH_FOUND',
      'scope-1/a/note.weird:3 PATH_FOUND',
      'scope-1/z.data:1 PATH_FOUND',
    ],
  });
  const command = cli(['check', '--repo-root', '/synthetic/checkout', '--', root]);
  assert.equal(command.status, 1);
  assert.equal(command.stdout, `${result.diagnostics.join('\n')}\n`);
  assert.equal(command.stderr, '');
  for (let index = 0; index < paths.length; index++) {
    assert.deepEqual(await readFile(join(root, paths[index])), before[index].bytes);
    assert.equal((await stat(join(root, paths[index]))).mtimeMs, before[index].mtime);
  }
  assert.equal((await checkPaths([join(root, 'clean')], { matcher })).status, 0);
  assert.equal(cli(['check', '--', join(root, 'clean')]).status, 0);
});

test('checker excludes env and non-text inputs with incomplete precedence', async t => {
  const root = await fixture(t, {
    '.env.secret': '/home/Secret/env\n',
    '.env-dir/nested': '/home/Secret/nested\n',
    'binary.any': Buffer.from([0, 1, 2]),
    'invalid.any': Buffer.from([0xff]),
    'private.txt': '/home/Secret/private\n',
    'oversized': Buffer.alloc(FILE_LIMIT + 1, 97),
    'long-line': Buffer.alloc(LINE_LIMIT + 1, 97),
  });
  const result = await checkPaths([root], { matcher });
  assert.equal(result.status, 2);
  assert.deepEqual(result.diagnostics, [
    'scope-1/.env-dir:0 ENV_EXCLUDED',
    'scope-1/.env.secret:0 ENV_EXCLUDED',
    'scope-1/binary.any:0 BINARY',
    'scope-1/invalid.any:0 INVALID_UTF8',
    'scope-1/long-line:0 LINE_LIMIT',
    'scope-1/oversized:0 SIZE_LIMIT',
    'scope-1/private.txt:1 PATH_FOUND',
  ]);
  const resultCli = cli(['check', '--', root]);
  assert.equal(resultCli.status, 2);
  assert.equal(resultCli.stdout, `${result.diagnostics.join('\n')}\n`);
  assert.equal(resultCli.stderr, '');
  assert.doesNotMatch(resultCli.stdout + resultCli.stderr, /Secret|\/home\/|evidence-paths-[^/ ]/u);
  assert.deepEqual(await checkPaths([join(root, '.env-dir/nested')], { matcher }), {
    status: 2,
    diagnostics: ['scope-1:0 ENV_EXCLUDED'],
  });
});

test(
  'checker treats POSIX mode-zero files as unreadable even for privileged runners',
  {
    skip:
      process.platform === 'win32'
        ? 'Windows readability is determined by ACL/open errors, not POSIX mode bits'
        : false,
  },
  async t => {
    const root = await fixture(t, { unreadable: '/home/Secret/a\n' });
    const path = join(root, 'unreadable');
    await chmod(path, 0);
    try {
      assert.deepEqual(await checkPaths([path], { matcher }), {
        status: 2,
        diagnostics: ['scope-1/unreadable:0 UNREADABLE'],
      });
      assert.deepEqual(await checkPaths([root], { matcher }), {
        status: 2,
        diagnostics: ['scope-1/unreadable:0 UNREADABLE'],
      });
      const result = cli(['check', '--', path]);
      assert.equal(result.status, 2);
      assert.equal(result.stdout, 'scope-1/unreadable:0 UNREADABLE\n');
      assert.equal(result.stderr, '');
    } finally {
      await chmod(path, 0o600);
    }
  },
);

test('checker excludes file symlinks as explicit scopes and directory entries', async t => {
  const root = await fixture(t, { 'private.txt': '/home/Secret/private\n' });
  const link = join(root, 'link');
  if (!(await symlinkOrSkip(t, join(root, 'private.txt'), link, 'file'))) return;
  assert.deepEqual(await checkPaths([link], { matcher }), {
    status: 2,
    diagnostics: ['scope-1:0 SYMLINK_EXCLUDED'],
  });
  const result = await checkPaths([root], { matcher });
  assert.deepEqual(result, {
    status: 2,
    diagnostics: ['scope-1/link:0 SYMLINK_EXCLUDED', 'scope-1/private.txt:1 PATH_FOUND'],
  });
  const command = cli(['check', '--', root]);
  assert.equal(command.status, result.status);
  assert.equal(command.stdout, `${result.diagnostics.join('\n')}\n`);
  assert.equal(command.stderr, '');
});

async function checkDirectoryLink(t, type) {
  const root = await fixture(t, { 'target/private.txt': '/home/Secret/private\n' });
  const link = join(root, 'directory-link');
  if (!(await symlinkOrSkip(t, join(root, 'target'), link, type))) return;
  assert.deepEqual(await checkPaths([link, join(link, 'private.txt')], { matcher }), {
    status: 2,
    diagnostics: ['scope-1:0 SYMLINK_EXCLUDED', 'scope-2:0 SYMLINK_EXCLUDED'],
  });
  assert.deepEqual(await checkPaths([root], { matcher }), {
    status: 2,
    diagnostics: [
      'scope-1/directory-link:0 SYMLINK_EXCLUDED',
      'scope-1/target/private.txt:1 PATH_FOUND',
    ],
  });
  const command = cli(['check', '--', join(link, 'private.txt')]);
  assert.equal(command.status, 2);
  assert.equal(command.stdout, 'scope-1:0 SYMLINK_EXCLUDED\n');
  assert.equal(command.stderr, '');
}

test('checker excludes directory symlinks and symlink scope ancestors', async t => {
  await checkDirectoryLink(t, 'dir');
});

test(
  'checker excludes Windows junctions and junction scope ancestors',
  { skip: process.platform !== 'win32' ? 'Windows junction capability test' : false },
  async t => {
    await checkDirectoryLink(t, 'junction');
  },
);

test(
  'special files are excluded before open',
  { skip: process.platform === 'win32' ? 'mkfifo requires POSIX' : false },
  async t => {
    const root = await fixture(t);
    const fifo = join(root, 'fifo');
    const made = spawnSync('mkfifo', [fifo]);
    assert.equal(made.status, 0);
    assert.deepEqual(await checkPaths([fifo], { matcher }), {
      status: 2,
      diagnostics: ['scope-1/fifo:0 SPECIAL_EXCLUDED'],
    });
  },
);

test('missing scopes reveal no root', async t => {
  const root = await fixture(t);
  const missing = cli(['check', '--', join(root, 'private-identity/missing')]);
  assert.equal(missing.status, 2);
  assert.equal(missing.stdout, 'scope-1:0 UNREADABLE\n');
  assert.equal(missing.stderr, '');
});

test('portable diagnostic filenames escape Unicode formatting characters', async t => {
  const name = 'evil\u202E name-é.txt';
  const root = await fixture(t, { [name]: '/home/Secret/a\n' });
  const result = await checkPaths([root, join(root, name)], { matcher });
  assert.deepEqual(result, {
    status: 1,
    diagnostics: [
      'scope-1/evil\\u202e name-é.txt:1 PATH_FOUND',
      'scope-2/evil\\u202e name-é.txt:1 PATH_FOUND',
    ],
  });
  const command = cli(['check', '--', root, join(root, name)]);
  assert.equal(command.status, result.status);
  assert.equal(command.stdout, `${result.diagnostics.join('\n')}\n`);
  assert.equal(command.stderr, '');
});

test(
  'POSIX diagnostic filenames sanitize Windows-looking paths and escape line/control/colon characters',
  {
    skip:
      process.platform === 'win32'
        ? 'These literal filename characters are illegal on Windows'
        : false,
  },
  async t => {
    const name = 'evil\n\u001B\u202E:name';
    const privateName = String.raw`C:\Users\Secret\file`;
    const root = await fixture(t, {
      [name]: '/home/Secret/a\n',
      [privateName]: '/home/Secret/a\n',
    });
    assert.deepEqual(await checkPaths([root], { matcher }), {
      status: 1,
      diagnostics: [
        'scope-1/<PRIVATE_PATH>:1 PATH_FOUND',
        'scope-1/evil\\u000a\\u001b\\u202e\\u003aname:1 PATH_FOUND',
      ],
    });
    const direct = await checkPaths([join(root, privateName), join(root, name)], { matcher });
    assert.deepEqual(direct, {
      status: 1,
      diagnostics: [
        'scope-1/<PRIVATE_PATH>:1 PATH_FOUND',
        'scope-2/evil\\u000a\\u001b\\u202e\\u003aname:1 PATH_FOUND',
      ],
    });
    const command = cli(['check', '--', join(root, privateName), join(root, name)]);
    assert.equal(command.status, direct.status);
    assert.equal(command.stdout, `${direct.diagnostics.join('\n')}\n`);
    assert.equal(command.stderr, '');
    assert.doesNotMatch(command.stdout, /Secret/u);
  },
);

test(
  'POSIX literal backslashes remain filename characters in explicit scopes and directory scans',
  { skip: process.platform === 'win32' ? 'Backslash is a path separator on Windows' : false },
  async t => {
    const name = String.raw`literal\file.txt`;
    const directory = String.raw`literal\directory`;
    const root = await fixture(t, {
      [name]: '/home/Secret/a\n',
      [join(directory, 'evidence.txt')]: '/home/Secret/b\n',
    });
    assert.deepEqual(await checkPaths([join(root, name)], { matcher }), {
      status: 1,
      diagnostics: ['scope-1/literal\\u005cfile.txt:1 PATH_FOUND'],
    });
    assert.deepEqual(await checkPaths([join(root, directory)], { matcher }), {
      status: 1,
      diagnostics: ['scope-1/evidence.txt:1 PATH_FOUND'],
    });
    assert.deepEqual(await checkPaths([join(root, directory, 'evidence.txt')], { matcher }), {
      status: 1,
      diagnostics: ['scope-1/evidence.txt:1 PATH_FOUND'],
    });
    const result = await checkPaths([root], { matcher });
    assert.deepEqual(result, {
      status: 1,
      diagnostics: [
        'scope-1/literal\\u005cdirectory/evidence.txt:1 PATH_FOUND',
        'scope-1/literal\\u005cfile.txt:1 PATH_FOUND',
      ],
    });
    const command = cli(['check', '--', join(root, name), root]);
    assert.equal(command.status, 1);
    assert.equal(
      command.stdout,
      [
        'scope-1/literal\\u005cfile.txt:1 PATH_FOUND',
        ...result.diagnostics.map(label => label.replace('scope-1/', 'scope-2/')),
        '',
      ].join('\n'),
    );
    assert.equal(command.stderr, '');
  },
);

test('sanitized files are clean under the same shared checker', async t => {
  const raw = '/synthetic/checkout/file:1:2\n/synthetic/other/file\nfile:///Users/Secret/file\n';
  const root = await fixture(t, { evidence: matcher.sanitize(raw) });
  assert.deepEqual(await checkPaths([root], { matcher }), { status: 0, diagnostics: [] });
});

test('CLI exact conventions, safe usage errors, explicit scope requirement and statuses', () => {
  const good = cli(
    ['sanitize', '--repo-root', '/synthetic/checkout', '--map', '/synthetic/other=<OTHER>'],
    '/synthetic/checkout/a\r\n/synthetic/other/b\n/home/Secret/c',
  );
  assert.equal(good.status, 0);
  assert.equal(good.stdout, 'a\r\n<OTHER>/b\n<PRIVATE_PATH>');
  assert.equal(good.stderr, '');
  for (const args of [
    [],
    ['unknown-private-argument'],
    ['check'],
    ['check', '--'],
    ['check', '/private/scope'],
    ['sanitize', '--', 'private-command'],
    ['sanitize', '--output', '/private/path'],
    ['sanitize', '--repo-root', '/private/path', '--repo-root', '/other/path'],
    ['sanitize', '--map', '/private/path=bad-private-alias'],
    ['sanitize', '--map', 'private-root=ROOT'],
  ]) {
    const result = cli(args);
    assert.equal(result.status, 2, JSON.stringify(args));
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^evidence-paths: [A-Z_]+\n$/u);
  }
  const utf8 = cli(['sanitize'], Buffer.from([0xff]));
  assert.equal(utf8.status, 2);
  assert.equal(utf8.stdout, '');
  assert.equal(utf8.stderr, 'evidence-paths: INVALID_UTF8\n');
  const limited = cli(['sanitize'], Buffer.alloc(LINE_LIMIT + 1, 97));
  assert.equal(limited.status, 2);
  assert.equal(limited.stdout, '');
  assert.equal(limited.stderr, 'evidence-paths: LINE_LIMIT\n');
  const help = cli(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /NOT a universal secret/u);
  assert.match(help.stdout, /Quote path tokens containing spaces/u);
});
