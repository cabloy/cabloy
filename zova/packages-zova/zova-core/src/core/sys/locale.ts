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
