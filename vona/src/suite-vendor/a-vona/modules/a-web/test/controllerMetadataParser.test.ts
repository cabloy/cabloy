import gogocode from 'gogocode';
import assert from 'node:assert/strict';
import { test } from 'node:test';

import generate from '../cli/controller/metadata/generate.ts';

async function routes(controller: string, methods: string, extra = '') {
  const content = await generate({
    cli: { helper: { gogocode } },
    sceneName: 'controller',
    moduleName: 'test-parser',
    globFiles: [
      {
        className: 'ControllerExample',
        beanName: 'example',
        fileNameJSRelative: '../controller/example.ts',
        fileContent: `${extra}
${controller}
export class ControllerExample extends BeanBase {
${methods}
}`,
      },
    ],
  } as never);
  return Object.fromEntries(
    Array.from(content.matchAll(/export interface IApiPath(\w+)Record\{([\s\S]*?)\}/g), match => [
      match[1],
      Array.from(match[2].matchAll(/'([^']+)': undefined;/g), entry => entry[1]),
    ]),
  );
}

test('options-only Web get/post decorators produce root action routes', async () => {
  assert.deepEqual(
    await routes(
      "@Controller<IControllerOptions>('trainingRecord')",
      `@Web.get({ summary: 'List records (current)', meta: { label: makeLabel('list') } })
      async list() {}
      @Web.post({ summary: 'Create record', meta: { nested: { enabled: true } } })
      async create() {}`,
    ),
    {
      Get: ['/test/parser/trainingRecord'],
      Post: ['/test/parser/trainingRecord'],
    },
  );
});

test('object Controller path survives nested metadata and following Api.exclude', async () => {
  for (const typeArguments of ['', '<IControllerOptions>']) {
    assert.deepEqual(
      await routes(
        `@Controller${typeArguments}({
          meta: { path: 'notTheControllerPath', guard: makeGuard({ enabled: true }) },
          path: 'passportTest',
        })
        @Api.exclude()`,
        `@Web.get({ summary: 'Passport test (root)' })
        async read() {}
        @Web.post('login', { summary: 'Login' })
        async login() {}`,
      ),
      {
        Get: ['/test/parser/passportTest'],
        Post: ['/test/parser/passportTest/login'],
      },
    );
  }
});

test('string paths and all existing action verbs remain supported', async () => {
  assert.deepEqual(
    await routes(
      '@Controller<IControllerOptions>("records", { meta: { nested: true } })',
      `@Web.get('items/:id', { summary: 'Read (one)' })
      read() {}
      @Web.post( 'items' )
      create() {}
      @Web.put("items/:id")
      replace() {}
      @Web.patch('/absolute/:id')
      update() {}
      @Web.delete('//external/:id')
      remove() {}`,
    ),
    {
      Get: ['/test/parser/records/items/:id'],
      Post: ['/test/parser/records/items'],
      Put: ['/test/parser/records/items/:id'],
      Patch: ['/absolute/:id'],
      Delete: ['//external/:id'],
    },
  );
});

test('no-path Controller and Web decorators preserve root routes', async () => {
  for (const controller of [
    '@Controller()',
    '@Controller<IControllerOptions>()',
    "@Controller({ meta: { path: 'nestedOnly' } })",
    "@Controller<IControllerOptions>({ meta: { path: 'nestedOnly' } })",
    "@Controller('')",
  ]) {
    assert.deepEqual(
      await routes(controller, '@Web.get()\nread() {}\n@Web.post()\ncreate() {}'),
      { Get: ['/test/parser'], Post: ['/test/parser'] },
      controller,
    );
  }
});

test('RegExp and dynamic action routes stay excluded, without evaluating expressions', async () => {
  assert.deepEqual(
    await routes(
      "@Controller('records')",
      `@Web.get(/items\\/(.*)/)
      regex() {}
      @Web.post(new RegExp('items'))
      regexConstructor() {}
      @Web.put(dynamicPath)
      identifier() {}
      @Web.patch(resolvePath())
      expression() {}
      @Web.delete(\`items/\${id}\`)
      template() {}
      @Web.get('kept')
      kept() {}`,
    ),
    { Get: ['/test/parser/records/kept'] },
  );
  for (const controller of [
    '@Controller(dynamicPath)',
    '@Controller({ path: resolvePath() })',
    '@Controller({ path: /items/ })',
    "@Controller({ path: 'records', ...dynamicOptions })",
  ]) {
    assert.deepEqual(await routes(controller, '@Web.get()\nread() {}'), {}, controller);
  }
});

test('only real decorators on the owning controller contribute routes', async () => {
  assert.deepEqual(
    await routes(
      "@Controller({ 'path': 'records' })",
      `// @Web.get('comment')
      @Web.get('kept')
      kept() { return "@Web.post('string')"; }`,
      `@Controller('unrelated')
      class ControllerOther {
        @Web.get('other')
        other() {}
      }`,
    ),
    { Get: ['/test/parser/records/kept'] },
  );
});
