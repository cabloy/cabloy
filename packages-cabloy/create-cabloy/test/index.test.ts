import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const entrypointUrl = new URL('../src/index.ts', import.meta.url).href;

function runEntrypoint(initExitCode: number | null) {
  const cwd = mkdtempSync(join(tmpdir(), 'create-cabloy-test-'));
  try {
    const promptsSource = `
      export async function runPrompts() {
        return { projectName: 'cabloy-app', force: false };
      }
    `;
    const utilsSource = `
      import assert from 'node:assert/strict';
      import { existsSync } from 'node:fs';
      import { join } from 'node:path';

      const targetDir = join(process.cwd(), 'cabloy-app');
      let downloaded = false;
      export async function downloadAndExtract(directory) {
        assert.equal(directory, targetDir);
        assert.equal(existsSync(directory), true);
        downloaded = true;
      }
      export async function spawnAsync(command, args, options) {
        assert.equal(downloaded, true);
        assert.equal(command, 'npm');
        assert.deepEqual(args, ['run', 'init']);
        assert.deepEqual(options, { cwd: targetDir });
        return ${JSON.stringify(initExitCode)};
      }
    `;
    const source = `
      import { registerHooks } from 'node:module';

      const mocks = ${JSON.stringify({ './prompts.ts': promptsSource, './utils.ts': utilsSource })};
      registerHooks({ resolve(specifier, context, nextResolve) {
        if (context.parentURL === ${JSON.stringify(entrypointUrl)} && Object.hasOwn(mocks, specifier)) {
          return {
            url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]),
            shortCircuit: true,
          };
        }
        return nextResolve(specifier, context);
      } });
      await import(${JSON.stringify(entrypointUrl)});
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      cwd,
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: undefined },
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    return result;
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

for (const initExitCode of [7, null]) {
  test(`init exit code ${initExitCode} fails without success output`, () => {
    const result = runEntrypoint(initExitCode);
    const output = result.stdout + result.stderr;
    assert.equal(result.status, initExitCode ?? 1, output);
    assert.match(output, /Init failed/);
    assert.match(output, /npm run init failed\. You can try running it manually\./);
    assert.doesNotMatch(output, /Project initialized successfully!|Done!|Next steps:/);
    assert.doesNotMatch(output, /npm run db:reset|npm run dev|start coding immediately/);
  });
}

test('init exit code zero prints success and next steps', () => {
  const result = runEntrypoint(0);
  const output = result.stdout + result.stderr;
  assert.equal(result.status, 0, output);
  assert.match(output, /Project initialized successfully!/);
  assert.match(output, /Done!/);
  assert.match(output, /Next steps:/);
  assert.match(output, /cd cabloy-app/);
  assert.match(output, /npm run db:reset/);
  assert.match(output, /npm run dev/);
  assert.doesNotMatch(output, /Init failed|npm run init failed/);
});
