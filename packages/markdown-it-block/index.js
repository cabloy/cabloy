// Process block-level custom containers
//
'use strict';


module.exports = function cabloycmstag_plugin(md, options) {

  function render(tokens, idx /*_options, env, self*/) {
    // tag
    var token = tokens[idx];
    var tagName = token.info.trim().split(' ', 2)[0];
    var tag = options.tags[tagName];
    // content: for safe
    var content = token.content ? JSON.parse(token.content) : {};
    if (!tag || !tag.render){
      // default
      var res = JSON.stringify(content, null, 2);
      return `<div>\n${md.utils.escapeHtml(res)}\n</div>\n`;
    }
    return tag.render({ md, token, content, tag });
  }

  function cabloycmstag(state, startLine, endLine, silent) {
    var marker, len, params, nextLine, mem, token, markup,
        haveEndMarker = false,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }
    if (pos + 3 > max) { return false; }
    marker = state.src.charCodeAt(pos);
    if (marker !== 0x24/* $ */) {
      return false;
    }
    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);
    len = pos - mem;
    if (len < 3) { return false; }
    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);
    if (params.indexOf(String.fromCharCode(marker)) >= 0) { return false; }
    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }
    // search end of block
    nextLine = startLine;
    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }
      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break;
      }
      if (state.src.charCodeAt(pos) !== marker) { continue; }
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }
      pos = state.skipChars(pos, marker);
      // closing code fence must be at least as long as the opening one
      if (pos - mem < len) { continue; }
      // make sure tail has spaces only
      pos = state.skipSpaces(pos);
      if (pos < max) { continue; }
      haveEndMarker = true;
      // found!
      break;
    }
    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    token         = state.push('cabloycmstag', 'div', 0);
    token.info    = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup  = markup;
    token.map     = [ startLine, state.line ];
    return true;
  }

  md.block.ruler.before('fence', 'cabloycmstag', cabloycmstag, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules.cabloycmstag = render;
};
