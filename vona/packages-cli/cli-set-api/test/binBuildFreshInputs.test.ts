import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const buildUrl = new URL('../src/lib/bean/cli.bin.build.ts', import.meta.url).href;

// Keep the actual bundler and transpilers; only isolate CLI initialization.
const source = `
  import assert from 'node:assert/strict';
  import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
  import { registerHooks } from 'node:module';
  import { join } from 'node:path';
  import { pathToFileURL } from 'node:url';
  const buildUrl = ${JSON.stringify(buildUrl)};
  const projectPath = process.argv[1];
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL === buildUrl) {
        const mock = specifier === '@cabloy/cli'
          ? 'export class BeanCliBase {}'
          : specifier === './toolsBin/generateVonaMeta.ts'
            ? 'export function generateVonaMeta() { throw new Error("Unexpected generation"); }'
            : undefined;
        if (mock) return { url: 'data:text/javascript,' + encodeURIComponent(mock), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
  });
  const { CliBinBuild } = await import(buildUrl);
  const cli = Object.create(CliBinBuild.prototype);
  const cachePath = process.argv[2];
  const poisoned = readFileSync(cachePath, 'utf8');
  for (const [index, flavor] of ['normal', 'ci', 'normal'].entries()) {
    const env = {
      META_MODE: 'prod',
      META_FLAVOR: flavor,
      SERVER_LISTEN_DISABLE: flavor === 'ci' ? 'true' : '',
      generation: index,
    };
    writeFileSync(join(projectPath, '.vona/env.ts'),
      'export default ' + JSON.stringify(env) + ' as const;');
    writeFileSync(join(projectPath, '.vona/config.ts'),
      'export default { generation: ' + index + ' };');
    const outDir = join(projectPath, 'dist/build-' + index);
    await cli._rollup(projectPath, env, { modules: {} }, outDir);
    const app = await import(pathToFileURL(join(outDir, 'app.js')).href);
    assert.deepEqual(app.env, env, 'must compile current generated environment, not cached CI output');
    assert.deepEqual(await app.config(), { generation: index });
    assert.equal(app.view, 'fresh-view', 'must retain inherited JSX and legacy decorator compilation');
    assert.equal(readFileSync(cachePath, 'utf8'), poisoned, 'legacy cache must remain in place');
    if (process.env.BUILD_SOURCEMAP === 'true') {
      const maps = readdirSync(outDir).filter(name => name.endsWith('.js.map'));
      assert.ok(maps.length > 0);
      assert.ok(maps.some(name =>
        JSON.parse(readFileSync(join(outDir, name), 'utf8')).sources
          .some(source => source.endsWith('/.vona/env.ts'))));
    }
  }
`;

for (const sourceMap of [false, true]) {
  test(`production build uses fresh generated inputs despite CI cache (sourceMap=${sourceMap})`, () => {
    const projectPath = realpathSync(mkdtempSync(join(tmpdir(), 'vona-bin-build-fresh-')));
    try {
      mkdirSync(join(projectPath, '.vona'));
      mkdirSync(join(projectPath, 'src/backend'), { recursive: true });
      symlinkSync(
        fileURLToPath(new URL('../../../node_modules', import.meta.url)),
        join(projectPath, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      writeFileSync(join(projectPath, 'package.json'), JSON.stringify({ type: 'module' }));
      writeFileSync(
        join(projectPath, 'tsconfig.base.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2020',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            incremental: true,
            composite: true,
            declaration: true,
            declarationMap: false,
            jsx: 'react',
            jsxFactory: 'h',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            skipLibCheck: true,
          },
        }),
      );
      writeFileSync(
        join(projectPath, 'tsconfig.json'),
        JSON.stringify({
          extends: './tsconfig.base.json',
          compilerOptions: { noEmit: true, composite: false, declaration: false },
          exclude: ['.vona', 'dist', 'node_modules'],
        }),
      );
      writeFileSync(
        join(projectPath, 'src/backend/view.tsx'),
        `function h(tag: string) { return tag; }
function mark(target: any) { target.value = 'fresh-view'; }
@mark
class View { static value: string; }
export const view = <fixture /> === 'fixture' ? View.value : 'invalid';`,
      );
      writeFileSync(
        join(projectPath, '.vona/app.ts'),
        `export { default as env } from './env.ts';
export { view } from '../src/backend/view.tsx';
export async function config() { return (await import('./config.ts')).default; }`,
      );
      writeFileSync(join(projectPath, '.vona/bootstrap.ts'), "export { env } from './app.ts';");
      writeFileSync(join(projectPath, '.vona/modules-meta.ts'), 'export default {};');
      const cachePath = join(
        projectPath,
        '.rollup.cache',
        join(projectPath, '.vona/env.js').replace(/^([a-z]+):/i, '$1'),
      );
      mkdirSync(dirname(cachePath), { recursive: true });
      writeFileSync(
        cachePath,
        'export default { META_MODE: "prod", META_FLAVOR: "ci", SERVER_LISTEN_DISABLE: "true", generation: "poisoned" };',
      );
      const result = spawnSync(
        process.execPath,
        ['--input-type=module', '--eval', source, projectPath, cachePath],
        {
          cwd: projectPath,
          encoding: 'utf8',
          timeout: 60_000,
          env: {
            ...process.env,
            BUILD_MINIFY: 'false',
            BUILD_SOURCEMAP: String(sourceMap),
          },
        },
      );
      assert.ifError(result.error);
      assert.equal(result.signal, null, result.stderr);
      assert.equal(result.status, 0, result.stderr);
      assert.doesNotMatch(result.stderr, /\[plugin typescript\]/i, result.stderr);
    } finally {
      rmSync(projectPath, { recursive: true, force: true });
    }
  });
}
