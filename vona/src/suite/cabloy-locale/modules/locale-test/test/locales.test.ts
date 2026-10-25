import assert from 'node:assert/strict';
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
