// Process block-level custom containers
//

module.exports = function block_plugin(md, options) {
  function blockRender(tokens, idx /* _options, env, self */) {
    // blockTitle
    const blockTitle = options.utils.text('Block');
    // block
    const token = tokens[idx];
    const params = token.info.trim().split(' ', 2)[0];
    // content
    let content;
    let errorMessage;
    try {
      // not use window.JSON5
      // eslint-disable-next-line
      content = token.content ? JSON5.parse(token.content) : {};
    } catch (err) {
      errorMessage = err.message;
    }
    // error
    if (errorMessage) {
      return `<div class="alert-danger">
<p><strong>${blockTitle}: ${md.utils.escapeHtml(params)}</strong></p>
<p>${md.utils.escapeHtml(errorMessage)}</p>
<pre><code>${md.utils.escapeHtml(token.content)}</code></pre>
</div>
`;
    }
    // render
    if (!params) {
      // placeholder
      const res = window.JSON5.stringify(content, null, 2);
      return `<div class="alert-info">
<p><strong>${blockTitle}: ${md.utils.escapeHtml(params)}</strong></p>
<pre><code>${md.utils.escapeHtml(res)}</code></pre>
</div>
`;
    }
    // register
    return options.utils.register({ params, content });
  }

  function blockRuler(state, startLine, endLine, silent) {
    let marker,
      len,
      params,
      nextLine,
      mem,
      token,
      markup,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }
    if (pos + 3 > max) {
      return false;
    }
    // eslint-disable-next-line
    marker = state.src.charCodeAt(pos);
    if (marker !== 0x24 /* $ */) {
      return false;
    }
    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);
    len = pos - mem;
    if (len < 3) {
      return false;
    }
    // eslint-disable-next-line
    markup = state.src.slice(mem, pos);
    // eslint-disable-next-line
    params = state.src.slice(pos, max);
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
    // Since start is found, we can report success here in validation mode
    if (silent) {
      return true;
    }
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
      if (state.src.charCodeAt(pos) !== marker) {
        continue;
      }
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }
      pos = state.skipChars(pos, marker);
      // closing code fence must be at least as long as the opening one
      if (pos - mem < len) {
        continue;
      }
      // make sure tail has spaces only
      pos = state.skipSpaces(pos);
      if (pos < max) {
        continue;
      }
      haveEndMarker = true;
      // found!
      break;
    }
    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    // eslint-disable-next-line
    token = state.push('cabloy_block', 'div', 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];
    return true;
  }

  md.block.ruler.before('fence', 'cabloy_block', blockRuler, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });
  md.renderer.rules.cabloy_block = blockRender;
};
