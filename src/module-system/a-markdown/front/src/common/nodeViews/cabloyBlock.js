export class HtmlInlineView {
  constructor(node, view, getPos) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.blockContainer = document.createElement('div');
    this.blockContainer.className = 'markdown-it-cabloy-block';
    this.blockContainer.setAttribute('data-block-params', node.attrs.params);
    this.blockContainer.setAttribute('data-block-content', encodeURIComponent(node.attrs.content));
    this.dom = this.blockContainer;
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
}
