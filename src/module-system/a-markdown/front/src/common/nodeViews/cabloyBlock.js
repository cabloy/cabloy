import Vue from 'vue';
export class CabloyBlockView {
  constructor(node, view, getPos) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.BlockParams = null;
    this.BlockClass = null;
    this.blockInstance = null;

    this.blockContainer = document.createElement('div');
    this.blockContainer.className = 'markdown-it-cabloy-block';
    this.blockContainer.setAttribute('data-block-params', node.attrs.params);
    this.blockContainer.setAttribute('data-block-content', encodeURIComponent(node.attrs.content));
    this.dom = this.blockContainer;

    this._mountBlock();

    // not set contentDOM
    // this.contentDOM = this.checkbox;
  }
  destroy() {
    if (this.blockContainer) {
      this.blockContainer = null;
    }
  }
  update(node) {
    if (node.type !== this.node.type) return false;
    // content
    const contentOld = this.node.attrs.content;
    const contentNew = node.attrs.content;
    this.node = node;
    // changed
    if (contentOld !== contentNew) {
      // destroy old
      // init new
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
  async _mountBlock() {
    // params
    const BlockParams = this._initBlockParams();
    if (!BlockParams) return;
    // Block Class
    const BlockClass = await this._initBlockClass();
    if (!BlockClass) {
      // do nothing
      return;
    }
    // Block Instance
    this.blockInstance = new BlockClass();
    // render
    let content = this.blockInstance.render();
    content = await Vue.prototype.$meta.util.wrapPromise(content);
    if (content) {
      this.blockContainer.innerHTML = content;
    }
    // mount
    const host = {
      $container: this.blockContainer,
      $content: window.JSON5.parse(this.node.attrs.content),
    };
    const res = this.blockInstance.mount(host);
    await Vue.prototype.$meta.util.wrapPromise(res);
  }
  _initBlockClass() {
    if (this.BlockClass) return Promise.resolve(this.BlockClass);
    return new Promise(resolve => {
      const { module, blockName } = this.BlockParams;
      const block_js = `api/static/${module.replace('-', '/')}/blocks/${blockName}/main`;
      Vue.prototype.$meta.util.requirejs.require([block_js], BlockClass => {
        this.BlockClass = BlockClass;
        resolve(BlockClass);
      });
    });
  }
}
