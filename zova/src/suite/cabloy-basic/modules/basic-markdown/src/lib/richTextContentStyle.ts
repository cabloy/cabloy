import type { NestedCSSProperties } from 'typestyle/lib/types.js';

export function richTextContentStyle(): NestedCSSProperties {
  return {
    color: 'var(--color-base-content)',
    lineHeight: 1.65,
    overflowWrap: 'anywhere',
    $nest: {
      '& > :first-child, & > :first-child > :first-child': {
        marginTop: 0,
      },
      '& > :last-child, & > :first-child > :last-child': {
        marginBottom: 0,
      },
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '1.5rem 0 0.75rem',
      },
      '& h1': {
        fontSize: '1.875rem',
      },
      '& h2': {
        fontSize: '1.5rem',
      },
      '& h3': {
        fontSize: '1.25rem',
      },
      '& h4': {
        fontSize: '1.125rem',
      },
      '& h5, & h6': {
        fontSize: '1rem',
      },
      '& p': {
        margin: '0.75rem 0',
      },
      '& ul, & ol': {
        margin: '0.75rem 0',
        paddingInlineStart: '1.5rem',
      },
      '& ul': {
        listStyleType: 'disc',
      },
      '& ol': {
        listStyleType: 'decimal',
      },
      '& li + li': {
        marginTop: '0.25rem',
      },
      '& li > ul, & li > ol': {
        margin: '0.25rem 0',
      },
      '& ul[data-type="taskList"]': {
        listStyle: 'none',
        paddingInlineStart: 0,
      },
      '& ul[data-type="taskList"] li': {
        alignItems: 'flex-start',
        display: 'flex',
        gap: '0.5rem',
      },
      '& ul[data-type="taskList"] li > label': {
        lineHeight: 1.65,
        paddingTop: '0.2rem',
      },
      '& ul[data-type="taskList"] li > div': {
        flex: 1,
        minWidth: 0,
      },
      '& ul[data-type="taskList"] li > div > p': {
        margin: 0,
      },
      '& blockquote': {
        borderInlineStart: '0.25rem solid var(--color-base-300)',
        color: 'color-mix(in srgb, var(--color-base-content) 75%, transparent)',
        margin: '1rem 0',
        paddingInlineStart: '1rem',
      },
      '& code': {
        background: 'var(--color-base-200)',
        borderRadius: 'var(--radius-box)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.875em',
        padding: '0.125rem 0.25rem',
      },
      '& pre': {
        background: 'var(--color-base-200)',
        borderRadius: 'var(--radius-box)',
        lineHeight: 1.5,
        margin: '1rem 0',
        overflowX: 'auto',
        padding: '1rem',
      },
      '& pre code': {
        background: 'transparent',
        borderRadius: 0,
        display: 'block',
        fontSize: '0.875rem',
        padding: 0,
      },
      '& pre code .hljs-comment, & pre code .hljs-quote': {
        color: 'color-mix(in srgb, var(--color-base-content) 55%, transparent)',
        fontStyle: 'italic',
      },
      '& pre code .hljs-keyword, & pre code .hljs-selector-tag, & pre code .hljs-type': {
        color: 'var(--color-secondary)',
      },
      '& pre code .hljs-string, & pre code .hljs-attr, & pre code .hljs-template-variable': {
        color: 'var(--color-success)',
      },
      '& pre code .hljs-number, & pre code .hljs-literal, & pre code .hljs-built_in': {
        color: 'var(--color-info)',
      },
      '& pre code .hljs-title, & pre code .hljs-function, & pre code .hljs-variable': {
        color: 'var(--color-primary)',
      },
      '& pre code .hljs-meta, & pre code .hljs-symbol, & pre code .hljs-params': {
        color: 'var(--color-warning)',
      },
      '& mark': {
        background: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
        borderRadius: '0.125rem',
        color: 'inherit',
        padding: '0.125rem 0.25rem',
      },
      '& a': {
        color: 'var(--color-primary)',
        textDecoration: 'underline',
        textUnderlineOffset: '0.125rem',
      },
      '& img': {
        borderRadius: 'var(--radius-box)',
        display: 'block',
        height: 'auto',
        margin: '1rem 0',
        maxWidth: '100%',
      },
      '& hr': {
        border: 0,
        borderTop: '1px solid var(--color-base-300)',
        margin: '1.5rem 0',
      },
      '& table': {
        borderCollapse: 'collapse',
        margin: '1rem 0',
        width: '100%',
      },
      '& th, & td': {
        border: '1px solid var(--color-base-300)',
        minWidth: '8rem',
        padding: '0.5rem 0.75rem',
        textAlign: 'start',
        verticalAlign: 'top',
      },
      '& th': {
        background: 'var(--color-base-200)',
        fontWeight: 600,
      },
    },
  };
}
