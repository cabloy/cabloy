export class HtmlInlineView {
  constructor(node, view, getPos) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.addEventListener('change', event => {
      const { checked } = event.target;
      const start = this.getPos() + 1;
      const tr = this.view.state.tr.replaceWith(start + change.from, start + change.to, change.text ? this.view.state.schema.text(change.text) : null);
      this.view.dispatch(tr);

      if (editor.isEditable && typeof getPos === 'function') {
        editor
          .chain()
          .focus()
          .command(({ tr }) => {
            tr.setNodeMarkup(getPos(), undefined, {
              checked,
            });
            return true;
          })
          .run();
      }
    });

    if (node.attrs.checked) {
      this.checkbox.setAttribute('checked', 'checked');
    }

    this.dom = this.checkbox;
    // not set contentDOM
    // this.contentDOM = this.checkbox;
  }
  // }
  // nodeview_update{
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
  // }
  // nodeview_end{
}
