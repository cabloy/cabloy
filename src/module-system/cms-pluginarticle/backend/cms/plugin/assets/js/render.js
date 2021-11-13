(function () {
  const BlockClasses = [];

  util.article.mountMarkdown = function ($container) {
    const $blocks = $('.markdown-it-cabloy-block', $container);
    for (let i = 0; i < $blocks.length; i++) {
      _mountBlock($blocks[i]);
    }
  };

  function _mountBlock($blockContainer) {
    const blockParams = _getBlockParams($blockContainer);
    const blockContent = _getBlockContent($blockContainer);
    if (!blockParams || !blockContent) return;
    // Block Class
    _getBlockClass(blockParams).then(BlockClass => {
      if (!BlockClass) {
        // do nothing
        return;
      }
      // host
      const host = _getHost($blockContainer, blockContent);
      // Block Instance
      const blockInstance = new BlockClass(host);
      // mount
      if (blockInstance.mount) {
        blockInstance.mount();
      }
    });
  }

  function _getBlockParams($block) {
    const params = $block.getAttribute('data-block-params');
    if (!params) return null;
    const [module, blockName] = params.split(':');
    if (!module || !blockName) return null;
    return { params, module, blockName };
  }

  function _getBlockContent($block) {
    const content = $block.getAttribute('data-block-content');
    if (!content) return null;
    return window.JSON5.parse(decodeURIComponent(content));
  }

  function _getBlockClass(blockParams) {
    const { params, module, blockName } = blockParams;
    const BlockClass = BlockClasses[params];
    if (BlockClass) return Promise.resolve(BlockClass);
    return new Promise(resolve => {
      const block_js = `api/static/${module.replace('-', '/')}/blocks/${blockName}/main.min`;
      window.requirejs([block_js], BlockClass => {
        BlockClasses[params] = BlockClass;
        resolve(BlockClass);
      });
    });
  }

  function _getHost($blockContainer, blockContent) {
    const $host = {
      atom: env.article,
      atomId: env.article && env.article.atomId,
    };
    const $util = window.util.hostUtil({
      locale: $host.atom && $host.atom.atomLanguage,
    });
    return {
      $host, // atomId/atom
      $container: $blockContainer,
      $content: blockContent,
      $util,
    };
  }
})();
