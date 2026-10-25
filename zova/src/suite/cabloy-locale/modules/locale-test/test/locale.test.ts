import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { BeanContainer } from '../../../../../../packages-zova/zova-core/src/bean/beanContainer.ts';
import { BeanScopeLocale } from '../../../../../../packages-zova/zova-core/src/bean/resource/locale/beanScopeLocale.ts';
import { AppLocale } from '../../../../../../packages-zova/zova-core/src/core/component/locale.ts';
import { SysLocale } from '../../../../../../packages-zova/zova-core/src/core/sys/locale.ts';
import { SysModule } from '../../../../../../packages-zova/zova-core/src/core/sys/module.ts';
import { ZovaSys } from '../../../../../../packages-zova/zova-core/src/core/sys/sys.ts';
import { MonkeySys as BeanMonkeySys } from '../../../../../suite-vendor/a-zova/modules/a-bean/src/monkeySys.ts';
import demoEnglish from '../../../../a-demo/modules/demo-basic/src/config/locale/en-us.ts';
import demoChinese from '../../../../a-demo/modules/demo-basic/src/config/locale/zh-cn.ts';
import japanese from '../../locale-jajp/src/locales/ja-jp.ts';

function setServer(t: any, server: boolean) {
  const env = process.env as unknown as Record<string, string | undefined>;
  const previous = env.SERVER;
  if (server) env.SERVER = 'true';
  else delete env.SERVER;
  t.after(() => {
    if (previous === undefined) delete env.SERVER;
    else env.SERVER = previous;
  });
}

function createRuntime() {
  const sys: any = {
    config: {
      locale: {
        default: 'en-us',
        storeKey: 'locale',
        items: { 'en-us': 'English', 'zh-cn': 'Chinese' },
      },
      modules: {},
    },
    configOriginal: { modules: {} },
    constant: { modules: {} },
    meta: { error: { errors: {} }, logger: { child: () => ({ debug() {} }) } },
  };
  const container = BeanContainer.create(sys, undefined!, null);
  // Scope creation is outside these resource-loader fixtures; all other runtime paths are real.
  sys.bean = {
    _newBeanSimple: container._newBeanSimple.bind(container),
    _getBean: async () => undefined,
  };
  sys.meta.locale = Object.assign(new SysLocale(), { sys });
  sys.meta.module = Object.assign(new SysModule(), { sys });
  return sys;
}

function createAppLocale(sys: any, cookie?: unknown) {
  const values = new Map<string, unknown>([['locale', cookie]]);
  const app: any = {
    meta: {
      cookie: {
        getItem: (key: string) => values.get(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    },
  };
  const locale = Object.assign(new AppLocale(), { sys, app });
  app.meta.locale = locale;
  return { locale, values };
}

for (const server of [false, true]) {
  test(`provider resources precede real a-bean preload, client lazy demo remains lazy (server=${server})`, async t => {
    setServer(t, server);
    const sys = createRuntime();
    const registry: SysLocale = sys.meta.locale;
    const loader: SysModule = sys.meta.module;
    const beanManifest = JSON.parse(
      await readFile(
        new URL('../../../../../suite-vendor/a-zova/modules/a-bean/package.json', import.meta.url),
        'utf8',
      ),
    );
    const demoManifest = JSON.parse(
      await readFile(
        new URL('../../../../a-demo/modules/demo-basic/package.json', import.meta.url),
        'utf8',
      ),
    );
    assert.equal(beanManifest.zovaModule.capabilities.preload, true);
    assert.equal(demoManifest.zovaModule?.capabilities?.preload, undefined);
    assert.equal(demoManifest.zovaModule?.capabilities?.sync, undefined);
    let demoImports = 0;
    let providerInstalls = 0;
    let preloadReads = 0;
    const firstProvider = {
      ...japanese,
      modules: {
        ...japanese.modules,
        'home-base': {
          ...japanese.modules['home-base'],
          Collision: 'provider',
          ProviderOnly: 'provider only',
          HelloWorld: 'home target only',
        },
        'missing-target': { AbsentUnique: 'must not leak' },
      },
      GlobalOnly: 'global provider',
    };
    const modules: any = {
      'a-bean': {
        info: { relativeName: 'a-bean', capabilities: beanManifest.zovaModule.capabilities },
        resource: async () => ({ MonkeySys: BeanMonkeySys }),
      },
      'home-base': {
        info: { relativeName: 'home-base' },
        resource: async () => ({
          locales: {
            'ja-jp': { Collision: 'ordinary', ProviderOnly: 'ordinary' },
            'en-us': { EnglishOnly: 'English fallback' },
          },
        }),
      },
      'demo-basic': {
        info: { relativeName: 'demo-basic', capabilities: demoManifest.zovaModule?.capabilities },
        resource: async () => {
          demoImports++;
          return { locales: { 'en-us': demoEnglish, 'zh-cn': demoChinese } };
        },
      },
      'locale-jajp': {
        info: { relativeName: 'locale-jajp', capabilities: { locale: true } },
        resource: async () => ({ localesProvider: { 'ja-jp': firstProvider } }),
      },
      'locale-second': {
        info: { relativeName: 'locale-second', capabilities: { locale: true, sync: true } },
        resource: async () => ({
          localesProvider: {
            'ja-jp': { modules: { 'home-base': { ProviderOnly: 'second loses' } } },
          },
        }),
      },
    };
    sys.meta.sysMonkey = {
      moduleLoading(module: any) {
        if (module.info.relativeName === 'locale-jajp') providerInstalls++;
        if (module.info.relativeName === 'a-bean') {
          preloadReads++;
          // New test instrumentation at the real preload installation boundary, not an existing text reader.
          assert.equal(
            registry.getText(false, 'demo-basic', 'ja-jp' as any, 'HelloWorld'),
            japanese.modules['demo-basic'].HelloWorld,
          );
          assert.equal(loader.get('demo-basic'), undefined);
          // SSR imports all resources by existing policy; client must not import this target.
          assert.equal(demoImports, server ? 1 : 0);
        }
      },
    };
    await registry.initialize({
      'ja-jp': { modules: { 'home-base': { Collision: 'project' } } },
    } as any);
    await loader.initialize({ moduleNames: Object.keys(modules), modules } as any);
    assert.equal(preloadReads, 1);
    assert.equal(providerInstalls, 1);
    assert.equal(loader.get('demo-basic') !== undefined, server);
    assert.equal(registry.getText(false, 'home-base', 'ja-jp' as any, 'Collision'), 'project');
    assert.equal(
      registry.getText(false, 'home-base', 'ja-jp' as any, 'ProviderOnly'),
      'provider only',
    );
    const globalLocales = registry.locales['ja-jp'] as Record<string, unknown>;
    assert.equal(globalLocales.modules, undefined);
    assert.equal(globalLocales.AbsentUnique, undefined);
    assert.equal(registry.localeModules['missing-target'], undefined);
    assert.equal(registry.localeModules['locale-jajp'], undefined);
    await loader.use('home-base');
    await loader.use('demo-basic');
    const { locale: appLocale } = createAppLocale(sys, 'en-us');
    const demoScope = Object.assign(new BeanScopeLocale('demo-basic'), {
      sys,
      app: (appLocale as any).app,
    });
    const homeScope = Object.assign(new BeanScopeLocale('home-base'), {
      sys,
      app: (appLocale as any).app,
    });
    const demoHello = (demoScope as any).__get__('HelloWorld');
    const homeHello = (homeScope as any).__get__('HelloWorld');
    assert.equal(demoHello.locale('ja-jp'), japanese.modules['demo-basic'].HelloWorld);
    assert.equal(homeHello.locale('ja-jp'), 'home target only');
    assert.equal(demoHello(), demoEnglish.HelloWorld);
    assert.equal((demoScope as any).__get__('HelloWorld'), demoHello);
    assert.equal(
      registry.getText(false, undefined, 'ja-jp' as any, 'demo-basic::HelloWorld'),
      japanese.modules['demo-basic'].HelloWorld,
    );
    assert.equal(
      registry.getText(false, 'demo-basic', 'en-us', 'HelloWorld'),
      demoEnglish.HelloWorld,
    );
    assert.equal(
      registry.getText(false, 'demo-basic', 'zh-cn', 'HelloWorld'),
      demoChinese.HelloWorld,
    );
    assert.equal(
      registry.getText(false, 'home-base', 'ja-jp' as any, 'EnglishOnly'),
      'English fallback',
    );
    assert.equal(
      registry.getText(false, 'home-base', 'ja-jp' as any, 'UnknownUnique'),
      'UnknownUnique',
    );
    assert.equal(sys.config.locale.default, 'en-us');
    assert.deepEqual(Object.keys(sys.config.locale.items), ['en-us', 'zh-cn']);
    assert.equal(japanese.modules['missing-target'], undefined);
  });
}

test('active locale policy normalizes cookies, preferences/setters and route-menu subsets, but not explicit lookup', t => {
  setServer(t, false);
  const sys = createRuntime();
  const { locale, values } = createAppLocale(sys, 'JA_JP');
  sys.meta.locale._registerLocales('demo-basic', {
    'ja-jp': { HelloWorld: 'Japanese available but disabled' },
  });
  assert.equal(locale.current, 'en-us');
  locale.current = 'JA_JP' as any; // same setter used by saved preferences and SSR route inputs
  assert.equal(locale.current, 'en-us');
  assert.equal(values.get('locale'), 'en-us');
  locale.current = 'ZH_CN' as any;
  assert.equal(locale.current, 'zh-cn');
  assert.equal(values.get('locale'), 'zh-cn');
  for (const value of ['unknown', 'constructor', 'toString', '__proto__', ['zh-cn'], {}]) {
    locale.current = value as any;
    assert.equal(locale.current, 'en-us');
  }
  assert.equal(
    locale.getText(false, 'demo-basic', 'ja-jp' as any, 'HelloWorld'),
    'Japanese available but disabled',
  );
  assert.deepEqual(
    locale.getItems({ 'zh-cn': 'Route Chinese', 'ja-jp': 'Route Japanese' } as any),
    { 'zh-cn': 'Route Chinese' },
  );
  sys.config.locale = {
    ...sys.config.locale,
    default: 'ja-jp',
    items: { 'ja-jp': 'Japanese', 'en-us': 'English' },
  };
  const first = createAppLocale(sys, 'JA_JP');
  const second = createAppLocale(sys, 'en-us');
  assert.equal(first.locale.current, 'ja-jp');
  assert.equal(second.locale.current, 'en-us');
  first.locale.current = 'disabled' as any;
  assert.equal(first.locale.current, 'ja-jp');
  assert.equal(second.locale.current, 'en-us');
  // A locale without any resource remains enabled; dictionaries do not own policy.
  sys.config.locale = { ...sys.config.locale, default: 'zh-tw', items: { 'zh-tw': 'Taiwan' } };
  assert.equal(locale.normalize('ZH_TW'), 'zh-tw');
});

test('config layers replace only the enabled locale set and reject invalid policy', async () => {
  const sys = new ZovaSys();
  sys.env = {} as any;
  const base = () => ({
    locale: {
      default: 'en-us',
      storeKey: 'locale',
      items: { 'en-us': 'English', 'zh-cn': 'Chinese' },
    },
  });
  const config = await (sys as any)._combineConfig([
    base,
    () => ({ locale: { default: 'ja-jp', items: { 'ja-jp': 'Japanese' } } }),
  ]);
  assert.deepEqual(config.locale, {
    default: 'ja-jp',
    storeKey: 'locale',
    items: { 'ja-jp': 'Japanese' },
  });
  await assert.rejects(
    (sys as any)._combineConfig([base, () => ({ locale: { items: {} } })]),
    /at least one enabled locale/,
  );
  await assert.rejects(
    (sys as any)._combineConfig([base, () => ({ locale: { default: 'ja-jp' } })]),
    /enabled own key/,
  );
  const { locale } = createAppLocale(createRuntime());
  (locale as any).sys.config.locale.items = Object.create({ 'en-us': 'Inherited' });
  assert.throws(() => locale.current, /at least one enabled locale/);
});
