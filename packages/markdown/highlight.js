const hljs = require('highlight.js');

function maybe(f) {
  try {
    return f();
  } catch (e) {
    return false;
  }
}

// Highlight with given language.
const highlight = (hljs, code, lang) => maybe(() => hljs.highlight(code, { language: lang || 'plaintext', ignoreIllegals: true }).value) || '';

const applyLineNumbers = code => {
  const lines = code.split(/\n/).slice(0, -1);
  let html = lines
    .map((item, index) => {
      return '<li><span class="line-num" data-line="' + (index + 1) + '">' + (index + 1) + '</span>' + item + '</li>';
    })
    .join('');
  html = '<ol>' + html + '</ol>';
  return html;
};

module.exports = function (code, lang) {
  code = lang ? highlight(hljs, code, lang) : maybe(() => hljs.highlightAuto(code).value) || '';
  code = applyLineNumbers(code);
  return `<pre><code class="hljs language-${lang}">${code}</code></pre>`;
};
