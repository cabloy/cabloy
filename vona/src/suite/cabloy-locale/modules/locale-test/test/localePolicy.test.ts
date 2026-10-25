import type { ConfigLocale } from 'vona';

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppLocale } from 'vona';

import { contextBase } from '../../../../../../packages-vona/vona-core/src/lib/core/context.ts';
import loadLocales from '../../../../../../packages-vona/vona-core/src/lib/module/locales.ts';
import { config as localeOptions } from '../../../../../suite-vendor/a-vona/modules/a-locale/src/config/config.ts';
import { Main } from '../../../../../suite-vendor/a-vona/modules/a-locale/src/main.ts';

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

function contextFixture(app: any, input: any = {}) {
  const cookieWrites: unknown[] = [];
  const ctx: any = Object.assign(Object.create(app.context), {
    app,
    request: { query: input.query ?? {}, headers: input.headers ?? {} },
    user: input.user,
    cookies: {
      get: () => input.cookie,
      set: (...args: unknown[]) => cookieWrites.push(args),
    },
    acceptsLanguages: () => input.languages ?? [],
    headerSent: false,
  });
  app.currentContext = ctx;
  return { ctx, cookieWrites };
}

async function installLocale(app: any, options = localeOptions(app)) {
  app.scope = () => ({ config: options });
  Object.defineProperty(
    app.context,
    'locale',
    Object.getOwnPropertyDescriptor(contextBase, 'locale')!,
  );
  await Object.assign(new Main(), { app }).moduleLoaded();
}

test('request negotiation and direct setter use root policy, preserve source order and explicit lookup', async () => {
  const app = appFixture();
  await loadLocales(app, {
    target: { info: {}, resource: { locales: { 'ja-jp': { Hello: 'Japanese explicit' } } } },
  } as any);
  const options = localeOptions(app);
  options.locale.localeAlias = { jp: 'ja-jp', zh: 'zh-cn' };
  options.locale.writeCookie = true;
  await installLocale(app, options);
  const queryField = options.locale.queryField!;
  const headerField = options.locale.headerField!;
  for (const input of [
    { query: { [queryField]: 'JA_JP' }, cookie: 'zh-cn' },
    { headers: { [headerField]: 'jp' }, cookie: 'zh-cn' },
    { cookie: 'ja-jp', user: { locale: 'zh-cn' } },
    { user: { locale: 'ja-jp' }, languages: ['zh-cn'] },
    { languages: 'ja-jp' },
    { query: { [queryField]: ['zh-cn'] } },
    { query: { [queryField]: 'constructor' } },
  ]) {
    const { ctx, cookieWrites } = contextFixture(app, input);
    assert.equal(ctx.locale, 'en-us');
    assert.equal(cookieWrites.length, 1);
    assert.equal((cookieWrites[0] as unknown[])[1], 'en-us');
    assert.equal(app.meta.text.locale('ja-jp', 'target::Hello'), 'Japanese explicit');
    assert.equal(ctx.locale, 'en-us');
  }
  for (const input of [
    { query: { [queryField]: 'ZH_CN' } },
    { headers: { [headerField]: 'ZH' } },
    { cookie: 'ZH_CN' },
    { user: { locale: 'ZH_CN' } },
    { languages: ['*', 'ja-jp', 'jp', 'ZH_CN', 'en-us'] },
  ]) {
    assert.equal(contextFixture(app, input).ctx.locale, 'zh-cn');
  }
  const { ctx } = contextFixture(app);
  ctx.locale = 'JA_JP';
  assert.equal(ctx.locale, 'en-us');
  app.meta.locale.current = 'zh-cn';
  assert.equal(ctx.locale, 'zh-cn');
  ctx.locale = 'ZH';
  assert.equal(ctx.locale, 'zh-cn');
  ctx.locale = 'toString';
  assert.equal(ctx.locale, 'en-us');
  options.locale.localeAlias = { 'chinese': 'zh-cn', 'zh-cn': 'en-us' };
  assert.equal(contextFixture(app, { languages: ['CHINESE'] }).ctx.locale, 'zh-cn');
  assert.equal(contextFixture(app, { query: { [queryField]: 'CHINESE' } }).ctx.locale, 'zh-cn');
  await assert.rejects(installLocale(appFixture({ items: {}, default: 'en-us' })), /at least one/);
});

test('enabled Japanese works with and without a provider and uses the root default', async () => {
  for (const withProvider of [false, true]) {
    const app = appFixture({
      items: { 'ja-jp': 'Japanese', 'en-us': 'English' },
      default: 'ja-jp',
    });
    await loadLocales(app, {
      target: { info: {}, resource: { locales: { 'en-us': { Hello: 'English fallback' } } } },
      ...(withProvider
        ? {
            provider: {
              info: { capabilities: { locale: true } },
              resource: {
                localesProvider: { 'ja-jp': { modules: { target: { Hello: 'Japanese' } } } },
              },
            },
          }
        : {}),
    } as any);
    await installLocale(app);
    const { ctx } = contextFixture(app);
    assert.equal(ctx.locale, 'ja-jp');
    assert.equal(app.meta.text('target::Hello'), withProvider ? 'Japanese' : 'English fallback');
    ctx.locale = 'JA_JP';
    assert.equal(ctx.locale, 'ja-jp');
    app.currentContext = undefined;
    assert.equal(app.meta.locale.current, 'ja-jp');
  }
});
