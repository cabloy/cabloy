import type { AnyExtension } from '@tiptap/core';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import { Markdown, MarkdownManager } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { escapeHTML, escapeHTMLAttribute, renderToHTMLString } from '@tiptap/static-renderer';
import { common, createLowlight } from 'lowlight';
import sanitizeHtml from 'sanitize-html';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

const lowlight = createLowlight(common);

const extensions: AnyExtension[] = [
  Markdown,
  StarterKit,
  TaskList,
  TaskItem.configure({ nested: true }),
  Image,
  TableKit,
  Highlight,
  Youtube.configure({
    addPasteHandler: false,
    nocookie: true,
  }),
];

const markdownManager = new MarkdownManager({
  extensions,
  markedOptions: { gfm: true },
  indentation: { style: 'space', size: 2 },
});

function renderHighlightedCode(code: string, language?: string | null): string {
  const highlighted =
    language && lowlight.registered(language)
      ? lowlight.highlight(language, code)
      : lowlight.highlightAuto(code);
  return highlighted.children.map(renderHighlightedNode).join('');
}

interface HighlightedNode {
  children?: HighlightedNode[];
  properties?: { className?: string[] };
  tagName?: string;
  type: string;
  value?: string;
}

function renderHighlightedNode(node: HighlightedNode): string {
  if (node.type === 'text') return escapeHTML(node.value ?? '');
  const children = node.children?.map(renderHighlightedNode).join('') ?? '';
  if (node.tagName !== 'span') return children;
  const classNames = node.properties?.className;
  const classAttribute = classNames?.length
    ? ` class="${classNames.map(escapeHTMLAttribute).join(' ')}"`
    : '';
  return `<span${classAttribute}>${children}</span>`;
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'a',
    'blockquote',
    'br',
    'code',
    'del',
    'div',
    'em',
    'iframe',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'img',
    'input',
    'label',
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
    div: ['data-youtube-video'],
    iframe: ['allowfullscreen', 'height', 'src', 'width'],
    img: ['alt', 'height', 'src', 'title', 'width'],
    input: ['checked', 'disabled', 'type'],
    li: ['data-checked', 'data-type'],
    span: ['class'],
    ul: ['data-type'],
  },
  allowedClasses: {
    code: ['language-*'],
    span: ['hljs-*'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    iframe: ['https'],
    img: ['http', 'https'],
  },
  allowedIframeHostnames: ['www.youtube-nocookie.com'],
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowProtocolRelative: false,
  exclusiveFilter: frame => frame.tag === 'iframe' && !frame.attribs.src,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    input: (_tagName, attribs) => {
      if (attribs.type !== 'checkbox') {
        return { tagName: 'span', attribs: {} };
      }
      return {
        tagName: 'input',
        attribs: {
          type: 'checkbox',
          ...(attribs.checked !== undefined ? { checked: 'checked' } : {}),
          disabled: 'disabled',
        },
      };
    },
    li: (_tagName, attribs) => {
      const taskAttribs: sanitizeHtml.Attributes = {};
      if (attribs['data-type'] === 'taskItem') {
        taskAttribs['data-type'] = 'taskItem';
        if (attribs['data-checked'] === 'true' || attribs['data-checked'] === 'false') {
          taskAttribs['data-checked'] = attribs['data-checked'];
        }
      }
      return { tagName: 'li', attribs: taskAttribs };
    },
    ul: (_tagName, attribs) => {
      const taskAttribs: sanitizeHtml.Attributes = {};
      if (attribs['data-type'] === 'taskList') {
        taskAttribs['data-type'] = 'taskList';
      }
      return { tagName: 'ul', attribs: taskAttribs };
    },
  },
};

@Bean()
export class BeanMarkdown extends BeanBase {
  renderHtml(markdown?: string): string {
    if (!markdown?.trim()) return '';
    const json = markdownManager.parse(markdown);
    const html = renderToHTMLString({
      content: json,
      extensions,
      options: {
        nodeMapping: {
          codeBlock: ({ node }) => {
            const language = node.attrs.language;
            const classAttribute = language
              ? ` class="language-${escapeHTMLAttribute(language)}"`
              : '';
            return `<pre><code${classAttribute}>${renderHighlightedCode(node.textContent, language)}</code></pre>`;
          },
        },
      },
    });
    return sanitizeHtml(html, sanitizeOptions);
  }
}
