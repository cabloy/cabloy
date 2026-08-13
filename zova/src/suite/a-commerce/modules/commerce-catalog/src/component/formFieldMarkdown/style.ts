import { BeanStyleBase } from 'zova';
import { Style } from 'zova-module-a-bean';

@Style()
export class StyleFormFieldMarkdown extends BeanStyleBase {
  cMarkdown: string;

  protected async __init__() {
    this.cMarkdown = this.$style({
      color: 'var(--color-base-content)',
      lineHeight: 1.65,
      overflowWrap: 'anywhere',
      $nest: {
        '& .tiptap > :first-child': {
          marginTop: 0,
        },
        '& .tiptap > :last-child': {
          marginBottom: 0,
        },
        '& .tiptap h1, & .tiptap h2, & .tiptap h3, & .tiptap h4, & .tiptap h5, & .tiptap h6': {
          fontWeight: 700,
          lineHeight: 1.25,
          margin: '1.5rem 0 0.75rem',
        },
        '& .tiptap h1': {
          fontSize: '1.875rem',
        },
        '& .tiptap h2': {
          fontSize: '1.5rem',
        },
        '& .tiptap h3': {
          fontSize: '1.25rem',
        },
        '& .tiptap h4': {
          fontSize: '1.125rem',
        },
        '& .tiptap h5, & .tiptap h6': {
          fontSize: '1rem',
        },
        '& .tiptap p': {
          margin: '0.75rem 0',
        },
        '& .tiptap ul, & .tiptap ol': {
          margin: '0.75rem 0',
          paddingInlineStart: '1.5rem',
        },
        '& .tiptap ul': {
          listStyleType: 'disc',
        },
        '& .tiptap ol': {
          listStyleType: 'decimal',
        },
        '& .tiptap li + li': {
          marginTop: '0.25rem',
        },
        '& .tiptap li > ul, & .tiptap li > ol': {
          margin: '0.25rem 0',
        },
        '& .tiptap ul[data-type="taskList"]': {
          listStyle: 'none',
          paddingInlineStart: 0,
        },
        '& .tiptap ul[data-type="taskList"] li': {
          alignItems: 'flex-start',
          display: 'flex',
          gap: '0.5rem',
        },
        '& .tiptap ul[data-type="taskList"] li > label': {
          lineHeight: 1.65,
          paddingTop: '0.2rem',
        },
        '& .tiptap ul[data-type="taskList"] li > div': {
          flex: 1,
          minWidth: 0,
        },
        '& .tiptap ul[data-type="taskList"] li > div > p': {
          margin: 0,
        },
        '& .tiptap blockquote': {
          borderInlineStart: '0.25rem solid var(--color-base-300)',
          color: 'color-mix(in srgb, var(--color-base-content) 75%, transparent)',
          margin: '1rem 0',
          paddingInlineStart: '1rem',
        },
        '& .tiptap code': {
          background: 'var(--color-base-200)',
          borderRadius: 'var(--radius-box)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.875em',
          padding: '0.125rem 0.25rem',
        },
        '& .tiptap pre': {
          background: 'var(--color-base-200)',
          borderRadius: 'var(--radius-box)',
          lineHeight: 1.5,
          margin: '1rem 0',
          overflowX: 'auto',
          padding: '1rem',
        },
        '& .tiptap pre code': {
          background: 'transparent',
          borderRadius: 0,
          fontSize: '0.875rem',
          padding: 0,
        },
        '& .tiptap mark': {
          background: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
          borderRadius: '0.125rem',
          color: 'inherit',
          padding: '0.125rem 0.25rem',
        },
        '& .tiptap a': {
          color: 'var(--color-primary)',
          textDecoration: 'underline',
          textUnderlineOffset: '0.125rem',
        },
        '& .tiptap img': {
          borderRadius: 'var(--radius-box)',
          display: 'block',
          height: 'auto',
          margin: '1rem 0',
          maxWidth: '100%',
        },
        '& .tiptap hr': {
          border: 0,
          borderTop: '1px solid var(--color-base-300)',
          margin: '1.5rem 0',
        },
        '& .tiptap table': {
          borderCollapse: 'collapse',
          margin: '1rem 0',
          width: '100%',
        },
        '& .tiptap th, & .tiptap td': {
          border: '1px solid var(--color-base-300)',
          minWidth: '8rem',
          padding: '0.5rem 0.75rem',
          textAlign: 'start',
          verticalAlign: 'top',
        },
        '& .tiptap th': {
          background: 'var(--color-base-200)',
          fontWeight: 600,
        },
      },
    });
  }
}
