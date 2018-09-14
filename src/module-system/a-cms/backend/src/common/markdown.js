const require3 = require('require3');
const markdown_it = require3('markdown-it');
const markdown_it_abbr = require3('markdown-it-abbr');
const markdown_it_container = require3('markdown-it-container');
const markdown_it_deflist = require3('markdown-it-deflist');
const markdown_it_emoji = require3('markdown-it-emoji');
const markdown_it_footnote = require3('markdown-it-footnote');
const markdown_it_highlightjs = require3('markdown-it-highlightjs');
const markdown_it_ins = require3('markdown-it-ins');
const markdown_it_katex = require3('markdown-it-katex');
const markdown_it_mark = require3('markdown-it-mark');
const markdown_it_sub = require3('markdown-it-sub');
const markdown_it_sup = require3('markdown-it-sup');
const markdown_it_task_lists = require3('markdown-it-task-lists');
const markdown_it_toc = require3('markdown-it-toc');

const defaults = {
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: true, // autoconvert URL-like texts to links
  typographer: true, // Enable smartypants and other sweet transforms
};

module.exports = {
  create() {
    return markdown_it(defaults)
      .use(markdown_it_abbr)
      .use(markdown_it_container)
      .use(markdown_it_container, 'warning')
      .use(markdown_it_container, 'hljs-left')
      .use(markdown_it_container, 'hljs-center')
      .use(markdown_it_container, 'hljs-right')
      .use(markdown_it_deflist)
      .use(markdown_it_emoji)
      .use(markdown_it_footnote)
      .use(markdown_it_highlightjs)
      .use(markdown_it_ins)
      .use(markdown_it_katex)
      .use(markdown_it_mark)
      .use(markdown_it_sub)
      .use(markdown_it_sup)
      .use(markdown_it_task_lists)
      .use(markdown_it_toc);
  },
};
