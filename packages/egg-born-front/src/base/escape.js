/** *
  escapeHtml: based on markdown-it
*/

const HTML_ESCAPE_TEST_RE = /[&<>"']/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"']/g;
const HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
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
  "'": '%27',
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

export default {
  escapeHtml,
  escapeURL,
};
