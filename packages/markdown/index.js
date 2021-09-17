const markdown_it = require('markdown-it');
const markdown_it_abbr = require('markdown-it-abbr');
const markdown_it_container = require('markdown-it-container');
const markdown_it_deflist = require('markdown-it-deflist');
const markdown_it_emoji = require('markdown-it-emoji');
const markdown_it_footnote = require('markdown-it-footnote');
// const markdown_it_highlightjs = require('markdown-it-highlightjs');
const markdown_it_ins = require('markdown-it-ins');
const markdown_it_katex = require('@zhennann/markdown-it-katex');
const markdown_it_mark = require('markdown-it-mark');
const markdown_it_sub = require('markdown-it-sub');
const markdown_it_sup = require('markdown-it-sup');
const markdown_it_task_lists = require('markdown-it-task-lists');
const markdown_it_toc = require('markdown-it-toc');
const highlight = require('./highlight.js');

const defaults = {
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: true, // autoconvert URL-like texts to links
  typographer: true, // Enable smartypants and other sweet transforms
  highlight,
};

function get_options_container(name) {
  return {
    render(tokens, idx, _options, env, slf) {
      // add a class to the opening tag
      if (tokens[idx].nesting === 1) {
        tokens[idx].attrJoin('class', `markdown-it-container ${name}`);
      }

      return slf.renderToken(tokens, idx, _options, env, slf);
    },
  };
}

module.exports = {
  create(ops) {
    const md = markdown_it((ops && ops.defaults) || defaults)
      .use(markdown_it_abbr)
      // .use(markdown_it_container)
      .use(markdown_it_container, 'comment-quot', get_options_container('comment-quot'))
      .use(markdown_it_container, 'alert-success', get_options_container('alert-success'))
      .use(markdown_it_container, 'alert-info', get_options_container('alert-info'))
      .use(markdown_it_container, 'alert-warning', get_options_container('alert-warning'))
      .use(markdown_it_container, 'alert-danger', get_options_container('alert-danger'))
      .use(markdown_it_container, 'hljs-left', get_options_container('hljs-left'))
      .use(markdown_it_container, 'hljs-center', get_options_container('hljs-center'))
      .use(markdown_it_container, 'hljs-right', get_options_container('hljs-right'))
      .use(markdown_it_deflist)
      .use(markdown_it_emoji)
      .use(markdown_it_footnote)
      // .use(markdown_it_highlightjs)
      .use(markdown_it_ins)
      .use(markdown_it_katex)
      .use(markdown_it_mark)
      .use(markdown_it_sub)
      .use(markdown_it_sup)
      .use(markdown_it_task_lists)
      .use(markdown_it_toc);
    return md;
  },
};
