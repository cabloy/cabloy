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
  const messages: unknown[] = [];
  cli.console.log = async message => {
    messages.push(message);
  };
  cli.helper.formatFile = async () => {};
  const invocations: string[][] = [];
  cli.helper.invokeCli = async args => {
    invocations.push(args);
  };
  return { cli, moduleRoot, invocations, messages };
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

function assertExternalActionCalls(source: string, fileName: string) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  let calls = 0;
  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'performAction'
    ) {
      calls++;
      const options = node.arguments[2];
      assert.ok(options && ts.isObjectLiteralExpression(options), fileName);
      assert.ok(
        options.properties.some(
          property =>
            ts.isPropertyAssignment(property) &&
            ts.isIdentifier(property.name) &&
            property.name.text === 'innerAccess' &&
            property.initializer.kind === ts.SyntaxKind.FalseKeyword,
        ),
        `${fileName}: performAction must use innerAccess: false`,
      );
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.ok(calls > 0, `${fileName}: expected performAction calls`);
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
          'src/lib/recordQuery.ts',
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
        const queryPolicy = await read(moduleRoot, 'src/lib/recordQuery.ts');
        const entity = await read(moduleRoot, 'src/entity/record.tsx');
        const migration = await read(moduleRoot, 'src/bean/meta.version.ts');
        const createDto = await read(moduleRoot, 'src/dto/recordCreate.tsx');
        const updateDto = await read(moduleRoot, 'src/dto/recordUpdate.tsx');
        if (edition === 'start') {
          assert.match(entity, /departmentId: TableIdentity \| null;/);
          assert.match(entity, /userIdOwner: TableIdentity;/);
          assert.doesNotMatch(entity, /(?:departmentId|userIdOwner)\?:/);
          assert.match(entity, /@Api\.field\([^;]*v\.nullable\(\)[^;]*\)\s+departmentId:/);
          assert.match(entity, /@Api\.field\([^;]*v\.required\(\)[^;]*\)\s+userIdOwner:/);
          for (const field of ['departmentId', 'userIdOwner']) {
            assert.ok(migration.includes(`table.tableIdentity(entityRecord.${field})`), field);
          }
          for (const [kind, dto] of [
            ['create', createDto],
            ['update', updateDto],
          ]) {
            assert.ok(dto.includes(`$Dto.${kind}(() => ModelRecord, {`));
            assert.match(dto, /columns: \['name', 'description'\]/);
            assert.doesNotMatch(dto, /departmentId|userIdOwner/);
          }
          assert.match(
            service,
            /async create\(record: DtoRecordCreate & Partial<Pick<EntityRecord, 'departmentId' \| 'userIdOwner'>>\)/,
          );
        } else {
          assert.doesNotMatch(entity, /departmentId|userIdOwner/);
          assert.doesNotMatch(migration, /departmentId|userIdOwner/);
          assert.match(createDto, /\$Dto\.create\(\(\) => ModelRecord\) \{\}/);
          assert.match(updateDto, /\$Dto\.update\(\(\) => ModelRecord\) \{\}/);
          assert.match(service, /async create\(record: DtoRecordCreate\)/);
        }
        assert.match(
          queryPolicy,
          /export const recordQuery = \$defineQuery\(\(\) => ModelRecord, \{/,
        );
        assert.match(queryPolicy, /id: \{ operators: \['eq', 'in'\] \}/);
        assert.match(queryPolicy, /name: \{ operators: \['eq', 'containsI', 'in'\] \}/);
        assert.match(queryPolicy, /createdAt: \{ operators: \['gte', 'lt'\] \}/);
        assert.match(queryPolicy, /orderable: \['id', 'name', 'createdAt'\]/);
        assert.match(queryPolicy, /name: \{ field: 'name', op: 'containsI' \}/);
        assert.match(queryPolicy, /createdAt: \{ field: 'createdAt' \}/);
        assert.match(
          queryPolicy,
          /defaults: \{ orders: \[\{ field: 'id', direction: 'asc' \}\] \}/,
        );
        assert.match(queryPolicy, /projection: \{ mode: 'fixed' \}/);
        assert.doesNotMatch(queryPolicy, /description|Object\.keys|\.\.\./);
        assert.doesNotMatch(controller, /IQueryParams|TypeAnalysis(?:Group|Aggregate)Params/);
        assert.doesNotMatch(controller, /AnalysisReq|\$schema/);
        assert.ok(
          controller.includes(
            '@Arg.filter(DtoRecordSelectReq) params: TypeQueryInput<typeof recordQuery>',
          ),
        );
        assert.match(controller, /import \{ \$compileQuery \} from 'vona-module-a-orm'/);
        assert.match(controller, /import \{ recordQuery \} from '\.\.\/lib\/recordQuery\.ts'/);
        assert.match(
          controller,
          /import \{ recordAnalysis \} from '\.\.\/lib\/recordAnalysis\.ts'/,
        );
        assert.equal(controller.match(/const query = \$compileQuery\(/g)?.length, 3);
        const scopeOptions =
          edition === 'start' ? ', { scopeWhere: rbacScopeCurrent.where() }' : '';
        assert.ok(
          controller.includes(
            `const query = $compileQuery(this.scope.model.record, recordQuery, params${scopeOptions});\n    return await this.scope.service.record.select(query);`,
          ),
        );
        if (edition === 'start') {
          assert.equal(controller.match(/scopeWhere: rbacScopeCurrent\.where\(\)/g)?.length, 3);
          assert.equal(
            controller.match(/@Arg\.rbacScopeCurrent\(\) rbacScopeCurrent: IRbacScopeAccess/g)
              ?.length,
            8,
          );
          assert.equal(controller.match(/@Passport\.rbac\(\{ dataScope: true/g)?.length, 8);
          assert.equal(controller.match(/rbacScopeCurrent\.checkEntry\(data\)/g)?.length, 3);
          assert.ok(
            controller.includes(`return (await this.scope.service.record.create({
      ...record,
      ...rbacScopeCurrent.ownerValues(),
    })).id;`),
          );
          for (const [action, read] of [
            ['view', 'this.scope.service.record.view(id)'],
            ['update', 'this.scope.model.record.getById(id)'],
            ['delete', 'this.scope.model.record.getById(id)'],
          ]) {
            const method = controller.slice(controller.indexOf(`  async ${action}(`));
            assert.ok(
              method.includes(
                `const data = await ${read};\n    rbacScopeCurrent.checkEntry(data);`,
              ),
              action,
            );
            if (action === 'view') {
              assert.ok(method.includes('rbacScopeCurrent.checkEntry(data);\n    return data;'));
            } else {
              assert.ok(
                method.indexOf('rbacScopeCurrent.checkEntry(data)') <
                  method.indexOf(`await this.scope.service.record.${action}(`),
                action,
              );
            }
          }
          assert.match(
            controller,
            /@Passport\.rbac\(\{ dataScope: true, actionInherit: 'select' \}\)/,
          );
          assert.doesNotMatch(controller, /rbacScopeCurrent\.where\(params(?:\.where)?\)/);
        } else {
          assert.doesNotMatch(controller, /rbacScopeCurrent|scopeWhere|dataScope/);
        }
        assert.match(req, /\$Dto.queryPage\(recordQuery, \['name', 'createdAt'\]\)/);
        assert.match(req, /query: recordQuery/);
        assert.doesNotMatch(req, /filter:\s*\{\s*table:/);
        assert.match(req, /import \{ recordQuery \} from '\.\.\/lib\/recordQuery\.ts'/);
        assert.match(service, /async select\(params\?: IQueryParams<ModelRecord>\)/);
        assert.match(service, /import type \{ ModelRecord \} from '\.\.\/model\/record\.ts'/);
        assert.match(service, /return await model\.selectAndCount\(params\)/);
        assert.doesNotMatch(
          service,
          /\$compileQuery|TypeQuery(?:Group|Aggregate)?Input|recordQuery/,
        );
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
              `@Arg.filter(DtoRecordSelectReq, { mode: '${action}' }) params: TypeQuery${mode}Input<typeof recordQuery, typeof recordAnalysis>`,
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
          const scopeWhere = edition === 'start' ? ', scopeWhere: rbacScopeCurrent.where()' : '';
          assert.ok(
            controller.includes(
              `const query = $compileQuery(this.scope.model.record, recordQuery, params, { mode: '${action}', analysis: recordAnalysis${scopeWhere} });\n    return await this.scope.service.record.${action}(query);`,
            ),
          );
          assert.ok(
            service.includes(`return await $executeAnalysis${mode}(model, recordAnalysis, params)`),
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
        assertExternalActionCalls(analysisTest, 'test/recordAnalysis.test.ts');
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
        assert.match(
          analysisTest,
          /import \{ \$makeSchema, v \} from 'vona-module-a-openapiutils'/,
        );
        assert.match(
          analysisTest,
          /const where = \{ field: 'id', op: 'eq', value: \$makeSchema\(v\.tableIdentity\(\)\)\.parse\(fixture\.id\) \} as const/,
        );
        assert.match(analysisTest, /where: JSON\.stringify\(where\)/);
        assert.match(analysisTest, /const serviceWhere = \{ id: fixture\.id \}/);
        assert.match(
          analysisTest,
          /scope\.service\.record\.select\(\{ where: serviceWhere, limit: 1 \}\)/,
        );
        for (const action of ['group', 'aggregate']) {
          assert.match(
            analysisTest,
            new RegExp(`scope\\.service\\.record\\.${action}\\(\\{\\s+where: serviceWhere,`),
          );
          assert.ok(
            analysisTest.includes(
              `scope.service.record.${action}({ where: serviceWhere, aggrs: { count: [] } })`,
            ),
          );
        }
        assert.doesNotMatch(
          analysisTest,
          /\$compileQuery|scope\.service\.record\.\w+\(\{ where[,}]/,
        );
        assert.match(analysisTest, /columns: JSON\.stringify\(\['id'\]\)/);
        assert.match(
          analysisTest,
          /orders: JSON\.stringify\(\[\{ field: 'name', direction: 'desc' \}\]\)/,
        );
        assert.match(analysisTest, /assert.rejects\(/);
        assert.match(analysisTest, /for \(const action of \['group', 'aggregate'\] as const\)/);
        assert.match(analysisTest, /\['description'\]/);
        assert.match(analysisTest, /pageNo: 2, pageSize: 1/);
        const actionTest = await read(moduleRoot, 'test/record.test.ts');
        assert.match(
          actionTest,
          /import \{ \$makeSchema, (?:SymbolOpenApiOptions, )?v \} from 'vona-module-a-openapiutils'/,
        );
        assert.match(
          actionTest,
          /where: JSON\.stringify\(\{ field: 'id', op: 'eq', value: \$makeSchema\(v\.tableIdentity\(\)\)\.parse\(recordId\) \}\)/,
        );
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
          assertExternalActionCalls(actionTest, 'test/record.test.ts');
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

    it(`${edition}: generates eight admin-scoped MCP Actions and locale-backed description follow-up by default`, async () =>
      fixture(async root => {
        const { cli, moduleRoot, messages } = await makeCli(root, Class);
        await cli.execute();
        const controller = await read(moduleRoot, 'src/controller/record.ts');
        assert.match(controller, /import \{ Api, Mcp, Resource, v \}/);
        assert.equal(controller.match(/@Mcp\.tool\(/g)?.length, 8);
        const actions = {
          Create: false,
          Select: true,
          Group: true,
          Aggregate: true,
          View: true,
          Update: false,
          Delete: false,
          DeleteBulk: false,
        };
        assert.equal(controller.match(/discovery:/g)?.length, 1);
        for (const [action, readOnly] of Object.entries(actions)) {
          const discovery =
            action === 'Select' ? "    discovery: { output: [['list', 'items']] },\n" : '';
          assert.ok(
            controller.includes(
              `@Mcp.tool({\n    ssrSites: ['${edition === 'basic' ? 'basic' : 'start'}-siteadmin:admin'],\n    description: $locale('Record${action}Description'),\n    readOnly: ${readOnly},\n${discovery}  })\n  @Web.`,
            ),
            action,
          );
        }
        assert.equal(controller.match(/@Passport\.rbac\(/g)?.length, 8);
        assert.match(
          controller,
          edition === 'start'
            ? /@Passport\.rbac\(\{ dataScope: true, actionInherit: 'delete' \}\)/
            : /@Passport\.rbac\(\{ actionInherit: 'delete' \}\)/,
        );
        if (edition === 'start') {
          assert.match(controller, /@Arg\.rbacScopeCurrent\(\) rbacScopeCurrent: IRbacScopeAccess/);
          assert.match(controller, /where: rbacScopeCurrent\.where\(\{ id: ids \}\)/);
          assert.match(controller, /deleteBulk\(entries\.map\(entry => entry\.id\)\)/);
        } else {
          assert.match(controller, /deleteBulk\(command\.ids\)/);
        }
        for (const locale of ['en-us', 'zh-cn']) {
          const source = await read(moduleRoot, `src/config/locale/${locale}.ts`);
          assert.equal(source.match(/TODO\(mcp-description\)/g)?.length, 8);
          const values = (await import(`data:text/javascript,${encodeURIComponent(source)}`))
            .default;
          for (const action of Object.keys(actions)) {
            const key = `Record${action}Description`;
            assert.ok(source.includes(`// TODO(mcp-description): ${key} -`), key);
            assert.ok(values[key]?.length > 0, key);
            assert.doesNotMatch(values[key], /todo|Action, DTO|Service behavior/i);
          }
        }
        assert.ok(
          messages.some(
            message =>
              typeof message === 'string' &&
              message.includes('TODO(mcp-description)') &&
              message.includes('bulk delete') &&
              message.includes('unfinished'),
          ),
        );
      }));

    it(`${edition}: preserves authored descriptions and pending markers when generating another resource`, async () =>
      fixture(async root => {
        const { cli, moduleRoot } = await makeCli(root, Class);
        for (const locale of ['en-us', 'zh-cn']) {
          await fs.writeFile(
            path.join(moduleRoot, `src/config/locale/${locale}.ts`),
            `export default { RecordUpdateDescription: 'Authored ${locale} update contract' };\n`,
          );
        }
        await cli.execute();
        cli.context.argv.resourceName = 'entry';
        await cli.execute();
        for (const locale of ['en-us', 'zh-cn']) {
          const source = await read(moduleRoot, `src/config/locale/${locale}.ts`);
          assert.ok(
            source.includes(`RecordUpdateDescription: 'Authored ${locale} update contract'`),
          );
          assert.ok(!source.includes('// TODO(mcp-description): RecordUpdateDescription -'));
          assert.ok(source.includes('// TODO(mcp-description): RecordCreateDescription -'));
          assert.ok(source.includes('// TODO(mcp-description): EntryUpdateDescription -'));
          assert.equal(source.match(/TODO\(mcp-description\)/g)?.length, 15);
        }
      }));

    for (const detailMode of ['aggregate', 'standalone'] as const) {
      it(`${edition}: ${detailMode} master-detail completes mode-aware MCP follow-up after metadata`, async () =>
        fixture(async root => {
          const parent = await makeCli(path.join(root, 'parent'), Class);
          await parent.cli.execute();
          const parentController = await read(parent.moduleRoot, 'src/controller/record.ts');
          if (edition === 'start' && detailMode === 'standalone') {
            // Older owner-capable Start scaffolds inferred all entity write columns.
            // The master-detail patch must retain its business-only write contract.
            for (const kind of ['create', 'update']) {
              const fileName = path.join(
                parent.moduleRoot,
                `src/dto/record${kind === 'create' ? 'Create' : 'Update'}.tsx`,
              );
              const source = await fs.readFile(fileName, 'utf8');
              await fs.writeFile(
                fileName,
                source.replace(
                  /extends \$Dto\.(create|update)\(\(\) => ModelRecord, \{\s*columns: \['name', 'description'\],?\s*\}\)/,
                  'extends $Dto.$1(() => ModelRecord)',
                ),
              );
            }
            const serviceFile = path.join(parent.moduleRoot, 'src/service/record.ts');
            const service = await fs.readFile(serviceFile, 'utf8');
            await fs.writeFile(
              serviceFile,
              service.replace(" & Partial<Pick<EntityRecord, 'departmentId' | 'userIdOwner'>>", ''),
            );
          }
          const child = await makeCli(path.join(root, 'child'), Class);
          // Master-detail patches the formatted migration marker produced by CRUD.
          child.cli.helper.formatFile = async ({ fileName }) => {
            if (path.basename(fileName) === 'meta.version.ts') {
              execFileSync(path.join(packageRoot, '../../../node_modules/.bin/oxfmt'), [
                '--write',
                '--threads=1',
                '--config',
                path.join(packageRoot, '../../../oxfmt.config.ts'),
                fileName,
              ]);
            }
          };
          child.cli.context.argv.module = 'test-entry';
          child.cli.context.argv.resourceName = 'entry';
          child.cli.modulesMeta = {
            modules: { 'test-entry': { root: child.moduleRoot } },
          } as never;
          for (const locale of ['en-us', 'zh-cn']) {
            await fs.writeFile(
              path.join(child.moduleRoot, `src/config/locale/${locale}.ts`),
              `export default {
  EntryUpdateDescription: 'Authored ${locale} update contract',
  // TODO(mcp-description): EntryViewDescription - refine using the actual Action, DTO and Service behavior.
  EntryViewDescription: 'Existing pending ${locale} view contract',
  // TODO(mcp-description): OtherCreateDescription - refine using the actual Action, DTO and Service behavior.
  OtherCreateDescription: 'Unrelated pending ${locale} contract',
};\n`,
            );
            const fileName = path.join(parent.moduleRoot, `src/config/locale/${locale}.ts`);
            const content = await fs.readFile(fileName, 'utf8');
            await fs.writeFile(
              fileName,
              content.replace(
                / {2}\/\/ TODO\(mcp-description\): RecordUpdateDescription -[^\n]*\n {2}RecordUpdateDescription: '[^']*',/,
                `  RecordUpdateDescription: 'Authored ${locale} parent contract',`,
              ),
            );
          }
          await fs.writeFile(
            path.join(root, edition === 'start' ? '__CABLOY_START__' : '__CABLOY_BASIC__'),
            '',
          );
          const masterDetail = new CliToolsMasterDetail({
            context: {
              argv: {
                _: [],
                projectPath: root,
                module: 'test-record',
                resourceName: 'record',
                detailModule: 'test-entry',
                detailResourceName: 'entry',
                detailMode,
              },
            },
          } as never);
          masterDetail.modulesMeta = {
            modules: {
              'test-record': { root: parent.moduleRoot },
              'test-entry': { root: child.moduleRoot },
            },
          } as never;
          masterDetail.__template = new SourceTemplate(masterDetail);
          masterDetail.helper.formatFile = async () => {};
          const events: string[] = [];
          let childController: string | undefined;
          masterDetail.console.log = async message => {
            events.push(String(message));
          };
          masterDetail.helper.invokeCli = async args => {
            events.push(args.join(' '));
            if (args[0].startsWith(':tools:crud')) {
              child.cli.context.argv.nometadata = true;
              await child.cli.execute();
              childController = await read(child.moduleRoot, 'src/controller/entry.ts');
            }
          };
          await masterDetail.execute();
          assert.deepEqual(events.slice(0, 3), [
            `:tools:crud${edition === 'basic' ? 'Basic' : 'Start'} entry --module=test-entry --nometadata`,
            ':tools:metadata test-entry',
            ':tools:metadata test-record',
          ]);
          assert.equal(events.length, 4);
          const reminder = events[3];
          assert.match(reminder, new RegExp(`Final MCP description follow-up \\(${detailMode}\\)`));
          assert.match(reminder, /already MCP-enabled parent Actions for test-record:record/);
          assert.match(reminder, /create\/view\/update\/delete affected by entrys/);
          assert.match(reminder, /every locale/);
          assert.match(reminder, /ancestor Actions only where their actual DTO\/Service path/);
          assert.match(
            reminder,
            /do not assume deleteBulk has the single-delete relation behavior/,
          );
          assert.match(reminder, /TODO\(mcp-description\).*unfinished/);
          assert.equal(await read(parent.moduleRoot, 'src/controller/record.ts'), parentController);
          const parentService = await read(parent.moduleRoot, 'src/service/record.ts');
          const nestedBase = await read(parent.moduleRoot, 'src/dto/detailEntryBase.tsx');
          assert.match(nestedBase, /columns: \['id', 'deleted', 'name', 'description'\]/);
          assert.doesNotMatch(nestedBase, /departmentId|userIdOwner|recordId/);
          assert.match(
            await read(parent.moduleRoot, 'src/model/record.ts'),
            /entrys: \$relation\.hasMany\('test-entry:entry', 'recordId'/,
          );
          for (const kind of ['create', 'update']) {
            const dto = await read(
              parent.moduleRoot,
              `src/dto/record${kind === 'create' ? 'Create' : 'Update'}.tsx`,
            );
            assert.match(dto, /include: \{ entrys: \{ dtoClass: DtoDetailEntryMutate \} \}/);
            assert.doesNotMatch(dto, /departmentId|userIdOwner|recordId/);
            if (edition === 'start') {
              assert.match(dto, /columns: \['name', 'description'\]/);
            } else {
              assert.doesNotMatch(dto, /columns:/);
            }
          }
          if (edition === 'start') {
            // These are authored-source regressions, not runtime authorization proof.
            assert.match(
              parentService,
              /private _prepareEntrysOwners<T extends object>\(\s*items: T\[\] \| undefined,\s*owners: Partial<Pick<EntityRecord, 'departmentId' \| 'userIdOwner'>>,?\s*\): T\[\] \| undefined/,
            );
            assert.match(parentService, /if \(!items\?\.length\) return items;/);
            assert.match(parentService, /owners\.departmentId === undefined/);
            assert.match(parentService, /owners\.userIdOwner === undefined/);
            assert.match(parentService, /owners\.userIdOwner === null/);
            assert.match(
              parentService,
              /throw\(500, 'Record scope owner values are unavailable'\)/,
            );
            assert.match(
              parentService,
              /items\.map\(item => \(\{\s*\.\.\.item,\s*departmentId: owners\.departmentId,\s*userIdOwner: owners\.userIdOwner,?\s*\}\)\)/,
            );
            const create = parentService.slice(
              parentService.indexOf('  async create('),
              parentService.indexOf('  async select('),
            );
            assert.match(create, /entrys: this\._prepareEntrysOwners\(record\.entrys, record\)/);
            assert.ok(create.indexOf('_prepareEntrysOwners(') < create.indexOf('.insert('));
            const update = parentService.slice(
              parentService.indexOf('  async update('),
              parentService.indexOf('  async delete('),
            );
            assert.match(
              update,
              /if \(record\.entrys\?\.length\) \{\s*const data = await this\.scope\.model\.record\.getById\(id\);\s*if \(!data\) return;/,
            );
            assert.match(update, /entrys: this\._prepareEntrysOwners\(record\.entrys, data\)/);
            assert.ok(update.indexOf('_prepareEntrysOwners(') < update.indexOf('.updateById('));
            assert.doesNotMatch(
              update,
              /ownerValues\(|_prepareEntrysOwners\(record\.entrys, record\)/,
            );
          } else {
            assert.doesNotMatch(parentService, /Owners|departmentId|userIdOwner/);
            assert.match(parentService, /insert\(record, \{ include: \{ entrys: true \} \}\)/);
          }
          for (const locale of ['en-us', 'zh-cn']) {
            const parentLocale = await read(parent.moduleRoot, `src/config/locale/${locale}.ts`);
            assert.ok(
              parentLocale.includes(
                `RecordUpdateDescription: 'Authored ${locale} parent contract'`,
              ),
            );
            assert.ok(
              !parentLocale.includes('// TODO(mcp-description): RecordUpdateDescription -'),
            );
            const source = await read(child.moduleRoot, `src/config/locale/${locale}.ts`);
            const values = (await import(`data:text/javascript,${encodeURIComponent(source)}`))
              .default;
            assert.equal(values.EntryUpdateDescription, `Authored ${locale} update contract`);
            assert.equal(values.EntryViewDescription, `Existing pending ${locale} view contract`);
            assert.equal(values.OtherCreateDescription, `Unrelated pending ${locale} contract`);
            assert.ok(source.includes('// TODO(mcp-description): EntryViewDescription -'));
            assert.ok(source.includes('// TODO(mcp-description): OtherCreateDescription -'));
            assert.equal(
              source.match(/TODO\(mcp-description\)/g)?.length,
              detailMode === 'aggregate' ? 2 : 8,
            );
            assert.equal(
              Object.hasOwn(values, 'EntryCreateDescription'),
              detailMode === 'standalone',
            );
          }
          const files = await filesUnder(child.moduleRoot);
          assert.ok(files.includes('src/entity/entry.tsx'));
          assert.ok(files.includes('src/model/entry.ts'));
          if (detailMode === 'aggregate') {
            assert.match(reminder, /test-entry:entry has no standalone MCP Actions/);
            assert.match(reminder, /earlier child CRUD description reminder does not apply/);
            for (const file of [
              'src/controller/entry.ts',
              'src/service/entry.ts',
              'src/lib/entryAnalysis.ts',
              'src/lib/entryQuery.ts',
              'test/entry.test.ts',
              'test/entryAnalysis.test.ts',
            ]) {
              assert.ok(!files.includes(file), file);
            }
            assert.ok(!files.some(file => file.startsWith('src/dto/')));
          } else {
            assert.match(reminder, /Review retained standalone MCP Actions for test-entry:entry/);
            assert.match(reminder, /recordId ownership context and bulk delete/);
            const controller = await read(child.moduleRoot, 'src/controller/entry.ts');
            assert.equal(controller, childController);
            for (const kind of ['create', 'update']) {
              const dto = await read(
                child.moduleRoot,
                `src/dto/entry${kind === 'create' ? 'Create' : 'Update'}.tsx`,
              );
              if (edition === 'start') {
                assert.match(dto, /columns: \['name', 'description', 'recordId'\]/);
                assert.doesNotMatch(dto, /departmentId|userIdOwner/);
              } else {
                assert.ok(dto.includes(`$Dto.${kind}(() => ModelEntry) {}`));
              }
            }
            assert.equal(controller.match(/@Mcp\.tool\(/g)?.length, 8);
            assert.match(controller, /EntryDeleteBulkDescription/);
            assert.ok(files.includes('src/dto/entryCreate.tsx'));
            assert.ok(files.includes('src/lib/entryQuery.ts'));
            assert.match(
              await read(child.moduleRoot, 'src/dto/entrySelectReq.tsx'),
              /query: entryQuery/,
            );
            assert.match(
              controller,
              /\$compileQuery\(this\.scope\.model\.entry, entryQuery, params/,
            );
            const service = await read(child.moduleRoot, 'src/service/entry.ts');
            assert.match(service, /async select\(params\?: IQueryParams<ModelEntry>\)/);
            assert.doesNotMatch(service, /\$compileQuery|entryQuery/);
            assert.doesNotMatch(await read(child.moduleRoot, 'src/lib/entryQuery.ts'), /recordId/);
          }
          const snapshot = await Promise.all(
            [parent.moduleRoot, child.moduleRoot].map(async moduleRoot =>
              Promise.all(
                (await filesUnder(moduleRoot)).map(async file => [
                  file,
                  await read(moduleRoot, file),
                ]),
              ),
            ),
          );
          await masterDetail.execute();
          assert.deepEqual(
            await Promise.all(
              [parent.moduleRoot, child.moduleRoot].map(async moduleRoot =>
                Promise.all(
                  (await filesUnder(moduleRoot)).map(async file => [
                    file,
                    await read(moduleRoot, file),
                  ]),
                ),
              ),
            ),
            snapshot,
            'rerunning master-detail must not duplicate ownership, FK, DTO, or relation patches',
          );
        }));
    }
  }

  it('preserves an ownerless legacy Start parent without inventing owner propagation', async () =>
    fixture(async root => {
      const parent = await makeCli(path.join(root, 'parent'), CliToolsCrudStart);
      await parent.cli.execute();
      const entityFile = path.join(parent.moduleRoot, 'src/entity/record.tsx');
      const entity = await fs.readFile(entityFile, 'utf8');
      await fs.writeFile(
        entityFile,
        entity.replace(
          /\n {2}@Api\.field\(ZovaRender\.visible\(false\), v\.(?:nullable|required)\(\), v\.tableIdentity\(\)\)\n {2}(?:departmentId: TableIdentity \| null|userIdOwner: TableIdentity);\n/g,
          '\n',
        ),
      );
      assert.doesNotMatch(
        await read(parent.moduleRoot, 'src/entity/record.tsx'),
        /departmentId|userIdOwner/,
      );
      for (const kind of ['create', 'update']) {
        const fileName = path.join(
          parent.moduleRoot,
          `src/dto/record${kind === 'create' ? 'Create' : 'Update'}.tsx`,
        );
        const dto = await fs.readFile(fileName, 'utf8');
        await fs.writeFile(
          fileName,
          dto.replace(
            /extends \$Dto\.(create|update)\(\(\) => ModelRecord, \{\s*columns: \['name', 'description'\],?\s*\}\)/,
            'extends $Dto.$1(() => ModelRecord)',
          ),
        );
      }
      const serviceFile = path.join(parent.moduleRoot, 'src/service/record.ts');
      await fs.writeFile(
        serviceFile,
        (await fs.readFile(serviceFile, 'utf8')).replace(
          " & Partial<Pick<EntityRecord, 'departmentId' | 'userIdOwner'>>",
          '',
        ),
      );
      const child = await makeCli(path.join(root, 'child'), CliToolsCrudStart);
      child.cli.context.argv.module = 'test-entry';
      child.cli.context.argv.resourceName = 'entry';
      child.cli.modulesMeta = { modules: { 'test-entry': { root: child.moduleRoot } } } as never;
      await child.cli.execute();
      execFileSync(path.join(packageRoot, '../../../node_modules/.bin/oxfmt'), [
        '--write',
        '--threads=1',
        '--config',
        path.join(packageRoot, '../../../oxfmt.config.ts'),
        path.join(child.moduleRoot, 'src/bean/meta.version.ts'),
      ]);
      await fs.writeFile(path.join(root, '__CABLOY_START__'), '');
      const masterDetail = new CliToolsMasterDetail({
        context: {
          argv: {
            _: [],
            projectPath: root,
            module: 'test-record',
            resourceName: 'record',
            detailModule: 'test-entry',
            detailResourceName: 'entry',
            detailMode: 'standalone',
          },
        },
      } as never);
      masterDetail.modulesMeta = {
        modules: {
          'test-record': { root: parent.moduleRoot },
          'test-entry': { root: child.moduleRoot },
        },
      } as never;
      masterDetail.__template = new SourceTemplate(masterDetail);
      masterDetail.helper.formatFile = async () => {};
      masterDetail.helper.invokeCli = async () => {};
      masterDetail.console.log = async () => {};
      await masterDetail.execute();
      const service = await read(parent.moduleRoot, 'src/service/record.ts');
      assert.doesNotMatch(service, /Owners|departmentId|userIdOwner/);
      assert.match(service, /insert\(record, \{ include: \{ entrys: true \} \}\)/);
      for (const kind of ['Create', 'Update']) {
        const dto = await read(parent.moduleRoot, `src/dto/record${kind}.tsx`);
        assert.match(dto, /include: \{ entrys: \{ dtoClass: DtoDetailEntryMutate \} \}/);
        assert.doesNotMatch(dto, /columns:|departmentId|userIdOwner/);
      }
    }));

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
