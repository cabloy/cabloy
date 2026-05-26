import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutTabs extends BeanStyleBase {
  cTab: string;

  protected async __init__() {
    this.cTab = this.$style({
      fontSize: '1.0rem',
      $nest: {
        '&:hover .tab-close': {
          display: 'block',
        },
        '.tab-close': {
          position: 'absolute',
          top: '-6px',
          right: '-6px',
        },
      },
    });
  }
}
