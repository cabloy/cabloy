// import markdownit from 'markdown-it';
import { MarkdownParser } from 'prosemirror-markdown';
import { schemaCustom } from './schemaCustom.js';
const markdownit = require('@zhennann/markdown');

// :: MarkdownParser
// A parser parsing unextended [CommonMark](http://commonmark.org/),
// without inline HTML, and producing a document in the basic schema.
export const markdownParserCustom = new MarkdownParser(schemaCustom, markdownit.create(), {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  list_item: { block: 'list_item' },
  bullet_list: { block: 'bullet_list', getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }) },
  ordered_list: {
    block: 'ordered_list',
    getAttrs: (tok, tokens, i) => ({
      order: +tok.attrGet('start') || 1,
      tight: listIsTight(tokens, i),
    }),
  },
  heading: { block: 'heading', getAttrs: tok => ({ level: +tok.tag.slice(1) }) },
  code_block: { block: 'code_block', noCloseToken: true },
  fence: { block: 'code_block', getAttrs: tok => ({ params: String(tok.info || '').trim() }), noCloseToken: true },
  hr: { node: 'horizontal_rule' },
  image: {
    node: 'image',
    getAttrs: tok => ({
      src: tok.attrGet('src'),
      title: tok.attrGet('title') || null,
      alt: (tok.children[0] && tok.children[0].content) || null,
    }),
  },
  hardbreak: { node: 'hard_break' },

  em: { mark: 'em' },
  strong: { mark: 'strong' },
  ins: { mark: 'underline' },
  strikethrough: { mark: 'strikethrough' },
  mark: { mark: 'mark' },
  sup: { mark: 'sup' },
  sub: { mark: 'sub' },
  link: {
    mark: 'link',
    getAttrs: tok => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },
  code_inline: { mark: 'code', noCloseToken: true },
});

function listIsTight(tokens, i) {
  while (++i < tokens.length) {
    if (tokens[i].type !== 'list_item_open') return tokens[i].hidden;
  }
  return false;
}
