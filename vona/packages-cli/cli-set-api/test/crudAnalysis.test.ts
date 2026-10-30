import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import { CliCommand } from '../../cabloy-cli/src/lib/cli.ts';
import { LocalTemplate } from '../../cabloy-cli/src/lib/local.template.ts';
import { CliToolsCrud } from '../src/lib/bean/cli.tools.crud.ts';
import { CliToolsCrudBasic } from '../src/lib/bean/cli.tools.crudBasic.ts';
import { CliToolsCrudStart } from '../src/lib/bean/cli.tools.crudStart.ts';
import crud from '../src/lib/command/tools.crud.ts';
import basic from '../src/lib/command/tools.crudBasic.ts';
import start from '../src/lib/command/tools.crudStart.ts';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = path.resolve(packageRoot, '../../..');
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
  flags: object = {},
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
    ...flags,
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

describe('optional CRUD analysis generation', { concurrency: false }, () => {
  it('declares optional flags without adding interactive questions and uses CLI boolean coercion', async () => {
    for (const definition of [crud, basic, start]) {
      assert.equal(definition.options.aggregate.type, 'boolean');
      assert.equal(definition.options.groupBy.type, 'string');
      assert.deepEqual(Object.keys(definition.groups.default.questions), [
        'resourceName',
        'module',
      ]);
      for (const [args, expected] of [
        [[], undefined],
        [['--aggregate'], true],
        [['--aggregate=false'], false],
      ] as const) {
        const command = new CliCommand([...args], { meta: definition, argv: {} });
        const parsed = await (command as any)[Symbol.for('eb:Command#parse')]([...args]);
        assert.equal(parsed.aggregate, expected);
      }
    }
  });

  for (const [edition, Class] of Object.entries(editions)) {
    it(`${edition}: default boilerplate output is unchanged from HEAD`, async () =>
      fixture(async root => {
        const { cli, moduleRoot } = await makeCli(root, Class);
        await cli.execute();
        const prefix = `vona/packages-cli/cli-set-api/cli/templates/tools/crud${edition === 'basic' ? 'Basic' : 'Start'}/boilerplate/`;
        const originalFiles = execFileSync(
          'git',
          ['ls-tree', '-r', '--name-only', 'HEAD', '--', prefix],
          { cwd: repoRoot, encoding: 'utf8' },
        )
          .trim()
          .split('\n');
        for (const file of originalFiles) {
          const original = execFileSync('git', ['show', `HEAD:${file}`], {
            cwd: repoRoot,
            encoding: 'utf8',
          });
          const expected = await cli.template.renderContent({ content: original });
          const output = file
            .slice(prefix.length)
            .replaceAll('{{resourceName}}', 'record')
            .replace(/_$/, '');
          assert.equal(await read(moduleRoot, output), expected, output);
        }
        assert.equal(
          (await filesUnder(moduleRoot)).some(file => /Analysis|GroupRes|AggregateRes/.test(file)),
          false,
        );
        assert.doesNotMatch(
          await read(moduleRoot, 'src/config/locale/en-us.ts'),
          /RecordGroup|RecordAggregate/,
        );
      }));

    for (const flags of [
      { aggregate: true },
      { groupBy: 'name' },
      { groupBy: 'description' },
      { aggregate: true, groupBy: 'name' },
      { aggregate: true, groupBy: 'description' },
      { aggregate: false },
    ]) {
      it(`${edition}: renders ${JSON.stringify(flags)} with matching optional files`, async () =>
        fixture(async root => {
          const { cli, moduleRoot, invocations } = await makeCli(root, Class, flags);
          await cli.execute();
          const files = await filesUnder(moduleRoot);
          const enabled = !!(flags.aggregate || flags.groupBy);
          assert.equal(
            files.some(file => file.includes('AnalysisReq')),
            false,
          );
          assert.equal(files.includes('src/lib/recordAnalysis.ts'), enabled);
          assert.equal(files.includes('test/recordAnalysis.test.ts'), enabled);
          assert.equal(files.includes('src/dto/recordGroupResItem.tsx'), !!flags.groupBy);
          assert.equal(files.includes('src/dto/recordAggregateRes.tsx'), !!flags.aggregate);
          assert.deepEqual(invocations, [[':tools:metadata', 'test-record']]);
          const controller = await read(moduleRoot, 'src/controller/record.ts');
          const service = await read(moduleRoot, 'src/service/record.ts');
          assert.equal(controller.includes("@Web.get('group'"), !!flags.groupBy);
          assert.equal(controller.includes("@Web.get('aggregate'"), !!flags.aggregate);
          assert.doesNotMatch(controller, /AnalysisReq|\$schema/);
          assert.ok(
            controller.includes(
              'async select(@Arg.filter(DtoRecordSelectReq) params: IQueryParams<ModelRecord>)',
            ),
          );
          for (const action of [
            ...(flags.groupBy ? ['group'] : []),
            ...(flags.aggregate ? ['aggregate'] : []),
          ]) {
            const mode = action === 'group' ? 'Group' : 'Aggregate';
            assert.ok(
              controller.includes(
                `async ${action}(@Arg.filter(DtoRecordSelectReq, { mode: '${action}' }) params: TypeAnalysis${mode}Params<typeof recordAnalysis>)`,
              ),
              `${action} must derive action controls from the same SelectReq policy`,
            );
          }
          if (enabled) {
            const req = await read(moduleRoot, 'src/dto/recordSelectReq.tsx');
            assert.match(req, /\$Dto.queryPage\(EntityRecord, \['name', 'createdAt'\]\)/);
            assert.match(controller, /actionInherit: 'select'/);
            assert.doesNotMatch(controller, /dataScope/);
            assert.match(req, /analysis: recordAnalysis/);
            assert.match(req, /import \{ recordAnalysis \} from '\.\.\/lib\/recordAnalysis\.ts'/);
            assert.doesNotMatch(service, /\.\.\.params|\.group\(|\.aggregate\(/);
            const policy = await read(moduleRoot, 'src/lib/recordAnalysis.ts');
            assert.match(
              policy,
              /export const recordAnalysis = \$defineAnalysis\(\(\) => ModelRecord, \{/,
            );
            assert.match(policy, /aggrs: \{ count: \['\*'\] \}/);
            assert.match(policy, /limits: \{ maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 \}/);
            assert.equal(policy.includes('    group:'), !!flags.groupBy);
            assert.equal(policy.includes('    aggregate:'), !!flags.aggregate);
            assert.ok(policy.includes(`groups: [${flags.groupBy ? `'${flags.groupBy}'` : ''}]`));
            assert.doesNotMatch(policy, /AnalysisAggrs|AnalysisGroup/);
            assert.doesNotMatch(service, /normalizeRecordCount|count_all:/);
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
            assert.match(analysisTest, /for \(const action of \[[^\]]+\] as const\)/);
            assert.match(analysisTest, /pageNo: 2, pageSize: 0/);
          }
          if (flags.groupBy) {
            assert.ok(
              controller.indexOf("@Web.get('group'") < controller.indexOf("@Web.get(':id'"),
            );
            assert.match(
              service,
              /async group\(params\?: TypeAnalysisGroupParams<typeof recordAnalysis>\)/,
            );
            assert.match(
              service,
              /await \$executeAnalysisGroup\(this\.scope\.model\.record, recordAnalysis, params\)/,
            );
            const dto = await read(moduleRoot, 'src/dto/recordGroupResItem.tsx');
            assert.match(dto, /\$Dto\.analysisGroup\(recordAnalysis\)/);
            if (flags.groupBy === 'description') {
              assert.match(dto, /description\?: string \| null/);
              assert.match(dto, /z.string\(\).nullable\(\).optional\(\)/);
              assert.match(service, /Object\.hasOwn\(item, 'description'\)/);
              assert.match(service, /description: item.description \?\? null/);
              assert.match(service, /\} : item/);
            } else {
              assert.match(service, /return await \$executeAnalysisGroup\(/);
              assert.doesNotMatch(service, /items\.map/);
            }
          }
          if (flags.aggregate) {
            assert.match(
              service,
              /async aggregate\(params\?: TypeAnalysisAggregateParams<typeof recordAnalysis>\)/,
            );
            assert.match(
              service,
              /return await \$executeAnalysisAggregate\(this\.scope\.model\.record, recordAnalysis, params\)/,
            );
            assert.match(
              await read(moduleRoot, 'src/dto/recordAggregateRes.tsx'),
              /\$Dto\.analysisAggregate\(recordAnalysis\)/,
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
    }
  }

  it(
    'freshly packaged beans and production templates match source generation',
    {
      skip: process.env.CABLOY_TEST_PACKAGED_CLI !== '1',
    },
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
      const { beans } = await import('../dist/index.js');
      const previousBrand = process.env.CabloyCliBrandName;
      process.env.CabloyCliBrandName = 'vona';
      try {
        for (const [edition, Class] of Object.entries(editions)) {
          for (const flags of [
            {},
            { aggregate: true },
            { groupBy: 'name' },
            { groupBy: 'description' },
            { aggregate: true, groupBy: 'description' },
            { aggregate: false },
          ]) {
            await fixture(async root => {
              const source = await makeCli(path.join(root, 'source'), Class, flags);
              const packaged = await makeCli(
                path.join(root, 'packaged'),
                beans[edition === 'basic' ? 'tools.crudBasic' : 'tools.crudStart'],
                flags,
                LocalTemplate,
              );
              for (const target of [
                `tools/crud${edition === 'basic' ? 'Basic' : 'Start'}/boilerplate`,
                `tools/crud${edition === 'basic' ? 'Basic' : 'Start'}/snippets`,
                ...(flags.aggregate || flags.groupBy ? ['tools/crudAnalysis/common'] : []),
                ...(flags.groupBy ? ['tools/crudAnalysis/group'] : []),
                ...(flags.aggregate ? ['tools/crudAnalysis/aggregate'] : []),
              ]) {
                const resolved = packaged.cli.template.resolveTemplatePath('api', target);
                const prefix = target.endsWith('/snippets')
                  ? 'dist-cli/templates'
                  : 'cli/templates';
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
                  `${edition} ${JSON.stringify(flags)} ${file}`,
                );
              }
              assert.deepEqual(packaged.invocations, source.invocations);
            });
          }
        }
      } finally {
        if (previousBrand === undefined) delete process.env.CabloyCliBrandName;
        else process.env.CabloyCliBrandName = previousBrand;
      }
    },
  );

  it('validates exact dimensions in every execution path before any writes', async () => {
    for (const Class of [CliToolsCrud, CliToolsCrudBasic, CliToolsCrudStart]) {
      for (const flags of [
        ...[
          '',
          'id',
          'iid',
          'deleted',
          'createdAt',
          'unknown',
          'name,description',
          'lower(name)',
          ' name',
          ['name', 'description'],
        ].map(groupBy => ({ groupBy })),
        { aggregate: 'true' },
      ]) {
        await fixture(async root => {
          const { cli, moduleRoot, invocations } = await makeCli(root, Class, flags);
          const before = await filesUnder(moduleRoot);
          cli.helper.ensureDir = async () => {
            throw new Error('unexpected write');
          };
          await assert.rejects(
            () => cli.execute(),
            /--groupBy must be exactly|--aggregate must be a boolean/,
          );
          assert.deepEqual(await filesUnder(moduleRoot), before);
          assert.deepEqual(invocations, []);
        });
      }
    }
  });

  it('wrapper explicitly forwards flags and metadata runs only after all rendering', async () => {
    for (const edition of ['basic', 'start']) {
      for (const flags of [
        {},
        { aggregate: true },
        { aggregate: false, groupBy: 'description' },
        { aggregate: true, groupBy: 'name' },
      ]) {
        await fixture(async root => {
          if (edition === 'start') await fs.writeFile(path.join(root, '__CABLOY_START__'), '');
          const { cli, invocations } = await makeCli(root, CliToolsCrud, flags);
          await cli.execute();
          assert.deepEqual(invocations, [
            [
              edition === 'start' ? ':tools:crudStart' : ':tools:crudBasic',
              'record',
              '--module=test-record',
              '--nometadata',
              ...(flags.aggregate === undefined ? [] : [`--aggregate=${flags.aggregate}`]),
              ...(flags.groupBy === undefined ? [] : [`--groupBy=${flags.groupBy}`]),
            ],
            [':tools:metadata', 'test-record'],
          ]);
        });
      }
    }
  });
});
