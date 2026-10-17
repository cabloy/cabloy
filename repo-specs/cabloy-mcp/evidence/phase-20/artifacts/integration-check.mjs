import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { glob } from '../../../../../vona/packages-utils/module-glob/src/index.ts';

const root = fileURLToPath(new URL('../../../../../', import.meta.url));
const absolute = file => path.resolve(root, file);
const json = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const modulePath = 'vona/src/suite/cabloy-mcp/modules/cabloy-mcp';
const generatedImports = 'vona/src/backend/typing/modules.d.ts';
const packageName = 'vona-module-cabloy-mcp';
assert.equal(json('vona/package.json').dependencies[packageName], 'workspace:^');
assert.equal(json('vona/package.original.json').dependencies[packageName], undefined);
assert.equal(fs.realpathSync(absolute(`vona/node_modules/${packageName}`)), absolute(modulePath));
assert.ok(fs.readFileSync(absolute(generatedImports), 'utf8').includes(`import '${packageName}';`));
assert.equal(
  fs.realpathSync(absolute(`${modulePath}/src/.metadata/modules.d.ts`)),
  absolute(generatedImports),
);
async function main() {
  const meta = await glob({
    projectPath: absolute('vona'),
    projectMode: 'vona',
    disabledModules: undefined,
    disabledSuites: undefined,
    log: false,
    check: false,
  });
  assert.equal(meta.modules['cabloy-mcp'].root, absolute(modulePath));
  const previous = json(
    'repo-specs/cabloy-mcp/evidence/phase-20/artifacts/config-context-check.json',
  );
  for (const item of previous.sourceManifest) {
    assert.equal(
      createHash('sha256')
        .update(fs.readFileSync(absolute(item.file)))
        .digest('hex'),
      item.sha256,
    );
  }
  const files = [
    ...previous.sourceManifest.map(item => item.file),
    'vona/package.json',
    'vona/package.original.json',
    'vona/pnpm-lock.yaml',
    generatedImports,
  ];
  process.stdout.write(
    `${JSON.stringify(
      {
        revision: execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {
          encoding: 'utf8',
        }).trim(),
        node: process.version,
        discoveredModules: Object.keys(meta.modules).length,
        registration:
          'passed: generated package, installed local workspace link, application import and module type symlink',
        previousAuthoredSourceHashes: 'unchanged',
        sourceManifest: files.map(file => ({
          file,
          sha256: createHash('sha256')
            .update(fs.readFileSync(absolute(file)))
            .digest('hex'),
        })),
        limitation: 'No app startup, composite build, endpoint or ATP proof is claimed.',
      },
      null,
      2,
    )}\n`,
  );
}

main().catch(error => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
