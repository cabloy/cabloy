import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutMine extends BeanStyleBase {
  cLayout: string;

  protected async __init__() {
    this.cLayout = this.$style({
      minHeight: '100dvh',
      $nest: {
        '& > header > ul > li > details > ul': {
          right: 0,
          maxHeight: 'calc(100dvh - 5rem)',
          overflowY: 'auto',
          zIndex: 30,
        },
        '@media (min-width: 64rem)': {
          $nest: {
            '& > .mine-body': {
              display: 'grid',
              gridTemplateColumns: '16rem minmax(0, 1fr)',
              minHeight: 'calc(100dvh - 4rem)',
            },
            '& .mine-sidebar': {
              borderRightWidth: 1,
            },
            '& .mine-sidebar > nav': {
              position: 'sticky',
              top: '4rem',
              maxHeight: 'calc(100dvh - 4rem)',
              overflowY: 'auto',
            },
          },
        },
      },
    });
  }
}
