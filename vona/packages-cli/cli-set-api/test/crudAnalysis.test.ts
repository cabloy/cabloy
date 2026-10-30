import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import { LocalTemplate } from '../../cabloy-cli/src/lib/local.template.ts';
import { CliToolsCrud } from '../src/lib/bean/cli.tools.crud.ts';
import { CliToolsCrudBasic } from '../src/lib/bean/cli.tools.crudBasic.ts';
import { CliToolsCrudStart } from '../src/lib/bean/cli.tools.crudStart.ts';
import { CliToolsMasterDetail } from '../src/lib/bean/cli.tools.masterDetail.ts';
import crud from '../src/lib/command/tools.crud.ts';
import basic from '../src/lib/command/tools.crudBasic.ts';
import start from '../src/lib/command/tools.crudStart.ts';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const templateRoot = path.join(packageRoot, 'cli/templates');
const editions = { basic: CliToolsCrudBasic, start: CliToolsCrudStart };

// Exercise the authored templates with the production renderer; packaged templates
// are checked separately because existing dist-cli output can intentionally be stale.
class SourceTemplate extends LocalTemplate {
  resolveTemplatePath(_set: string, target: string) {
    return path.isAbsolute(target) ? target : path.join(templateRoot, target);
  }
}

async function fixture<T>(fn: (root: string) => Promise<T>) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'crud-analysis-'));
  try {
    return await fn(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

async function makeCli(
  root: string,
  Class: typeof CliToolsCrudBasic | typeof CliToolsCrudStart | typeof CliToolsCrud,
  Template: typeof LocalTemplate = SourceTemplate,
) {
  const moduleRoot = path.join(root, 'module');
  await fs.mkdir(path.join(moduleRoot, 'src/bean'), { recursive: true });
  await fs.mkdir(path.join(moduleRoot, 'src/config/locale'), { recursive: true });
  await fs.writeFile(
    path.join(moduleRoot, 'package.json'),
    JSON.stringify({ type: 'module', vonaModule: { fileVersion: 0 } }),
  );
  await fs.writeFile(
    path.join(moduleRoot, 'src/bean/meta.index.ts'),
    "import { Meta } from 'vona-module-a-meta';\n@Meta({ indexes: {} }) class MetaIndex {}\n",
  );
  await fs.writeFile(
    path.join(moduleRoot, 'src/bean/meta.version.ts'),
    'class MetaVersion { async update(_options: IMetaVersionUpdateOptions) {} }\n',
  );
  for (const locale of ['en-us', 'zh-cn']) {
    await fs.writeFile(
      path.join(moduleRoot, `src/config/locale/${locale}.ts`),
      'export default {};\n',
    );
  }
  const argv = {
    _: [],
    module: 'test-record',
    resourceName: 'record',
    projectPath: root,
  };
  const cli = new Class({ context: { argv } } as never);
  cli.modulesMeta = { modules: { 'test-record': { root: moduleRoot } } } as never;
  cli.__template = new Template(cli);
  cli.console.log = async () => {};
  cli.helper.formatFile = async () => {};
  const invocations: string[][] = [];
  cli.helper.invokeCli = async args => {
    invocations.push(args);
  };
  return { cli, moduleRoot, invocations };
}

async function filesUnder(root: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      files.push(
        ...(await filesUnder(path.join(root, entry.name))).map(file => `${entry.name}/${file}`),
      );
    } else {
      files.push(entry.name);
    }
  }
  return files.sort();
}

async function read(root: string, file: string) {
  return await fs.readFile(path.join(root, file), 'utf8');
}

describe('default CRUD analysis generation', { concurrency: false }, () => {
  it('removes analysis flags from command options and usage without adding questions', () => {
    for (const definition of [crud, basic, start]) {
      assert.deepEqual(Object.keys(definition.options), ['module']);
      assert.doesNotMatch(definition.info.usage, /--aggregate|--groupBy/);
      assert.deepEqual(Object.keys(definition.groups.default.questions), [
        'resourceName',
        'module',
      ]);
    }
  });

  for (const [edition, Class] of Object.entries(editions)) {
    it(`${edition}: generates both actions with one finite name/count policy by default`, async () =>
      fixture(async root => {
        const { cli, moduleRoot, invocations } = await makeCli(root, Class);
        await cli.execute();
        const files = await filesUnder(moduleRoot);
        for (const file of [
          'src/lib/recordAnalysis.ts',
          'test/recordAnalysis.test.ts',
          'src/dto/recordGroupResItem.tsx',
          'src/dto/recordAggregateRes.tsx',
        ]) {
          assert.ok(files.includes(file), file);
        }
        assert.equal(
          files.some(file => file.includes('AnalysisReq')),
          false,
        );
        assert.deepEqual(invocations, [[':tools:metadata', 'test-record']]);
        const controller = await read(moduleRoot, 'src/controller/record.ts');
        const service = await read(moduleRoot, 'src/service/record.ts');
        const req = await read(moduleRoot, 'src/dto/recordSelectReq.tsx');
        const policy = await read(moduleRoot, 'src/lib/recordAnalysis.ts');
        assert.doesNotMatch(controller, /AnalysisReq|\$schema|dataScope/);
        assert.ok(
          controller.includes(
            'async select(@Arg.filter(DtoRecordSelectReq) params: IQueryParams<ModelRecord>)',
          ),
        );
        assert.match(req, /\$Dto.queryPage\(EntityRecord, \['name', 'createdAt'\]\)/);
        assert.match(req, /analysis: recordAnalysis/);
        assert.match(req, /import \{ recordAnalysis \} from '\.\.\/lib\/recordAnalysis\.ts'/);
        assert.match(
          policy,
          /export const recordAnalysis = \$defineAnalysis\(\(\) => ModelRecord, \{/,
        );
        assert.match(policy, /groups: \['name'\]/);
        assert.match(policy, /aggrs: \{ count: \['\*'\] \}/);
        assert.match(policy, /group: \{ groups: \['name'\], aggrs: \{ count: \['\*'\] \} \}/);
        assert.match(policy, /aggregate: \{ aggrs: \{ count: \['\*'\] \} \}/);
        assert.match(policy, /limits: \{ maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 \}/);
        assert.doesNotMatch(policy, /description|AnalysisAggrs|AnalysisGroup/);
        assert.doesNotMatch(
          service,
          /\.\.\.params|\.group\(|\.aggregate\(|items\.map|Object\.hasOwn|normalizeRecordCount|count_all:/,
        );
        assert.equal(controller.match(/actionInherit: 'select'/g)?.length, 2);
        for (const action of ['group', 'aggregate']) {
          const mode = action === 'group' ? 'Group' : 'Aggregate';
          assert.ok(
            controller.includes(
              `async ${action}(@Arg.filter(DtoRecordSelectReq, { mode: '${action}' }) params: TypeAnalysis${mode}Params<typeof recordAnalysis>)`,
            ),
            `${action} must derive action controls from the same SelectReq policy`,
          );
          assert.ok(
            controller.indexOf(`@Web.get('${action}'`) < controller.indexOf("@Web.get(':id'"),
          );
          assert.ok(
            service.includes(
              `async ${action}(params?: TypeAnalysis${mode}Params<typeof recordAnalysis>)`,
            ),
          );
          assert.ok(
            service.includes(
              `return await $executeAnalysis${mode}(this.scope.model.record, recordAnalysis, params)`,
            ),
          );
        }
        const groupDto = await read(moduleRoot, 'src/dto/recordGroupResItem.tsx');
        assert.match(groupDto, /\$Dto\.analysisGroup\(recordAnalysis\)/);
        assert.doesNotMatch(groupDto, /description|\$Class|\$makeSchema|zod/);
        assert.match(
          await read(moduleRoot, 'src/dto/recordAggregateRes.tsx'),
          /\$Dto\.analysisAggregate\(recordAnalysis\)/,
        );
        for (const locale of ['en-us', 'zh-cn']) {
          const source = await read(moduleRoot, `src/config/locale/${locale}.ts`);
          assert.match(source, /RecordGroup/);
          assert.match(source, /RecordAggregate/);
        }
        const analysisTest = await read(moduleRoot, 'test/recordAnalysis.test.ts');
        assert.doesNotMatch(analysisTest, /normalizeRecordCount|normalizes only/);
        assert.match(
          analysisTest,
          /returns default and requested-only string counts with validated controls/,
        );
        assert.match(analysisTest, /JSON\.stringify\(\{ count: \['\*'\] \}\)/);
        assert.match(
          analysisTest,
          /The shared policy does not enable analysis controls on ordinary select/,
        );
        assert.match(analysisTest, /\{ name \}/);
        assert.match(analysisTest, /where: \{ id: fixture.id \}/);
        assert.match(
          analysisTest,
          /columns: \['id'\], orders: 'name,desc', pageNo: 2, pageSize: 1/,
        );
        assert.match(analysisTest, /assert.rejects\(/);
        assert.match(analysisTest, /for \(const action of \['group', 'aggregate'\] as const\)/);
        assert.match(analysisTest, /\['description'\]/);
        assert.match(analysisTest, /pageNo: 2, pageSize: 0/);
        const actionTest = await read(moduleRoot, 'test/record.test.ts');
        if (edition === 'basic') {
          assert.match(
            actionTest,
            /group: \['get', `\$\{moduleApiPath\}\/group`, 'Group Record'\]/,
          );
          assert.match(
            actionTest,
            /aggregate: \['get', `\$\{moduleApiPath\}\/aggregate`, 'Aggregate Record'\]/,
          );
          assert.match(actionTest, /group: `\$\{controllerBeanFullName\}#select`/);
          assert.match(actionTest, /aggregate: `\$\{controllerBeanFullName\}#select`/);
        } else {
          assert.match(
            actionTest,
            /const actions = \['create', 'select', 'view', 'update', 'delete', 'group', 'aggregate'\]/,
          );
        }
        for (const file of files.filter(file => /\.tsx?$/.test(file))) {
          const source = await read(moduleRoot, file);
          assert.ok(source.trim(), file);
          assert.doesNotMatch(source, /<%/);
          const result = ts.transpileModule(source, {
            fileName: file,
            reportDiagnostics: true,
            compilerOptions: {
              target: ts.ScriptTarget.ESNext,
              module: ts.ModuleKind.ESNext,
              experimentalDecorators: true,
            },
          });
          assert.deepEqual(
            result.diagnostics?.filter(
              diagnostic => diagnostic.category === ts.DiagnosticCategory.Error,
            ),
            [],
            file,
          );
        }
      }));

    it(`${edition}: aggregate master-detail cleanup removes generated standalone analysis artifacts`, async () =>
      fixture(async root => {
        const { cli, moduleRoot } = await makeCli(root, Class);
        await cli.execute();
        const masterDetail = new CliToolsMasterDetail({
          context: {
            argv: {
              _detailModule: { root: moduleRoot },
              detailResourceName: 'record',
              createdDetailResource: true,
              detailMode: 'aggregate',
            },
          },
        } as never);
        (masterDetail as any)._handleAggregateDetailMode(false);
        const files = await filesUnder(moduleRoot);
        for (const file of [
          'src/controller/record.ts',
          'src/service/record.ts',
          'src/lib/recordAnalysis.ts',
          'test/record.test.ts',
          'test/recordAnalysis.test.ts',
        ]) {
          assert.ok(!files.includes(file), file);
        }
        assert.ok(!files.some(file => file.startsWith('src/dto/')));
        assert.ok(files.includes('src/entity/record.tsx'));
        assert.ok(files.includes('src/model/record.ts'));
      }));
  }

  it(
    'freshly packaged beans and production templates match default source generation',
    { skip: process.env.CABLOY_TEST_PACKAGED_CLI !== '1' },
    async () => {
      // Run after tsc:publish. Published packages ship raw EJS in cli/ and compiled
      // snippets in dist-cli/; verify both are packaged, not just present locally.
      const [pack] = JSON.parse(
        execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
          cwd: packageRoot,
          encoding: 'utf8',
        }),
      ) as { files: { path: string }[] }[];
      const packedFiles = new Set(pack.files.map(file => file.path));
      assert.ok(packedFiles.has('dist/index.js'));
      const { beans, commands } = await import('../dist/index.js');
      for (const command of ['crud', 'crudBasic', 'crudStart']) {
        assert.deepEqual(Object.keys(commands.tools[command].options), ['module']);
        assert.doesNotMatch(commands.tools[command].info.usage, /--aggregate|--groupBy/);
      }
      const previousBrand = process.env.CabloyCliBrandName;
      process.env.CabloyCliBrandName = 'vona';
      try {
        for (const [edition, Class] of Object.entries(editions)) {
          await fixture(async root => {
            const source = await makeCli(path.join(root, 'source'), Class);
            const packaged = await makeCli(
              path.join(root, 'packaged'),
              beans[edition === 'basic' ? 'tools.crudBasic' : 'tools.crudStart'],
              LocalTemplate,
            );
            for (const target of [
              `tools/crud${edition === 'basic' ? 'Basic' : 'Start'}/boilerplate`,
              `tools/crud${edition === 'basic' ? 'Basic' : 'Start'}/snippets`,
              'tools/crudAnalysis/common',
              'tools/crudAnalysis/group',
              'tools/crudAnalysis/aggregate',
            ]) {
              const resolved = packaged.cli.template.resolveTemplatePath('api', target);
              const prefix = target.endsWith('/snippets') ? 'dist-cli/templates' : 'cli/templates';
              assert.equal(resolved, path.join(packageRoot, prefix, target));
              const templateFiles = await filesUnder(resolved);
              assert.ok(templateFiles.length, target);
              for (const file of templateFiles) {
                assert.ok(
                  packedFiles.has(`${prefix}/${target}/${file}`),
                  `missing packaged template: ${target}/${file}`,
                );
              }
            }
            await source.cli.execute();
            await packaged.cli.execute();
            const files = await filesUnder(source.moduleRoot);
            assert.deepEqual(await filesUnder(packaged.moduleRoot), files);
            for (const file of files) {
              assert.equal(
                await read(packaged.moduleRoot, file),
                await read(source.moduleRoot, file),
                `${edition} ${file}`,
              );
            }
            assert.deepEqual(packaged.invocations, source.invocations);
          });
        }
      } finally {
        if (previousBrand === undefined) delete process.env.CabloyCliBrandName;
        else process.env.CabloyCliBrandName = previousBrand;
      }
    },
  );

  it('wrapper invokes default edition generation and refreshes metadata after all rendering', async () => {
    for (const edition of ['basic', 'start']) {
      await fixture(async root => {
        const { cli, moduleRoot, invocations } = await makeCli(root, CliToolsCrud);
        await fs.writeFile(
          path.join(root, edition === 'start' ? '__CABLOY_START__' : '__CABLOY_BASIC__'),
          '',
        );
        cli.helper.invokeCli = async args => {
          invocations.push(args);
          if (args[0] === ':tools:metadata') {
            assert.match(await read(moduleRoot, 'src/bean/ssrMenu.record.ts'), /record/);
          }
        };
        await cli.execute();
        assert.deepEqual(invocations, [
          [
            edition === 'start' ? ':tools:crudStart' : ':tools:crudBasic',
            'record',
            '--module=test-record',
            '--nometadata',
          ],
          [':tools:metadata', 'test-record'],
        ]);
      });
    }
  });
});
