console.log(requirejs);
(function () {
  util.article.mountMarkdown = function ($container) {
    const $blocks = $('.markdown-it-cabloy-block', $container);
    for (let i = 0; i < $blocks.length; i++) {
      _mountBlock($blocks[i]);
    }
  };

  function _mountBlock($blockContainer) {
    // const blockParams = this._getBlockParams(blockContainer);
    // const blockContent = this._getBlockContent(blockContainer);
    // if (!blockParams || !blockContent) return;
    // // Block Class
    // // const BlockClass = await this._getBlockClass(blockParams);
    // if (!BlockClass) {
    //   // do nothing
    //   return;
    // }
    // // host
    // const host = this._getHost(blockContainer, blockContent);
    // // Block Instance
    // const blockInstance = new BlockClass(host);
    // // mount
    // if (blockInstance.mount) {
    //   // await blockInstance.mount();
    // }
  }
})();

$(document).ready(function () {});
