(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : null;
})(this, function () {
  class IFrame {
    constructor(host) {
      this.host = host;
    }

    render() {
      const { $content, $util } = this.host;
      const url = $util.escapeURL($content.url);
      const width = $util.escapeHtml($content.width || '100%');
      const height = $util.escapeHtml($content.height || '300px');
      return `<iframe style="width:${width};height:${height};" scrolling="auto" frameborder="0" src="${url}"></iframe>`;
    }
  }
  return IFrame;
});
