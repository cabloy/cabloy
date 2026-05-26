import type { IThemeHandler, IThemeHandlerApplyParams } from 'zova-module-a-style';

import { BeanBase, UseScope } from 'zova';
import { Meta } from 'zova-module-a-meta';
import { ScopeModuleASsr } from 'zova-module-a-ssr';

@Meta()
export class MetaThemeHandler extends BeanBase implements IThemeHandler {
  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  async apply({ name: _name, dark, token }: IThemeHandlerApplyParams): Promise<void> {
    // themeName
    const themeName = dark ? 'dark' : 'light';
    const colorPrimary = token.color.primary;
    // data-theme
    if (process.env.CLIENT) {
      // client
      this.$useMeta({
        bodyAttr: { 'data-theme': themeName },
      });
      const body = window?.document?.body;
      if (body) {
        body.style.setProperty('--color-primary', colorPrimary);
      }
    } else {
      // server
      if (!this.sys.config.ssr.cookie) {
        this.$useMeta({ bodyAttr: { [`data-ssr-theme-dark-${dark}`]: themeName } });
      } else {
        this.$useMeta({
          bodyAttr: { 'data-theme': themeName },
          bodyStyle: {
            '--color-primary': colorPrimary,
          },
        });
      }
    }
  }
}
