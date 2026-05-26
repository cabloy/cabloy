import type { IDecoratorCssOptions } from 'zova-module-a-style';

import { BeanBase } from 'zova';
import { Css } from 'zova-module-a-style';

export interface ICssOptionsBase extends IDecoratorCssOptions {}

@Css<ICssOptionsBase>()
export class CssBase extends BeanBase {
  cTextCenter: string;
  cButtonPrimary: string;

  protected async __init__() {
    this.cTextCenter = this.$style({ textAlign: 'center' });
    this.cButtonPrimary = this.$computed(() => {
      return this.$style({
        color: this.$token.color.primary,
        borderColor: this.$token.var.borderColor,
      });
    });
  }
}
