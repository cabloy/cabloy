import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
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

function createReloadOptions(stage: number, viteHot = new EventEmitter()) {
  const { 'demo-basic': demoProvider, ...remainingTargets } = japanese.modules;
  const modules = {
    'a-bean': {
      info: { relativeName: 'a-bean', capabilities: { preload: true, monkey: true } },
      resource: async () => ({ MonkeySys: BeanMonkeySys }),
    },
    'home-base': {
      info: { relativeName: 'home-base' },
      resource: async () => ({
        locales: {
          'ja-jp': {
            LifecycleProject: `ordinary ${stage}`,
            LifecycleProvider: `ordinary ${stage}`,
            LifecycleRemoved: `ordinary ${stage}`,
          },
          'en-us': { LifecycleEnglish: 'English fallback' },
        },
      }),
    },
    'demo-basic': {
      info: { relativeName: 'demo-basic' },
      resource: async () => ({ locales: { 'en-us': demoEnglish, 'zh-cn': demoChinese } }),
    },
    'locale-jajp': {
      info: { relativeName: 'locale-jajp', capabilities: { locale: true } },
      resource: async () => ({
        localesProvider: {
          'ja-jp': {
            ...(stage < 3 ? { LifecycleGlobalRemoved: 'global provider' } : {}),
            modules: {
              ...remainingTargets,
              'home-base': {
                ...japanese.modules['home-base'],
                LifecycleProject: 'provider loses to project',
                LifecycleProvider: stage < 2 ? 'provider initial' : 'provider changed',
                ...(stage < 3 ? { LifecycleRemoved: 'provider removed later' } : {}),
              },
              ...(stage < 4
                ? { 'demo-basic': { ...demoProvider, LifecycleTargetOnly: 'provider target' } }
                : {}),
            },
          },
        },
      }),
    },
    'locale-second': {
      info: { relativeName: 'locale-second', capabilities: { locale: true } },
      resource: async () => ({
        localesProvider: {
          'ja-jp': {
            modules: { 'home-base': { LifecycleProvider: 'second provider loses' } },
          },
        },
      }),
    },
  };
  return {
    modulesMeta: { moduleNames: Object.keys(modules), modules },
    locales: { 'ja-jp': { modules: { 'home-base': { LifecycleProject: 'project' } } } },
    config: [
      () => ({
        locale: {
          default: 'en-us',
          storeKey: 'locale',
          items: { 'en-us': 'English', 'zh-cn': 'Chinese' },
        },
        modules: {},
        logger: { clients: { default: { format: { transform: () => false } } } },
      }),
    ],
    env: { SITE_ID: 'locale-test', META_MODE: 'development' },
    // Only the event transport is a fixture; ZovaSys registers and removes its real hook.
    viteHot,
  };
}

function readReloadTexts(sys: any) {
  const globalText = sys.meta.locale.createLocaleText();
  const lookups = [
    ['home-base', 'LifecycleProject'],
    ['home-base', 'LifecycleProvider'],
    ['home-base', 'LifecycleRemoved'],
    ['home-base', 'LifecycleEnglish'],
    ['home-base', 'LifecycleGlobalRemoved'],
    ['demo-basic', 'HelloWorld'],
    ['demo-basic', 'LifecycleTargetOnly'],
  ];
  return lookups.map(([moduleName, key]) => {
    const scope = sys.bean._newBeanSimple(BeanScopeLocale, false, moduleName);
    const scoped = scope[key].locale('ja-jp');
    const qualified = globalText.locale('ja-jp', `${moduleName}::${key}`);
    const global = globalText.locale('ja-jp', key);
    assert.equal(scoped, qualified, `${moduleName}::${key}: scoped/qualified`);
    assert.equal(scoped, global, `${moduleName}::${key}: scoped/global`);
    return scoped;
  });
}

test('real Sys full-reload hook disposes provider state and reinitializes like fresh startup', async t => {
  setServer(t, true);
  // As in createRuntime(), module-scope construction is outside these resource-loader fixtures.
  // Keep the real container, SysMeta, loader and locale initialization/disposal methods.
  t.mock.method(BeanContainer.prototype, '_getBean', async (name: string) => {
    assert.match(name, /\.scope\.module$/);
    return undefined;
  });
  const env = process.env as unknown as Record<string, string | undefined>;
  const previousDev = env.DEV;
  env.DEV = 'true';
  t.after(() => {
    if (previousDev === undefined) delete env.DEV;
    else env.DEV = previousDev;
  });
  const sys = new ZovaSys();
  const hot = new EventEmitter();
  t.after(() => {
    sys.close();
    hot.removeAllListeners();
  });

  const stages = ['initial', 'ordinary edit', 'provider edit', 'key removal', 'target removal'];
  await sys.initialize(createReloadOptions(0, hot) as any);
  for (const [stage, label] of stages.entries()) {
    assert.equal(hot.listenerCount('vite:beforeFullReload'), 1, label);
    assert.deepEqual(readReloadTexts(sys), [
      'project',
      stage < 2 ? 'provider initial' : 'provider changed',
      stage < 3 ? 'provider removed later' : `ordinary ${stage}`,
      'English fallback',
      stage < 3 ? 'global provider' : 'LifecycleGlobalRemoved',
      stage < 4 ? japanese.modules['demo-basic'].HelloWorld : demoEnglish.HelloWorld,
      stage < 4 ? 'provider target' : 'LifecycleTargetOnly',
    ]);
    assert.equal(Object.hasOwn(sys.meta.locale.locales['ja-jp'], 'modules'), false);
    assert.equal(sys.meta.locale.localeModules['locale-jajp'], undefined);

    const fresh = new ZovaSys();
    try {
      await fresh.initialize(createReloadOptions(stage) as any);
      assert.deepEqual(sys.meta.locale.locales, fresh.meta.locale.locales, label);
      assert.deepEqual(sys.meta.locale.localeModules, fresh.meta.locale.localeModules, label);
      assert.deepEqual(readReloadTexts(sys), readReloadTexts(fresh), label);
    } finally {
      fresh.close();
    }

    const oldRegistry = sys.meta.locale;
    const oldLoader = sys.meta.module;
    const oldContainer = sys.bean;
    // Deliver the lifecycle event directly; this is not Vite watcher acceptance proof.
    assert.equal(hot.emit('vite:beforeFullReload', { path: '*' }), true);
    assert.equal(hot.listenerCount('vite:beforeFullReload'), 0, label);
    assert.deepEqual(oldRegistry.locales, {});
    assert.deepEqual(oldRegistry.localeModules, {});
    assert.equal(oldLoader.getModulesMeta(), undefined);
    sys.close(); // Closing twice must not prevent the next real initialize().
    if (stage < stages.length - 1) {
      await sys.initialize(createReloadOptions(stage + 1, hot) as any);
      assert.notEqual(sys.meta.locale, oldRegistry);
      assert.notEqual(sys.meta.module, oldLoader);
      assert.notEqual(sys.bean, oldContainer);
    }
  }
});

test('disposed SysLocale can register current project/provider resources without removed contributions', async t => {
  setServer(t, true);
  const sys = createRuntime();
  const registry: SysLocale = sys.meta.locale;
  const initial = createReloadOptions(0);
  await registry.initialize(initial.locales as any);
  await sys.meta.module.initialize(initial.modulesMeta as any);
  assert.equal(
    registry.getText(false, 'home-base', 'ja-jp' as any, 'LifecycleRemoved'),
    'provider removed later',
  );
  assert.equal(
    registry.getText(false, 'demo-basic', 'ja-jp' as any, 'HelloWorld'),
    japanese.modules['demo-basic'].HelloWorld,
  );

  registry.dispose();
  assert.deepEqual(registry.locales, {});
  assert.deepEqual(registry.localeModules, {});
  const current = createReloadOptions(4);
  // A full Sys reinitialization creates a new loader, not an incremental merge into installed modules.
  sys.meta.module = Object.assign(new SysModule(), { sys });
  await registry.initialize(current.locales as any);
  await sys.meta.module.initialize(current.modulesMeta as any);
  assert.equal(sys.meta.locale, registry);
  assert.equal(registry.getText(false, 'home-base', 'ja-jp' as any, 'LifecycleProject'), 'project');
  assert.equal(
    registry.getText(false, 'home-base', 'ja-jp' as any, 'LifecycleProvider'),
    'provider changed',
  );
  assert.equal(
    registry.getText(false, 'home-base', 'ja-jp' as any, 'LifecycleRemoved'),
    'ordinary 4',
  );
  assert.equal(
    registry.getText(false, undefined, 'ja-jp' as any, 'LifecycleGlobalRemoved'),
    'LifecycleGlobalRemoved',
  );
  assert.equal(
    registry.getText(false, 'demo-basic', 'ja-jp' as any, 'HelloWorld'),
    demoEnglish.HelloWorld,
  );
});

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
