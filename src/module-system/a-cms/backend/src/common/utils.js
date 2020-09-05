
/**
  escapeHtml: based on markdown-it
**/

const HTML_ESCAPE_TEST_RE = /[&<>"']/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"']/g;
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#039;',
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

const URL_ESCAPE_TEST_RE = /[<>"']/;
const URL_ESCAPE_REPLACE_RE = /[<>"']/g;
const URL_REPLACEMENTS = {
  '<': '%3C',
  '>': '%3E',
  '"': '%22',
  '\'': '%27',
};

function replaceUnsafeCharURL(ch) {
  return URL_REPLACEMENTS[ch];
}

function escapeURL(str) {
  if (URL_ESCAPE_TEST_RE.test(str)) {
    return str.replace(URL_ESCAPE_REPLACE_RE, replaceUnsafeCharURL);
  }
  return str;
}

module.exports = {
  atomClass(atomClass) {
    let _atomClass;
    if (atomClass) {
      _atomClass = {
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        atomClassIdParent: atomClass.atomClassIdParent || 0,
      };
      if (atomClass.id) _atomClass.id = atomClass.id;
    } else {
      _atomClass = {
        module: 'a-cms',
        atomClassName: 'article',
        atomClassIdParent: 0,
      };
    }
    return _atomClass;
  },
  async atomClass2(ctx, atomClass) {
    const _atomClass = this.atomClass(atomClass);
    if (!_atomClass.id) {
      const res = await ctx.bean.atomClass.get(_atomClass);
      _atomClass.id = res.id;
    }
    return _atomClass;
  },
  escapeHtml(str) {
    return escapeHtml(str);
  },
  escapeURL(str) {
    return escapeURL(str);
  },
};
