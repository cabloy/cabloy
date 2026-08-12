import type { AnyExtension } from '@tiptap/core';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Markdown, MarkdownManager } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { renderToHTMLString } from '@tiptap/static-renderer';
import sanitizeHtml from 'sanitize-html';

const extensions: AnyExtension[] = [
  Markdown,
  StarterKit,
  TaskList,
  TaskItem.configure({ nested: true }),
  Image,
  TableKit,
  Highlight,
];

const markdownManager = new MarkdownManager({
  extensions,
  markedOptions: { gfm: true },
  indentation: { style: 'space', size: 2 },
});

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'a',
    'blockquote',
    'br',
    'code',
    'del',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul',
  ],
  allowedAttributes: {
    a: ['href', 'rel', 'target', 'title'],
    code: ['class'],
    img: ['alt', 'height', 'src', 'title', 'width'],
    span: ['class'],
  },
  allowedClasses: {
    code: ['language-*'],
    span: ['hljs-*'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

export function renderProductContentMarkdown(markdown?: string): string {
  if (!markdown?.trim()) return '';
  const json = markdownManager.parse(markdown);
  const html = renderToHTMLString({ content: json, extensions });
  return sanitizeHtml(html, sanitizeOptions);
}
