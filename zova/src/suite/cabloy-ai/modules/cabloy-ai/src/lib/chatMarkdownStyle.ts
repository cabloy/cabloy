import type { NestedCSSProperties } from 'typestyle/lib/types.js';

export function chatMarkdownStyle(): NestedCSSProperties {
  return {
    color: 'var(--color-base-content)',
    lineHeight: 1.65,
    minWidth: 0,
    overflowWrap: 'break-word',
    $nest: {
      '& .markstream-vue': {
        minWidth: 0,
        overflowWrap: 'break-word',
      },
      '& .markstream-vue > :first-child, & .markstream-vue > :first-child > :first-child': {
        marginTop: 0,
      },
      '& .markstream-vue > :last-child, & .markstream-vue > :first-child > :last-child': {
        marginBottom: 0,
      },
      '& .heading-node': {
        color: 'var(--color-base-content)',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '1.5rem 0 0.75rem',
      },
      '& .heading-1': {
        fontSize: '1.875rem',
      },
      '& .heading-2': {
        fontSize: '1.5rem',
      },
      '& .heading-3': {
        fontSize: '1.25rem',
      },
      '& .heading-4': {
        fontSize: '1.125rem',
      },
      '& .heading-5, & .heading-6': {
        fontSize: '1rem',
      },
      '& .paragraph-node': {
        margin: '0.75rem 0',
      },
      '& .text-node': {
        overflowWrap: 'break-word',
      },
      '& .list-node': {
        margin: '0.75rem 0',
        paddingInlineStart: '1.5rem',
      },
      '& .list-disc': {
        listStyleType: 'disc',
      },
      '& .list-decimal': {
        listStyleType: 'decimal',
      },
      '& .list-item + .list-item': {
        marginTop: '0.25rem',
      },
      '& .list-item > .list-node': {
        margin: '0.25rem 0',
      },
      '& .checkbox-node': {
        accentColor: 'var(--color-primary)',
        marginInlineEnd: '0.5rem',
      },
      '& .blockquote, & .blockquote-node': {
        borderInlineStart: '0.25rem solid var(--color-primary)',
        color: 'color-mix(in srgb, var(--color-base-content) 75%, transparent)',
        margin: '1rem 0',
        paddingInlineStart: '1rem',
      },
      '& .inline-code': {
        background: 'var(--color-base-200)',
        borderRadius: 'var(--radius-box)',
        color: 'var(--color-base-content)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.875em',
        overflowWrap: 'break-word',
        padding: '0.125rem 0.25rem',
      },
      '& .code-block-container': {
        background: 'var(--color-base-200)',
        border: '1px solid var(--color-base-300)',
        borderRadius: 'var(--radius-box)',
        margin: '1rem 0',
        maxWidth: '100%',
        overflowX: 'auto',
      },
      '& .code-pre-fallback': {
        background: 'var(--color-base-200)',
        border: '1px solid var(--color-base-300)',
        borderRadius: 'var(--radius-box)',
        lineHeight: 1.5,
        margin: '1rem 0',
        maxWidth: '100%',
        overflowX: 'auto',
        padding: '1rem',
      },
      '& .code-pre-fallback code': {
        background: 'transparent',
        display: 'block',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.875rem',
        padding: 0,
        whiteSpace: 'pre',
      },
      '& .link-node': {
        color: 'var(--color-primary)',
        overflowWrap: 'anywhere',
        textDecoration: 'underline',
        textUnderlineOffset: '0.125rem',
      },
      '& .image-node-container': {
        margin: '1rem 0',
        maxWidth: '100%',
      },
      '& .image-node__img': {
        borderRadius: 'var(--radius-box)',
        display: 'block',
        height: 'auto',
        maxWidth: '100%',
      },
      '& .markstream-vue .hr-node, & .markstream-vue hr': {
        background: 'transparent',
        border: 0,
        borderTop: '1px solid var(--color-base-300)',
        color: 'transparent',
        height: 0,
        margin: '1.5rem 0',
      },
      '& .table-node-wrapper': {
        'maxWidth': '100%',
        'margin': '1rem 0',
        'overflowX': 'auto',
        '-webkit-overflow-scrolling': 'touch',
      },
      '& .markstream-vue .table-node': {
        background: 'var(--color-base-100)',
        border: '1px solid var(--color-base-300)',
        borderCollapse: 'separate',
        borderRadius: 'var(--radius-box)',
        borderSpacing: 0,
        boxShadow: 'none',
        color: 'var(--color-base-content)',
        overflow: 'hidden',
        tableLayout: 'auto',
        width: 'max-content',
        minWidth: '100%',
      },
      '& .markstream-vue .table-node th, & .markstream-vue .table-node td': {
        borderBottom: '1px solid var(--color-base-300)',
        borderRight: '1px solid var(--color-base-300)',
        minWidth: '8rem',
        overflowWrap: 'break-word',
        padding: '0.5rem 0.75rem',
        textAlign: 'start',
        verticalAlign: 'top',
        whiteSpace: 'normal',
        wordBreak: 'normal',
      },
      '& .markstream-vue .table-node th:last-child, & .markstream-vue .table-node td:last-child': {
        borderRight: 0,
      },
      '& .markstream-vue .table-node tbody tr:last-child td': {
        borderBottom: 0,
      },
      '& .markstream-vue .table-node thead th': {
        background: 'var(--color-base-200)',
        borderBottom: '2px solid var(--color-base-300)',
        color: 'var(--color-base-content)',
        fontWeight: 600,
      },
      '& .markstream-vue .table-node tbody tr': {
        background: 'var(--color-base-100)',
        transition: 'background-color 120ms ease',
      },
      '& .markstream-vue .table-node tbody tr:nth-child(even)': {
        background: 'color-mix(in srgb, var(--color-base-content) 4%, var(--color-base-100))',
      },
      '& .markstream-vue .table-node tbody tr:hover': {
        background: 'color-mix(in srgb, var(--color-base-content) 8%, var(--color-base-100))',
      },
    },
  };
}
