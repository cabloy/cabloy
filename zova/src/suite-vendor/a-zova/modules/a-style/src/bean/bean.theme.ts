import { beanFullNameFromOnionName, cast, UseScope } from 'zova';
import { Bean } from 'zova-module-a-bean';
import { BeanModelBase } from 'zova-module-a-model';
import { ScopeModuleASsr } from 'zova-module-a-ssr';

import type { IThemeBase, IThemeHandler, IThemeRecord } from '../types/index.js';

export type ThemeDarkMode = 'auto' | boolean;

@Bean()
export class BeanTheme extends BeanModelBase {
  name: keyof IThemeRecord;
  darkMode: ThemeDarkMode; // auto/true/false

  private _dark: boolean;
  get dark() {
    return this._dark;
  }

  token: unknown;
  private _mediaDark?: MediaQueryList;
  private _onMediaDarkChange?;

  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  protected async __init__() {
    const cookieTheme = this.sys.config.ssr.cookie;
    const cookieThemeDarkDefault = this.$$scopeSsr.config.cookieThemeDarkDefault;
    // support admin
    this.name = this.$useState(cookieTheme ? 'cookie' : 'local', {
      queryKey: ['themename'],
      meta: {
        persister: {
          maxAge: this.scope.config.model.themename.persister.maxAge,
        },
        defaultData: this.scope.config.defaultTheme,
      },
    });
    this.darkMode = this.$useState(cookieTheme ? 'cookie' : 'local', {
      queryKey: ['themedark'],
      meta: {
        persister: {
          maxAge: this.scope.config.model.themename.persister.maxAge,
          deserialize: (value, deserializeDefault) => {
            if (cookieTheme && value === 'auto') value = cookieThemeDarkDefault;
            return deserializeDefault(value);
          },
        },
        defaultData: cookieTheme ? cookieThemeDarkDefault : 'auto',
      },
    });
    this._updateDark();

    this.$watch(
      () => this.darkMode,
      () => {
        this._updateDark();
      },
    );

    if (process.env.CLIENT) {
      this.$watch([() => this.name, () => this._dark], () => {
        this._applyTheme();
      });
    }

    // not use watch.immediate for await done
    await this._applyThemeWrapper();
  }

  protected __dispose__() {
    this._listenMediaDarkChange(false);
  }

  private _updateDark() {
    this._dark = this._getDarkFromDarkMode(this.darkMode);
  }

  async _applyThemeWrapper() {
    await this._applyTheme();
    if (this.sys.config.ssr.ignoreCookieOnServer) {
      this.toggleDark();
      await this._applyTheme();
    }
  }

  async _applyTheme() {
    const name = this.name;
    const dark = this._dark;
    const theme = await this._loadThemeBean(name);
    if (!theme) {
      this.name = this.scope.config.defaultTheme;
      await this._applyTheme();
      return;
    }
    const res = await theme.apply({ name, dark });
    this.token = cast(res).token;
    const handler = res.handler ?? this.scope.config.defaultThemeHandler;
    if (handler) {
      const themeHandler = (await this.bean._getBean(
        beanFullNameFromOnionName(handler, 'meta'),
        true,
      )) as unknown as IThemeHandler;
      await themeHandler.apply({ name, dark, token: this.token } as any);
    }
  }

  async _loadThemeBean(name: keyof IThemeRecord): Promise<IThemeBase | undefined> {
    const parts = name.split(':');
    if (parts.length === 1) {
      throw new Error(`invalid theme name: ${name}`);
    }
    const moduleName = parts[0];
    if (!this.app.meta.module.exists(moduleName)) return;
    return (await this.bean._getBean(beanFullNameFromOnionName(name, 'theme'), true)) as IThemeBase;
  }

  toggleDark() {
    this.darkMode = !this._dark;
    this._updateDark(); // immediate
  }

  _getDarkFromDarkMode(mode?: ThemeDarkMode) {
    if (mode === undefined) mode = 'auto';
    if (mode === 'auto') {
      this._listenMediaDarkChange(true);
      return !!this._mediaDark?.matches;
    } else {
      this._listenMediaDarkChange(false);
      return mode;
    }
  }

  _listenMediaDarkChange(listen: boolean) {
    if (process.env.SERVER) return;
    if (listen) {
      if (!this._mediaDark) {
        this._mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
        this._onMediaDarkChange = async () => {
          this._updateDark();
          this._applyTheme();
        };
        this._mediaDark.addEventListener('change', this._onMediaDarkChange);
      }
    } else {
      if (this._mediaDark) {
        this._mediaDark.removeEventListener('change', this._onMediaDarkChange);
        this._onMediaDarkChange = undefined;
        this._mediaDark = undefined;
      }
    }
  }
}
