import type { Ref } from 'vue';

import * as localeutil from '@cabloy/localeutil';
import { ref } from 'vue';

import type {
  ILocaleRecord,
  IModuleLocale,
  IModuleLocaleText,
} from '../../bean/resource/locale/type.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { LocaleModuleNameSeparator } from '../../bean/resource/locale/type.ts';

const SymbolLocaleCurrent = Symbol('SymbolLocaleCurrent');
const SymbolTzCurrent = Symbol('SymbolTzCurrent');

export class AppLocale extends BeanSimple {
  private [SymbolLocaleCurrent]: Ref<string | undefined> = ref();
  private [SymbolTzCurrent]: Ref<string | undefined> = ref();

  get metaCookie() {
    return this.app ? this.app.meta.cookie : this.sys.meta.cookie;
  }

  get current(): keyof ILocaleRecord {
    let locale = this[SymbolLocaleCurrent].value;
    if (!locale && this.sys.config.ssr.cookie)
      locale = this.metaCookie.getItem(this.sys.config.locale.storeKey);
    if (!locale) locale = this.sys.config.locale.default;
    return locale as keyof ILocaleRecord;
  }

  set current(value: keyof ILocaleRecord) {
    if (this[SymbolLocaleCurrent].value === value) return;
    this[SymbolLocaleCurrent].value = value;
    if (this.sys.config.ssr.cookie) {
      this.metaCookie.setItem(this.sys.config.locale.storeKey, value);
    }
  }

  get tz(): string {
    let tz = this[SymbolTzCurrent].value;
    if (!tz) tz = this.metaCookie.getItem(this.sys.config.tz.storeKey);
    if (!tz) tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz;
  }

  set tz(value: string) {
    if (this[SymbolTzCurrent].value === value) return;
    this[SymbolTzCurrent].value = value;
    this.metaCookie.setItem(this.sys.config.tz.storeKey, value);
  }

  /** @internal */
  public async initialize() {}

  /** @internal */
  public createLocaleText(moduleScope?: string): IModuleLocaleText {
    const self = this;
    const getText = function (text: string, ...args: any[]): string {
      return self.getText(false, moduleScope, undefined, text, ...args);
    };
    getText.locale = function <T extends keyof ILocaleRecord>(
      locale: T | undefined,
      text: string,
      ...args: any[]
    ): string {
      return self.getText(false, moduleScope, locale, text, ...args);
    };
    return getText;
  }

  /** @internal */
  public createScopeLocaleText(moduleScope: string, text: string): IModuleLocale {
    const self = this;
    const getText = function (...args: any[]): string {
      return self.getText(false, moduleScope, undefined, text, ...args);
    };
    getText.locale = function <T extends keyof ILocaleRecord>(
      locale: T | undefined,
      ...args: any[]
    ): string {
      return self.getText(false, moduleScope, locale, text, ...args);
    };
    return getText;
  }

  public getText<T extends keyof ILocaleRecord>(
    supportCustomMessage: boolean,
    moduleScope: string | undefined,
    locale: T | undefined,
    key: string,
    ...args: any[]
  ): string {
    if (!key) return key;
    if (typeof key !== 'string') throw new Error(`${key} should be string`);
    const pos = key.indexOf(LocaleModuleNameSeparator);
    if (pos > -1) {
      moduleScope = key.substring(0, pos);
      key = key.substring(pos + LocaleModuleNameSeparator.length);
    }
    return localeutil.getLocaleText(
      supportCustomMessage,
      moduleScope ? this.sys.meta.locale.localeModules[moduleScope] : undefined,
      this.sys.meta.locale.locales,
      locale || this.current,
      key,
      ...args,
    );
  }
}
