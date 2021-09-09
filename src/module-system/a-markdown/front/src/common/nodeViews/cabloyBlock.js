export class CabloyBlockView {
  constructor(node, view, getPos, ctx) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.ctx = ctx;
    this.BlockParams = null;
    this.BlockClass = null;
    this.blockInstance = null;

    this.blockContainer = document.createElement('div');
    this.blockContainer.className = 'markdown-it-cabloy-block';
    this.blockContainer.setAttribute('data-block-params', node.attrs.params);
    this.blockContainer.setAttribute('data-block-content', encodeURIComponent(node.attrs.content));
    this.dom = this.blockContainer;

    window.setTimeout(() => {
      this._mountBlock();
    }, 0);

    // not set contentDOM
    // this.contentDOM = this.checkbox;
  }
  destroy() {
    this._unmountBlock().then(() => {
      this.blockContainer = null;
    });
  }
  update(node) {
    if (node.type !== this.node.type) return false;
    // content
    const contentOld = this.node.attrs.content;
    const contentNew = node.attrs.content;
    this.node = node;
    // changed
    if (contentOld !== contentNew) {
      window.setTimeout(() => {
        this._unmountBlock().then(() => {
          this._mountBlock();
        });
      }, 0);
    }
    return true;
  }
  _initBlockParams() {
    if (this.BlockParams) return this.BlockParams;
    if (!this.node.attrs.params) return null;
    const [module, blockName] = this.node.attrs.params.split(':');
    if (!module || !blockName) return null;
    this.BlockParams = { module, blockName };
    return this.BlockParams;
  }
  _getHost() {
    const $util = this.ctx.$meta.util.hostUtil({
      locale: this.ctx.$meta.util.getProperty(this.ctx.host2, 'atom.atomLanguage'),
    });
    return {
      $host: this.ctx.host2, // atomId/atom
      $container: this.blockContainer,
      $content: window.JSON5.parse(this.node.attrs.content),
      $util,
    };
  }

  async _mountBlock() {
    // params
    const BlockParams = this._initBlockParams();
    if (!BlockParams) return;
    // use module
    await this.ctx.$meta.module.use(BlockParams.module);
    // Block Class
    const BlockClass = await this._initBlockClass();
    if (!BlockClass) {
      // do nothing
      return;
    }
    // host
    const host = this._getHost();
    // Block Instance
    this.blockInstance = new BlockClass(host);
    // render
    if (this.blockInstance.render) {
      let content = this.blockInstance.render();
      content = await this.ctx.$meta.util.wrapPromise(content);
      if (content) {
        this.blockContainer.innerHTML = content;
      }
    }
    // mount
    if (this.blockInstance.mount) {
      const res = this.blockInstance.mount();
      await this.ctx.$meta.util.wrapPromise(res);
    }
  }

  async _unmountBlock() {
    if (this.blockInstance) {
      if (this.blockInstance.unmount) {
        const res = this.blockInstance.unmount();
        await this.ctx.$meta.util.wrapPromise(res);
      }
      this.blockInstance = null;
    }
    if (this.blockContainer) {
      this.blockContainer.innerHTML = '';
    }
  }

  _initBlockClass() {
    if (this.BlockClass) return Promise.resolve(this.BlockClass);
    return new Promise(resolve => {
      const { module, blockName } = this.BlockParams;
      const block_js = `api/static/${module.replace('-', '/')}/blocks/${blockName}/main`;
      this.ctx.$meta.util.requirejs.require([block_js], BlockClass => {
        this.BlockClass = BlockClass;
        resolve(BlockClass);
      });
    });
  }
}
