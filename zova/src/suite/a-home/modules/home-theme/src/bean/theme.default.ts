import type {
  IDecoratorThemeOptions,
  IThemeApplyParams,
  IThemeApplyResult,
  IThemeBase,
  ThemeToken,
} from 'zova-module-a-style';

import { BeanThemeBase, Theme } from 'zova-module-a-style';

export interface IThemeOptionsDefault extends IDecoratorThemeOptions {}

@Theme<IThemeOptionsDefault>()
export class ThemeDefault extends BeanThemeBase implements IThemeBase {
  async apply({ name, dark }: IThemeApplyParams): Promise<IThemeApplyResult> {
    const token: ThemeToken = {
      color: {
        primary: 'oklch(45% 0.24 277.023)',
      },
      var: {
        borderColor: '#297acc',
      },
      component: {
        page: {
          background: dark ? '#121212' : '#fff',
          color: dark ? '#fff' : '#000',
        },
      },
    };
    return {
      token: this.mergeOptionsToken({ name, dark }, token),
    };
  }
}
