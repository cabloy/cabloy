module.exports = {
  meta: {
    name: 'iframe',
    title: 'Embed Page',
    validator: 'blockIFrame',
  },
  data: {
    default: {
      url: '',
      width: '',
      height: '',
    },
  },
  render({ md, options, block, token, index, content }) {
    const url = md.utils.escapeHtml(content.url);
    const width = md.utils.escapeHtml(content.width || '100%');
    const height = md.utils.escapeHtml(content.height || '300px');
    return `<div class="block-iframe" style="width:${width};height:${height};"><iframe width="100%" height="100%" scrolling="auto" frameborder="0" src="${url}"></iframe></div>\n`;
  },
};
