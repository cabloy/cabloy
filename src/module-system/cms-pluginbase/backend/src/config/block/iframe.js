module.exports = {
  meta: {
    name: 'iframe',
    title: 'Embed Page',
    validator: 'blockIFrame',
  },
  render({ md, token, content, block }) {
    const url = md.utils.escapeHtml(content.url);
    const width = md.utils.escapeHtml(content.width || '100%');
    const height = md.utils.escapeHtml(content.height || '300px');
    return `<div style="width:${width};height:${height};margin:auto;"><iframe width="100%" height="100%" scrolling="auto" frameborder="0" src="${url}"></iframe></div>\n`;
  },
};
