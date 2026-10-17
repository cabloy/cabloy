import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../../../../', import.meta.url));
const absolute = relative => path.resolve(root, relative);
const read = relative => fs.readFileSync(absolute(relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const git = args => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const suitePath = 'vona/src/suite/cabloy-mcp';
const modulePath = `${suitePath}/modules/cabloy-mcp`;
const applicationPath = 'vona/src/backend/config/config/config.ts';
const suite = json(`${suitePath}/package.json`);
const module = json(`${modulePath}/package.json`);
assert.equal(suite.name, 'vona-suite-cabloy-mcp');
assert.equal(suite.version, '5.0.0');
assert.deepEqual(suite.dependencies, { 'vona-module-cabloy-mcp': 'workspace:^' });
assert.equal(module.name, 'vona-module-cabloy-mcp');
assert.equal(module.title, 'cabloy-mcp');
assert.equal(module.version, '5.0.0');
assert.deepEqual(module.dependencies, {});
assert.deepEqual(module.vonaModule, { dependencies: { 'a-vona': '5.0.0' } });
assert.deepEqual(json(`${suitePath}/tsconfig.json`).references, [
  { path: 'modules/cabloy-mcp/tsconfig.build.json' },
]);
const sourceFiles = fs
  .readdirSync(absolute(`${modulePath}/src`), { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile())
  .map(entry =>
    path.relative(absolute(`${modulePath}/src`), path.join(entry.parentPath, entry.name)),
  )
  .sort();
assert.deepEqual(sourceFiles, [
  '.metadata/index.ts',
  '.metadata/this.ts',
  'config/config.ts',
  'index.ts',
  'types/index.ts',
]);
assert.match(
  read(`${modulePath}/src/.metadata/index.ts`),
  /'cabloy-mcp': ReturnType<typeof config>/,
);
assert.match(read(`${modulePath}/src/index.ts`), /export \* from '\.\/\.metadata\/index\.ts'/);
assert.match(read(`${modulePath}/src/index.ts`), /export \* from '\.\/types\/index\.ts'/);

const { glob } = await import(
  pathToFileURL(absolute('vona/node_modules/@cabloy/module-glob/src/index.ts')).href
);
const { default: ts } = await import(
  pathToFileURL(absolute('vona/node_modules/typescript/lib/typescript.js')).href
);
const meta = await glob({
  projectPath: absolute('vona'),
  projectMode: 'vona',
  disabledModules: undefined,
  disabledSuites: undefined,
  log: false,
  check: false,
});
assert.equal(meta.modules['cabloy-mcp'].root, absolute(modulePath));
assert.equal(meta.modules['cabloy-mcp'].info.fullName, module.name);
assert.equal(meta.modules['cabloy-mcp'].suite, 'cabloy-mcp');
const paths = {};
const files = [];
for (const discovered of Object.values(meta.modules)) {
  const index = path.join(discovered.root, 'src/index.ts');
  if (!fs.existsSync(index)) continue;
  paths[discovered.info.fullName] = [index];
  files.push(index);
}
files.push(absolute(`${modulePath}/test/config.test.ts`));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'cabloy-mcp-config-check-'));
let result;
try {
  const configFile = path.join(temporary, 'tsconfig.json');
  fs.writeFileSync(
    configFile,
    JSON.stringify({
      extends: absolute('vona/tsconfig.base.json'),
      compilerOptions: {
        noEmit: true,
        incremental: false,
        composite: false,
        baseUrl: absolute('vona'),
        paths,
      },
      files,
      include: [],
    }),
  );
  const parsed = ts.getParsedCommandLineOfConfigFile(
    configFile,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    },
  );
  assert.ok(parsed);
  assert.equal(parsed.errors.length, 0);
  const baselineSource = git(['show', `HEAD:${applicationPath}`]);
  function diagnostics(baseline) {
    const options = { ...parsed.options, paths: { ...parsed.options.paths } };
    if (baseline) delete options.paths[module.name];
    const host = ts.createCompilerHost(options);
    const readFile = host.readFile.bind(host);
    host.readFile = filename =>
      baseline && path.resolve(filename) === absolute(applicationPath)
        ? baselineSource
        : readFile(filename);
    const rootNames = parsed.fileNames.filter(
      filename => !baseline || !filename.startsWith(`${absolute(suitePath)}/`),
    );
    return ts.getPreEmitDiagnostics(ts.createProgram(rootNames, options, host)).map(d => ({
      file: d.file ? path.relative(root, d.file.fileName) : null,
      line:
        d.file && d.start !== undefined
          ? d.file.getLineAndCharacterOfPosition(d.start).line + 1
          : null,
      code: d.code,
      message: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    }));
  }
  const current = diagnostics(false);
  const baseline = diagnostics(true);
  result = {
    current,
    baseline,
    identical: JSON.stringify(current) === JSON.stringify(baseline),
    clean: current.length === 0,
  };
} finally {
  fs.rmSync(temporary, { recursive: true });
}
const sourceManifest = [
  applicationPath,
  ...git(['ls-files', '--cached', '--others', '--exclude-standard', suitePath])
    .split('\n')
    .filter(Boolean),
]
  .sort()
  .map(file => ({
    file,
    sha256: createHash('sha256')
      .update(fs.readFileSync(absolute(file)))
      .digest('hex'),
  }));
console.log(
  JSON.stringify(
    {
      revision: git(['rev-parse', 'HEAD']),
      node: process.version,
      typescript: ts.version,
      worktree: 'dirty; source hashes below identify the tested increment, not HEAD alone',
      sourceManifest,
      structure:
        'passed; manifests, references, generated config augmentation; no route/schema source',
      discoveredModules: Object.keys(meta.modules).length,
      discoveredMcp: path.relative(root, meta.modules['cabloy-mcp'].root),
      typecheck: result,
      limitation:
        'An equal diagnostic set is a delta check, not a clean typecheck or installed application integration proof.',
    },
    null,
    2,
  ),
);
if (!result.identical) process.exitCode = 1;
