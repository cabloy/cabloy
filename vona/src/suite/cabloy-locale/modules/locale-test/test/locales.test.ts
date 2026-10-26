import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import type { ConfigLocale } from '../../../../../../packages-vona/vona-core/src/types/config/locale.ts';

import { AppLocale } from '../../../../../../packages-vona/vona-core/src/lib/bean/resource/locale/appLocale.ts';
import {
  resolveLocale,
  validateLocaleConfig,
} from '../../../../../../packages-vona/vona-core/src/lib/bean/resource/locale/utils.ts';
import defaults from '../../../../../../packages-vona/vona-core/src/lib/core/locales.ts';
import { Start } from '../../../../../../packages-vona/vona-core/src/lib/framework/start.ts';
import loadLocales from '../../../../../../packages-vona/vona-core/src/lib/module/locales.ts';
import testEnglish from '../../../../../suite-vendor/a-test/modules/test-vona/src/config/locale/en-us.ts';
import testChinese from '../../../../../suite-vendor/a-test/modules/test-vona/src/config/locale/zh-cn.ts';
import { ServiceHmr } from '../../../../../suite-vendor/a-vona/modules/a-hmr/src/service/hmr.ts';
import { localesProvider as japanese } from '../../locale-jajp/src/locales/index.ts';
import { localesProvider as traditional } from '../../locale-zhtw/src/locales/index.ts';

function module(locales: object, provider = false) {
  return {
    info: { capabilities: { locale: provider } },
    resource: provider ? { localesProvider: locales } : { locales },
  };
}

function appFixture(
  policy: ConfigLocale = { items: { 'en-us': 'English', 'zh-cn': 'Chinese' }, default: 'en-us' },
) {
  const app: any = {
    config: { locale: policy },
    meta: {},
    options: { locales: async () => ({ localesDefault: {}, localesModules: {} }) },
    context: {},
  };
  const locale = Object.assign(new AppLocale(), { app });
  app.meta.locale = locale;
  app.meta.text = locale.createLocaleText();
  return app;
}

const deliveredPacks = [
  {
    name: 'locale-jajp',
    locale: 'ja-jp',
    resource: japanese,
    dictionary: japanese['ja-jp'],
    hello: 'こんにちは、世界',
    notFound: '見つかりません',
  },
  {
    name: 'locale-zhtw',
    locale: 'zh-tw',
    resource: traditional,
    dictionary: traditional['zh-tw'],
    hello: '您好，世界',
    notFound: '找不到資源',
  },
] as const;

for (const installed of [[], [deliveredPacks[0]], [deliveredPacks[1]], deliveredPacks]) {
  const names = installed.map(pack => pack.name).join('+') || 'none';
  test(`delivered packs load through the real locale loader (${names})`, async () => {
    const app = appFixture();
    const policyBefore = structuredClone(app.config.locale);
    const modules: any = {
      'test-vona': module({ 'en-us': testEnglish, 'zh-cn': testChinese }),
      'home-base': module({}),
    };
    for (const pack of installed) {
      const manifest = JSON.parse(
        await readFile(new URL(`../../${pack.name}/package.json`, import.meta.url), 'utf8'),
      );
      modules[pack.name] = {
        info: { capabilities: manifest.vonaModule.capabilities },
        resource: { localesProvider: pack.resource },
      };
    }
    await loadLocales(app, modules);
    const hello = app.meta.locale.createScopeLocaleText('test-vona', 'TestHelloWorld');
    for (const pack of deliveredPacks) {
      const present = installed.some(item => item.name === pack.name);
      assert.equal(hello.locale(pack.locale), present ? pack.hello : testEnglish.TestHelloWorld);
      assert.equal(
        app.meta.text.locale(pack.locale, 'test-vona::TestHelloWorld'),
        present ? pack.hello : testEnglish.TestHelloWorld,
      );
      assert.equal(
        app.meta.text.locale(pack.locale, '404'),
        present ? pack.notFound : defaults['en-us']['404'],
      );
      assert.equal(Object.hasOwn(app.meta.locales, pack.locale), present);
      if (present) {
        assert.equal(
          app.meta.locale.createScopeLocaleText('home-base', 'SiteAll').locale(pack.locale),
          pack.dictionary.modules['home-base'].SiteAll,
        );
        assert.equal(Object.hasOwn(app.meta.locales[pack.locale], 'modules'), false);
        assert.equal(app.meta.locales[pack.locale].ProductTitle, undefined);
      }
      assert.equal(app.meta.localeModules[pack.name], undefined);
      assert.equal(resolveLocale(pack.locale, app.config.locale), 'en-us');
    }
    // A real translated target is absent: its dictionary must not leak into global fallbacks.
    assert.equal(app.meta.localeModules['commerce-catalog'], undefined);
    assert.equal(hello(), testEnglish.TestHelloWorld);
    assert.equal(hello.locale('zh-cn'), testChinese.TestHelloWorld);
    for (const locale of ['en-us', 'zh-cn'] as const) {
      assert.equal(app.meta.text.locale(locale, '404'), defaults[locale]['404']);
    }
    assert.equal(app.meta.locale.current, 'en-us');
    assert.deepEqual(app.config.locale, policyBefore);
  });
}

test('provider registration is target-scoped, metadata-filtered and ordered before ordinary defaults', async () => {
  const providerResource = Object.freeze({
    'ja-jp': Object.freeze({
      GlobalOnly: 'provider global',
      Shared: 'provider global collision',
      ignoredObject: Object.freeze({ not: 'text' }),
      ignoredNumber: 42,
      modules: Object.freeze({
        'target-one': Object.freeze({
          Shared: 'provider one',
          ProviderWins: 'first provider',
          ProjectWins: 'provider loses',
        }),
        'target-two': Object.freeze({ Shared: 'provider two' }),
        'absent-target': Object.freeze({ AbsentPollution: 'must not register' }),
      }),
    }),
  });
  const modules: any = {
    'target-one': module({
      'ja-jp': {
        Shared: 'ordinary one',
        ProjectWins: 'ordinary loses',
        ProviderWins: 'ordinary loses',
        OrdinaryOnly: 'ordinary',
      },
      'en-us': { EnglishFallback: 'English fallback' },
      'zh-cn': { SimplifiedOnly: 'not a Traditional fallback' },
    }),
    'provider-first': module(providerResource, true),
    'target-two': module({ 'ja-jp': { Shared: 'ordinary two' } }),
    'provider-second': module(
      {
        'ja-jp': {
          GlobalOnly: 'late global',
          modules: { 'target-one': { ProviderWins: 'late provider' } },
        },
      },
      true,
    ),
    'ordinary-envelope': module({ 'ja-jp': { modules: 'ordinary literal message' } }),
  };
  const before = structuredClone(modules);
  const coreBefore = structuredClone(defaults);
  const app = appFixture();
  app.options.locales = async () => ({
    localesDefault: { 'ja-jp': { GlobalOnly: 'project global' } },
    localesModules: {
      'ja-jp': {
        modules: {
          'target-one': { ProjectWins: 'project wins' },
          'project-absent': { ProjectAbsent: 'existing project behavior' },
        },
      },
    },
  });
  await loadLocales(app, modules);
  const text = app.meta.text;
  assert.equal(text.locale('ja-jp', 'target-one::ProjectWins'), 'project wins');
  assert.equal(text.locale('ja-jp', 'target-one::ProviderWins'), 'first provider');
  assert.equal(text.locale('ja-jp', 'target-one::Shared'), 'provider one');
  assert.equal(text.locale('ja-jp', 'target-two::Shared'), 'provider two');
  assert.equal(text.locale('ja-jp', 'Shared'), 'provider global collision');
  assert.equal(text.locale('ja-jp', 'GlobalOnly'), 'project global');
  assert.equal(text.locale('ja-jp', 'target-one::OrdinaryOnly'), 'ordinary');
  assert.equal(text.locale('ja-jp', 'target-one::EnglishFallback'), 'English fallback');
  assert.equal(text.locale('ja-jp', 'target-one::GenuinelyUnknown'), 'GenuinelyUnknown');
  assert.equal(text.locale('zh-tw', 'target-one::SimplifiedOnly'), 'SimplifiedOnly');
  assert.equal(app.meta.localeModules['absent-target'], undefined);
  assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'AbsentPollution'), false);
  assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'ignoredObject'), false);
  assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'ignoredNumber'), false);
  assert.equal(app.meta.localeModules['provider-first'], undefined);
  assert.equal(
    app.meta.localeModules['ordinary-envelope']['ja-jp'].modules,
    'ordinary literal message',
  );
  assert.equal(
    app.meta.localeModules['project-absent']['ja-jp'].ProjectAbsent,
    'existing project behavior',
  );
  assert.equal(
    app.meta.hmrCacheLocaleModules['target-one']['ja-jp'].ProviderWins,
    'first provider',
  );
  assert.equal(app.meta.hmrCacheLocaleModules['target-one']['ja-jp'].OrdinaryOnly, undefined);
  assert.deepEqual(modules, before);
  assert.deepEqual(defaults, coreBefore);

  const secondApp = appFixture();
  await loadLocales(secondApp, {});
  assert.equal(Object.hasOwn(secondApp.meta.locales, 'ja-jp'), false);
  assert.notEqual(secondApp.meta.locales['en-us'], app.meta.locales['en-us']);
});

test('ordinary locale service reload restarts to preserve clean-start scoped and global precedence', async () => {
  const dictionaries = [
    Object.freeze({
      OrdinaryOnly: 'before',
      Collision: 'first before',
      RemovedOnly: 'removed on reload',
      ProviderWins: 'ordinary before',
      ProjectWins: 'ordinary before',
    }),
    Object.freeze({
      OrdinaryOnly: 'after',
      Collision: 'first after',
      RemovedOnly: 'removed on reload',
      ProviderWins: 'ordinary after',
      ProjectWins: 'ordinary after',
    }),
    Object.freeze({ OrdinaryOnly: 'after deletion' }),
  ];
  const provider = Object.freeze({
    'ja-jp': Object.freeze({
      modules: Object.freeze({
        'target-one': Object.freeze({ ProviderWins: 'provider', ProjectWins: 'provider loses' }),
      }),
    }),
  });
  const project = Object.freeze({
    localesDefault: Object.freeze({ 'ja-jp': Object.freeze({ ProjectGlobal: 'project global' }) }),
    localesModules: Object.freeze({
      'ja-jp': Object.freeze({
        modules: Object.freeze({ 'target-one': Object.freeze({ ProjectWins: 'project' }) }),
      }),
    }),
  });
  const second = Object.freeze({ Collision: 'second ordinary' });
  const modulesFor = (dictionary: object) => ({
    'target-one': module({ 'ja-jp': dictionary }),
    'provider': module(provider, true),
    'target-two': module({ 'ja-jp': second }),
  });
  const start = async (dictionary: object) => {
    const app = appFixture();
    app.options.locales = async () => project;
    await loadLocales(app, modulesFor(dictionary) as any);
    return app;
  };
  let app = await start(dictionaries[0]);
  assert.equal(app.meta.text.locale('ja-jp', 'OrdinaryOnly'), 'before');
  assert.equal(app.meta.text.locale('ja-jp', 'Collision'), 'first before');
  assert.equal(app.meta.text.locale('ja-jp', 'RemovedOnly'), 'removed on reload');

  for (const [index, dictionary] of dictionaries.entries()) {
    if (index === 0) continue;
    const before = structuredClone([
      app.meta.locales,
      app.meta.localeModules,
      app.meta.hmrCacheLocaleModules,
    ]);
    const restart = new Error('test-owned worker restart');
    let reloads = 0;
    let cacheClears = 0;
    app.bean = {
      worker: {
        reload: () => {
          reloads++;
          throw restart;
        },
      },
      openapi: {
        clearAllCaches: async () => {
          cacheClears++;
        },
      },
    };
    const service: any = new ServiceHmr();
    Object.defineProperty(service, 'app', { value: app });
    await assert.rejects(service._reloadLocale(), error => error === restart);
    assert.equal(reloads, 1);
    assert.equal(cacheClears, 0);
    assert.deepEqual(
      [app.meta.locales, app.meta.localeModules, app.meta.hmrCacheLocaleModules],
      before,
    );

    // Emulate the signalled worker's fresh registration, not a merge into stale globals.
    app = await start(dictionary);
    const text = (key: string) => app.meta.text.locale('ja-jp', key);
    assert.equal(text('target-one::OrdinaryOnly'), dictionary.OrdinaryOnly);
    assert.equal(text('OrdinaryOnly'), dictionary.OrdinaryOnly);
    assert.equal(text('target-one::ProjectWins'), 'project');
    assert.equal(text('target-one::ProviderWins'), 'provider');
    assert.equal(text('ProjectGlobal'), 'project global');
    assert.equal(text('Collision'), index === 1 ? 'first after' : 'second ordinary');
    assert.equal(text('target-two::Collision'), 'second ordinary');
    assert.equal(text('RemovedOnly'), index === 1 ? 'removed on reload' : 'RemovedOnly');
    assert.equal(
      text('target-one::RemovedOnly'),
      index === 1 ? 'removed on reload' : 'RemovedOnly',
    );
    assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'modules'), false);
    assert.equal(app.meta.localeModules.provider, undefined);
  }
});

test('provider modules envelope never becomes global text', async () => {
  const app = appFixture();
  await loadLocales(app, {
    'target-one': module({}),
    'provider': module({ 'ja-jp': { modules: { 'target-one': { Hello: 'Japanese' } } } }, true),
  } as any);
  assert.equal(Object.hasOwn(app.meta.locales['ja-jp'], 'modules'), false);
  assert.equal(app.meta.text.locale('ja-jp', 'target-one::Hello'), 'Japanese');
});

test('active locale policy validates own enabled items independently of dictionary availability', async () => {
  const policy = {
    items: { 'en-us': 'English', 'ja-jp': 'Japanese' },
    default: 'ja-jp',
  } as ConfigLocale;
  validateLocaleConfig(policy);
  assert.equal(resolveLocale('EN_US', policy), 'en-us');
  assert.equal(resolveLocale('JA_JP', policy), 'ja-jp');
  assert.equal(resolveLocale('JP', policy, { jp: 'JA_JP' }), 'ja-jp');
  assert.equal(resolveLocale('zh', policy, { zh: 'zh-cn' }), 'ja-jp');
  assert.equal(resolveLocale('toString', policy), 'ja-jp');
  assert.equal(resolveLocale('unknown', policy), 'ja-jp');
  assert.equal(resolveLocale(['en-us'], policy), 'ja-jp');
  const inherited = Object.create({ 'zh-cn': 'inherited disabled' });
  inherited['en-us'] = 'English';
  assert.equal(resolveLocale('ZH_CN', { items: inherited, default: 'en-us' }), 'en-us');
  assert.equal(resolveLocale('jp', policy, Object.create({ jp: 'en-us' })), 'ja-jp');
  assert.throws(() => validateLocaleConfig({ items: {}, default: 'en-us' }), /at least one/);
  assert.throws(
    () => validateLocaleConfig({ items: { 'en-us': 'English' }, default: 'zh-cn' }),
    /must be an enabled/,
  );
  assert.throws(
    () => validateLocaleConfig({ items: { EN_US: 'English' }, default: 'EN_US' } as any),
    /invalid locale/,
  );
  assert.throws(
    () => validateLocaleConfig({ items: Object.create({ 'en-us': 'English' }), default: 'en-us' }),
    /at least one/,
  );
  const app = appFixture(policy);
  await loadLocales(app, { target: module({ 'en-us': { Hello: 'English fallback' } }) } as any);
  assert.equal(app.meta.text('target::Hello'), 'English fallback');
  assert.equal(app.meta.locale.current, 'ja-jp');
});

test('root config layers replace explicit locale.items subsets, retaining the sole default', async () => {
  const first = { items: { 'en-us': 'English', 'zh-cn': 'Chinese' }, default: 'en-us' };
  const configItems: (() => any)[] = [
    () => ({ locale: first, server: { keys: [], subdomainOffset: 2 }, proxy: { enable: false } }),
    () => ({ locale: { items: { 'ja-jp': 'Japanese' }, default: 'ja-jp' } }),
  ];
  // Startup validates the managed run identity even for this in-memory config fixture.
  const runtime = process.env.VONA_TEST_RUN_ID ? (await import('vona-mock')).app : undefined;
  const runtimeConfigItems = runtime
    ? (await runtime.options.config()).default.map(config => () => config(runtime))
    : [];
  const app: any = {
    name: runtime?.name,
    projectPath: runtime?.projectPath,
    meta: { env: runtime?.meta.env ?? { META_MODE: 'prod' } },
    options: { config: async () => ({ default: [...runtimeConfigItems, ...configItems] }) },
  };
  await new Start(app)._start_appConfig();
  assert.deepEqual(app.config.locale, { items: { 'ja-jp': 'Japanese' }, default: 'ja-jp' });
  validateLocaleConfig(app.config.locale);
  assert.deepEqual(first.items, { 'en-us': 'English', 'zh-cn': 'Chinese' });
  configItems.push(() => ({ locale: { items: {}, default: 'ja-jp' } }));
  await new Start(app)._start_appConfig();
  assert.deepEqual(app.config.locale.items, {});
  assert.throws(() => validateLocaleConfig(app.config.locale), /at least one/);
});
