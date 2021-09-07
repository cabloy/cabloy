export class HtmlInlineView {
  constructor(node, view, getPos) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this._eventHandlerChange = this._onChange.bind(this);
    this.checkbox.addEventListener('change', this._eventHandlerChange);

    if (node.attrs.checked) {
      this.checkbox.setAttribute('checked', 'checked');
    }

    this.dom = this.checkbox;
    // not set contentDOM
    // this.contentDOM = this.checkbox;
  }
  destroy() {
    if (this.checkbox) {
      this.checkbox.removeEventListener('change', this._eventHandlerChange);
      this.checkbox = null;
      this._eventHandlerChange = null;
    }
  }
  _onChange(event) {
    const { checked } = event.target;
    const tr = this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {
      checked,
    });
    this.view.dispatch(tr);
  }
  update(node) {
    if (node.type !== this.node.type) return false;
    this.node = node;
    // checked
    if (this.node.attrs.checked) {
      this.checkbox.setAttribute('checked', 'checked');
    } else {
      this.checkbox.removeAttribute('checked');
    }
    return true;
  }
}
