import * as localeutil from '@cabloy/localeutil';

import type { ILocaleRecord, IModuleLocale, IModuleLocaleText } from './type.ts';

import { cast } from '../../../../types/utils/cast.ts';
import { BeanSimple } from '../../beanSimple.ts';
import { LocaleModuleNameSeparator } from './type.ts';
import { isLocaleMagic } from './utils.ts';

export class AppLocale extends BeanSimple {
  get current(): keyof ILocaleRecord {
    return this.ctx ? this.ctx.locale : 'en-us';
  }

  set current(value: keyof ILocaleRecord) {
    this.ctx.locale = value;
  }

  get tz(): string | undefined {
    return this.ctx.tz;
  }

  set tz(value: string | undefined) {
    this.ctx.tz = value;
  }

  /** @internal */
  public createLocaleText(moduleScope?: string): IModuleLocaleText {
    const self = this;
    const getText = function (text: string | object, ...args: any[]): string {
      return self.getText(false, moduleScope, undefined, text, ...args);
    };
    getText.locale = function <T extends keyof ILocaleRecord>(
      locale: T | undefined,
      text: string | object,
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
    key: string | object,
    ...args: any[]
  ): string {
    if (!key) return key;
    if (isLocaleMagic(key)) {
      return cast(key).toJSON();
    }
    if (typeof key !== 'string') throw new Error(`${key} should be string`);
    const pos = key.indexOf(LocaleModuleNameSeparator);
    if (pos > -1) {
      moduleScope = key.substring(0, pos);
      key = key.substring(pos + LocaleModuleNameSeparator.length);
    }
    return localeutil.getLocaleText(
      supportCustomMessage,
      moduleScope ? this.app.meta.localeModules[moduleScope] : undefined,
      this.app.meta.locales,
      locale || this.current,
      key,
      ...args,
    );
  }
}
