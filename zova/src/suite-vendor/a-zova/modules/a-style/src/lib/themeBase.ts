import { BeanBase, deepExtend } from 'zova';

import type { IDecoratorThemeOptions, IThemeApplyParams, ThemeToken } from '../types/theme.js';

export class BeanThemeBase extends BeanBase {
  protected getOptionsToken(params: IThemeApplyParams) {
    const options = this.$onionOptions as IDecoratorThemeOptions;
    return options.token?.(params);
  }

  protected mergeOptionsToken(params: IThemeApplyParams, token: ThemeToken) {
    const optionsToken = this.getOptionsToken(params);
    if (optionsToken) {
      token = deepExtend(token, optionsToken);
    }
    return token;
  }
}
