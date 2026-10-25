import type {
  TypeModuleResourceLocaleModules,
  TypeModuleResourceLocales,
} from '../../types/interface/module.ts';
import type { ZovaLocaleOptionalMap } from '../app/locale.ts';

import { AppLocale } from '../component/locale.ts';

export class SysLocale extends AppLocale {
  /** @internal */
  public locales: TypeModuleResourceLocales = {};
  public localeModules: TypeModuleResourceLocaleModules = {};

  /** @internal */
  public async initialize(locales?: ZovaLocaleOptionalMap) {
    if (!locales) return;
    for (const locale in locales) {
      const moduleMap = locales[locale].modules;
      for (const moduleName in moduleMap) {
        this._registerLocale(moduleName, locale, moduleMap[moduleName]);
      }
    }
  }

  /** @internal */
  public dispose() {
    this.locales = {};
    this.localeModules = {};
  }

  /** @internal */
  public _registerLocales(moduleName: string, locales: TypeModuleResourceLocales) {
    if (!locales) return;
    for (const locale in locales) {
      this._registerLocale(moduleName, locale, locales[locale]);
    }
  }

  /** @internal */
  public _registerProviderLocales(
    locales: TypeModuleResourceLocales,
    modules: Record<string, unknown>,
  ) {
    if (!locales) return;
    for (const [locale, resource] of Object.entries(locales)) {
      const { modules: targets, ...globals } = resource as {
        modules?: Record<string, Record<string, string>>;
        [key: string]: unknown;
      };
      // Provider envelopes are data, never a message or a provider-owned scope.
      const strings = Object.fromEntries(
        Object.entries(globals).filter(([, value]) => typeof value === 'string'),
      );
      this.locales[locale] = Object.assign({}, strings, this.locales[locale]);
      for (const [moduleName, dictionary] of Object.entries(targets ?? {})) {
        // Membership, not installation: a translated target must remain lazy.
        if (!Object.hasOwn(modules, moduleName)) continue;
        this._registerLocale(moduleName, locale, dictionary);
      }
    }
  }

  private _registerLocale(moduleName: string, locale: string, moduleLocales: object) {
    // locales
    this.locales[locale] = Object.assign({}, moduleLocales, this.locales[locale]);
    // localeModules
    if (!this.localeModules[moduleName]) this.localeModules[moduleName] = {};
    this.localeModules[moduleName][locale] = Object.assign(
      {},
      moduleLocales,
      this.localeModules[moduleName][locale],
    );
  }
}
