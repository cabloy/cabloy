import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleLayoutAdmin extends BeanStyleBase {
  cTab: string;
  cHeaderActions: string;
  cHeader: string;
  cTabItems: string;
  cTabItemsMenu: string;

  protected async __init__() {
    this.cHeader = this.$style({
      $nest: {
        '& .header-title': { minWidth: 0 },
        '&:has(.tab-items) .header-title': {
          flex: '0 1 auto',
          maxWidth: '10rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        '&:has(.tab-items) .header-navigation': { marginInline: 0, paddingInline: 0 },
        '@media (width < 600px)': {
          $nest: { '&:has(.tab-items) .header-title': { display: 'none' } },
        },
      },
    });
    this.cTabItems = this.$style({
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      height: '48px',
      $nest: {
        '& .tab-items-viewport': { position: 'relative', minWidth: 0, flex: '1 1 0' },
        '& .tab-items-scroll': { overflowX: 'auto', scrollbarWidth: 'none' },
        '& .tab-items-scroll::-webkit-scrollbar': { display: 'none' },
        '& .tab-items-content': {
          display: 'flex',
          flexWrap: 'nowrap',
          width: 'max-content',
          minWidth: '100%',
        },
        '& .tab': { flexShrink: 0, height: '48px', gap: '4px' },
        '& .tab > svg': { flexShrink: 0 },
        '& .tab > div': { minWidth: 0 },
        '& .tab-close': { top: '2px', right: '2px' },
        '& .tab-items-more': { flex: '0 0 40px', width: '40px', height: '40px', fontSize: '20px' },
        '&.is-compact .tab-items-content': { width: '100%' },
        '&.is-compact .tab': { minWidth: 0, maxWidth: '100%', paddingInline: '12px' },
        '&.is-compact .tab-close': { display: 'none' },
        '& .tab-items-viewport::before, & .tab-items-viewport::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '16px',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0,
        },
        '& .tab-items-viewport::before': {
          left: 0,
          background: 'linear-gradient(to right, var(--color-base-300), transparent)',
        },
        '& .tab-items-viewport::after': {
          right: 0,
          background: 'linear-gradient(to left, var(--color-base-300), transparent)',
        },
        '& .tab-items-viewport.has-start::before, & .tab-items-viewport.has-end::after': {
          opacity: 1,
        },
      },
    });
    this.cTabItemsMenu = this.$style({
      display: 'none',
      position: 'fixed',
      inset: 'auto',
      margin: 0,
      width: '22rem',
      maxWidth: 'calc(100vw - 16px)',
      maxHeight: 'calc(100dvh - 16px)',
      overflowY: 'auto',
      $nest: {
        '&:popover-open': { display: 'flex', flexDirection: 'column', gap: '4px' },
        '& .tab-items-select': {
          flex: '1 1 0',
          minWidth: 0,
          height: 'auto',
          minHeight: '40px',
          justifyContent: 'flex-start',
          textTransform: 'none',
          paddingBlock: '8px',
        },
        '& .tab-items-select svg': { flexShrink: 0 },
        '& .tab-items-label': {
          flex: '1 1 0',
          minWidth: 0,
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          textAlign: 'start',
        },
      },
    });
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
