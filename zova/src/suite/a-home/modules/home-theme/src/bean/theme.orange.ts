import type {
  IDecoratorThemeOptions,
  IThemeApplyParams,
  IThemeApplyResult,
  IThemeBase,
  ThemeToken,
} from 'zova-module-a-style';

import { BeanThemeBase, Theme } from 'zova-module-a-style';

export interface IThemeOptionsOrange extends IDecoratorThemeOptions {}

@Theme<IThemeOptionsOrange>()
export class ThemeOrange extends BeanThemeBase implements IThemeBase {
  async apply({ name, dark }: IThemeApplyParams): Promise<IThemeApplyResult> {
    const token: ThemeToken = {
      color: {
        primary: '#f28238',
      },
      var: {
        borderColor: '#f28d49',
      },
      component: {
        page: {
          background: dark ? 'oklch(25.33% 0.016 252.42)' : '#fff',
          color: dark ? '#fff' : '#000',
        },
      },
    };
    return {
      token: this.mergeOptionsToken({ name, dark }, token),
    };
  }
}
