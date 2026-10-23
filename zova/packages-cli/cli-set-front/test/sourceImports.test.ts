import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';

import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { it } from 'node:test';

import generateController from '../../../src/suite-vendor/a-zova/modules/a-bean/cli/controller/metadata/generate.ts';
import { CliOpenapiGenerate } from '../src/lib/bean/cli.openapi.generate.ts';
import { CliToolsMetadata } from '../src/lib/bean/cli.tools.metadata.ts';
import { generateBeanGenerals } from '../src/lib/bean/toolsMetadata/generateBeanGenerals.ts';
import { generateMetadataCustom } from '../src/lib/bean/toolsMetadata/generateMetadataCustom.ts';
import { generateOnions } from '../src/lib/bean/toolsMetadata/generateOnions.ts';
import { generateScopeResources } from '../src/lib/bean/toolsMetadata/generateScopeResources.ts';
import { globAllTsFiles } from '../src/lib/bean/toolsMetadata/utils.ts';

async function withModule(
  run: (modulePath: string, put: (file: string, content: string) => Promise<void>) => Promise<void>,
) {
  const modulePath = await mkdtemp(path.join(os.tmpdir(), 'zova-source-imports-'));
  try {
    await run(modulePath, async (file, content) => {
      const target = path.join(modulePath, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    });
  } finally {
    await rm(modulePath, { recursive: true, force: true });
  }
}

const helper = { async formatFile() {} };

it('keeps source suffixes in filename fields and uses them in metadata imports', async () => {
  await withModule(async (modulePath, put) => {
    await put('src/bean/model.example.ts', '\n@Model()\nexport class ModelExample {}');
    await put(
      'src/component/example/controller.tsx',
      '\n@Controller()\nexport class ControllerExample {}',
    );
    const files = await globAllTsFiles('test-example', modulePath);
    assert.equal(files.length, 2);
    for (const file of files) {
      const source = path
        .relative(path.join(modulePath, 'src/.metadata'), file.file)
        .replace(/\\/g, '/');
      assert.match(source, /\.tsx?$/);
      assert.equal(file.fileNameJS, file.fileName);
      assert.equal(file.fileNameJSRelative, source);
      const sceneMeta = { optionsNone: true };
      for (const content of [
        await generateOnions([file], file.sceneName, sceneMeta, 'test-example', modulePath),
        await generateBeanGenerals([file], file.sceneName, sceneMeta, 'test-example', modulePath),
        await generateScopeResources([file], file.sceneName, sceneMeta, 'test-example', modulePath),
      ]) {
        assert.ok(content.includes(`from '${source}'`), content);
        assert.doesNotMatch(content, /from ['"]\.[^'"]*\.jsx?['"]/);
      }
    }
  });
});

it('generates wrappers from source controller, render and style extensions', async () => {
  await withModule(async (modulePath, put) => {
    for (const [name, ext] of [
      ['first', 'ts'],
      ['second', 'tsx'],
    ]) {
      const className = `Controller${name === 'first' ? 'First' : 'Second'}`;
      await put(
        `src/component/${name}/controller.${ext}`,
        `\n@Controller()\nexport class ${className} {}`,
      );
      for (const file of ['render.tsx', 'render.extra.tsx', 'style.ts', 'style.extra.ts']) {
        await put(`src/component/${name}/${file}`, 'export {};');
      }
    }
    const options = {
      moduleName: 'test-example',
      modulePath,
      cli: { helper, context: { argv: { projectPath: modulePath } } },
      globFiles: await globAllTsFiles('test-example', modulePath),
    } as unknown as IMetadataCustomGenerateOptions;
    const metadata = await generateController(options);
    assert.match(metadata, /from '\.\/component\/first\.ts'/);
    for (const [name, ext] of [
      ['first', 'ts'],
      ['second', 'tsx'],
    ]) {
      const content = await readFile(
        path.join(modulePath, `src/.metadata/component/${name}.ts`),
        'utf8',
      );
      for (const target of [`controller.${ext}`, 'render.tsx', 'style.ts']) {
        assert.ok(content.includes(`from '../../component/${name}/${target}'`), content);
      }
      assert.doesNotMatch(content, /from ['"]\.[^'"]*\.jsx?['"]/);
    }
  });
});

it('migrates only generator-owned exports and remains idempotent', async () => {
  await withModule(async (modulePath, put) => {
    const cli = Object.create(CliToolsMetadata.prototype) as CliToolsMetadata;
    Object.defineProperty(cli, 'helper', { value: helper });
    const customThis =
      '// custom\nexport { other } from \'./custom.js\';\nexport const note = "./index.js";\n';
    const customIndex =
      "// custom\nexport { value } from './lib/index.js';\nexport * from './custom.js';\n";
    await put(
      'src/.metadata/this.ts',
      `export const __ThisModule__ = 'test-example';\nexport { ScopeModuleTestExample as ScopeModule } from './index.js';\n${customThis}`,
    );
    await put(
      'src/index.ts',
      `export * from './.metadata/index.js';\nexport * from './.metadata/index.ts';\nexport * from "./lib/index.js";\n${customIndex}`,
    );
    await put('src/.metadata/index.ts', 'export {};');
    await put('src/lib/index.ts', 'export {};');
    await cli._generateThis('test-example', 'TestExample', modulePath);
    await cli._generateIndex(modulePath);
    const firstThis = await readFile(path.join(modulePath, 'src/.metadata/this.ts'), 'utf8');
    const firstIndex = await readFile(path.join(modulePath, 'src/index.ts'), 'utf8');
    assert.ok(firstThis.endsWith(customThis));
    assert.ok(firstIndex.endsWith(customIndex));
    assert.match(firstThis, /as ScopeModule \} from '\.\/index\.ts';/);
    assert.equal(firstIndex.split("export * from './.metadata/index.ts';").length - 1, 1);
    assert.match(firstIndex, /export \* from '\.\/lib\/index\.ts';/);
    await cli._generateThis('test-example', 'TestExample', modulePath);
    await cli._generateIndex(modulePath);
    assert.equal(await readFile(path.join(modulePath, 'src/.metadata/this.ts'), 'utf8'), firstThis);
    assert.equal(await readFile(path.join(modulePath, 'src/index.ts'), 'utf8'), firstIndex);
  });
});

it('keeps compiled custom-generator lookup on dist-cli JavaScript', async () => {
  await withModule(async (modulePath, put) => {
    await put('dist-cli/controller/metadata/generate.js', 'export default () => "compiled";');
    const calls: string[] = [];
    const cli = {
      helper: {
        async importDynamic(file: string, callback: Function) {
          calls.push(file);
          return callback({ default: () => 'generated' });
        },
      },
    };
    const sceneMeta = {
      metadataCustom: 'controller/metadata/generate.ts',
      module: { root: modulePath },
    };
    const files = [{}];
    await generateMetadataCustom(
      cli as any,
      files as any,
      'controller',
      sceneMeta as any,
      'test-example',
      modulePath,
    );
    assert.equal(calls[0], path.join(modulePath, 'dist-cli/controller/metadata/generate.js'));
    await rm(path.join(modulePath, 'dist-cli'), { recursive: true });
    await generateMetadataCustom(
      cli as any,
      files as any,
      'controller',
      sceneMeta as any,
      'test-example',
      modulePath,
    );
    assert.equal(calls[1], path.join(modulePath, 'cli/controller/metadata/generate.ts'));
  });
});

it('generates OpenAPI value and type consumers with source suffixes', async () => {
  await withModule(async modulePath => {
    const openapiTypescript = await import('@cabloy/openapi-typescript');
    const cli = Object.create(CliOpenapiGenerate.prototype) as CliOpenapiGenerate;
    Object.defineProperty(cli, 'helper', { value: helper });
    const module = { root: modulePath, name: 'test-example' } as any;
    const config = {
      source: {
        openapi: '3.0.3',
        info: { title: 'test', version: '1' },
        paths: {
          '/example': {
            get: {
              operationId: 'Example_list',
              responses: {
                '200': {
                  description: 'ok',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/Example' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: { Example: { type: 'object', properties: { id: { type: 'string' } } } },
        },
      },
      apiMeta: true,
      apiSchema: true,
      operations: { match: /^Example_/ },
    } as any;
    const cache = await cli._outputFiles(openapiTypescript, config, {} as any, module, {});
    await cli._generateApis(openapiTypescript, cache.ast, config, {} as any, module);
    for (const file of [
      'api/openapi/index.ts',
      'api/openapi/schemas.ts',
      'api/example.ts',
      'apiMeta/example.ts',
      'apiSchema/example.ts',
    ]) {
      const content = await readFile(path.join(modulePath, 'src', file), 'utf8');
      assert.match(content, /from ['"]\.[^'"]*\.ts['"]/);
      assert.doesNotMatch(content, /from ['"]\.[^'"]*\.jsx?['"]/);
    }
  });
});
