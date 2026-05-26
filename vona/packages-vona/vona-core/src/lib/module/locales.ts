import type { IModule } from '@cabloy/module-info';

import type { TypeModuleResourceLocales, VonaLocaleOptional } from '../../types/index.ts';
import type { VonaApplication } from '../core/application.ts';

import localesDefault from '../core/locales.ts';
import { deepExtend } from '../utils/util.ts';

export default async function (app: VonaApplication, modules: Record<string, IModule>) {
  // all locales
  app.meta.locales = localesDefault;
  app.meta.localeModules = {};

  // load locales
  await loadLocales();

  async function loadLocales() {
    const localesAll = await app.options.locales();
    // project locales default
    for (const locale in localesAll.localesDefault) {
      _initLocales(locale, localesAll.localesDefault[locale]);
    }
    // project locales modules
    for (const locale in localesAll.localesModules) {
      _initLocales(locale, localesAll.localesModules[locale]);
    }
    // app cache
    app.meta.hmrCacheLocaleModules = deepExtend({}, app.meta.localeModules);
    // module locales
    for (const moduleName in modules) {
      const module = modules[moduleName];
      _registerLocales(moduleName, module.resource.locales);
    }
  }

  function _initLocales(locale: string, locales: VonaLocaleOptional | undefined) {
    if (!locales) return;
    if (!locales.modules) {
      // override
      app.meta.locales[locale] = Object.assign({}, app.meta.locales[locale], locales);
    } else {
      const moduleMap = locales.modules;
      for (const moduleName in moduleMap) {
        _registerLocale(moduleName, locale, moduleMap[moduleName]);
      }
    }
  }

  function _registerLocales(moduleName: string, locales: TypeModuleResourceLocales) {
    if (!locales) return;
    for (const locale in locales) {
      _registerLocale(moduleName, locale, locales[locale]);
    }
  }

  function _registerLocale(moduleName: string, locale: string, moduleLocales: object) {
    // locales: not override
    app.meta.locales[locale] = Object.assign({}, moduleLocales, app.meta.locales[locale]);
    // localeModules
    if (!app.meta.localeModules[moduleName]) app.meta.localeModules[moduleName] = {};
    app.meta.localeModules[moduleName][locale] = Object.assign(
      {},
      moduleLocales,
      app.meta.localeModules[moduleName][locale],
    );
  }
}
