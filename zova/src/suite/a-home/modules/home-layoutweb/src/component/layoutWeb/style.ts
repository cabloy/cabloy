import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutWeb extends BeanStyleBase {
  cHeaderActions: string;

  protected async __init__() {
    this.cHeaderActions = this.$style({
      $nest: {
        '& .header-actions-panel > ul > li > details > ul': {
          maxHeight: 'calc(100dvh - 5rem)',
          overflowY: 'auto',
        },
        '@media (width < 64rem)': {
          $nest: {
            '& .header-actions-panel': {
              width: '16rem',
              maxWidth: 'calc(100vw - 1rem)',
              maxHeight: 'calc(100dvh - 5rem)',
              overflowY: 'auto',
            },
            '& .header-actions-panel > ul > li > details > ul': {
              width: 'auto',
              maxWidth: '100%',
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
            },
          },
        },
        '@media (min-width: 64rem)': {
          $nest: {
            '& .header-actions-panel > ul > li > details > ul': {
              right: 0,
              maxWidth: 'calc(100vw - 1rem)',
            },
          },
        },
      },
    });
  }
}
