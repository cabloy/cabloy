import type { IModule } from '@cabloy/module-info';

import type {
  ILocaleProviderResource,
  TypeModuleResourceLocales,
  VonaLocaleOptional,
} from '../../types/index.ts';
import type { VonaApplication } from '../core/application.ts';

import localesDefault from '../core/locales.ts';
import { deepExtend } from '../utils/util.ts';

export default async function (app: VonaApplication, modules: Record<string, IModule>) {
  // Each application owns its registry; never add provider/project data to imported resources.
  app.meta.locales = deepExtend({}, localesDefault);
  app.meta.localeModules = {};

  const localesAll = await app.options.locales();
  // Preserve existing project global/module override semantics.
  for (const locale in localesAll.localesDefault) {
    _initLocales(locale, localesAll.localesDefault[locale]);
  }
  for (const locale in localesAll.localesModules) {
    _initLocales(locale, localesAll.localesModules[locale]);
  }

  // Providers precede all ordinary dictionaries, independent of their module order.
  for (const moduleName of Object.keys(modules)) {
    const module = modules[moduleName];
    if (!module.info.capabilities?.locale) continue;
    const locales = module.resource.localesProvider;
    if (!locales) continue;
    for (const locale of Object.keys(locales)) {
      const resource = locales[locale] as ILocaleProviderResource;
      const globals = Object.fromEntries(
        Object.entries(resource).filter(
          ([key, value]) => key !== 'modules' && typeof value === 'string',
        ),
      );
      app.meta.locales[locale] = Object.assign({}, globals, app.meta.locales[locale]);
      for (const target of Object.keys(resource.modules ?? {})) {
        // Metadata membership is sufficient; no target import, install or dependency is needed.
        if (!Object.hasOwn(modules, target)) continue;
        _registerLocale(target, locale, resource.modules![target]);
      }
    }
  }

  // Preserve project/provider precedence when ordinary target dictionaries are reloaded.
  app.meta.hmrCacheLocaleModules = deepExtend({}, app.meta.localeModules);
  for (const moduleName of Object.keys(modules)) {
    const module = modules[moduleName];
    if (!module.info.capabilities?.locale) {
      _registerLocales(moduleName, module.resource.locales);
    }
  }

  function _initLocales(locale: string, locales: VonaLocaleOptional | undefined) {
    if (!locales) return;
    if (!locales.modules) {
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
    app.meta.locales[locale] = Object.assign({}, moduleLocales, app.meta.locales[locale]);
    if (!app.meta.localeModules[moduleName]) app.meta.localeModules[moduleName] = {};
    app.meta.localeModules[moduleName][locale] = Object.assign(
      {},
      moduleLocales,
      app.meta.localeModules[moduleName][locale],
    );
  }
}
