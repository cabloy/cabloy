const path = require('path');
const generate = require('markdown-it-testgen');

/* eslint-env mocha*/

const options = {
  utils: {
    text() {
      return 'Block';
    },
  },
  blocks: {
    iframe: {
      render({ md, token, content, block }) {
        const src = md.utils.escapeHtml(content.src);
        return `<div><iframe src="${src}"></iframe></div>\n`;
      },
    },
  },
};

describe('default block', function () {
  const md = require('markdown-it')().use(require('../'), options);

  generate(path.join(__dirname, 'fixtures/default.txt'), md);
});
