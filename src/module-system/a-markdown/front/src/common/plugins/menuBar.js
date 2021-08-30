import { Plugin } from 'prosemirror-state';

class MenuBarView {
  constructor(editorView, options) {
    this.editorView = editorView;
    this.options = options;
    this.update();
  }

  update() {
    this._checkUpdate(this.editorView.state);
  }

  destroy() {
    // do nothing
  }

  _checkUpdate(state) {
    const { menuItems } = this.options;
    for (const items of menuItems) {
      this._checkUpdateMenuItems(state, items);
    }
  }

  _checkUpdateMenuItems(state, items) {
    let something = false;
    for (const item of items) {
      console.log(item.spec);
      const up = this._checkUpdateMenuItem(state, item);
      if (up) {
        something = true;
      }
    }
    return something;
  }

  _checkUpdateMenuItem(state, item) {
    const { ctx } = this.options;
    const spec = item.spec;
    // select
    let selected = true;
    if (spec.select) {
      selected = spec.select(state);
    }
    ctx.$set(item, 'selected', selected);
    if (!selected) return false;
    // enable
    let enabled = true;
    if (spec.enable) {
      enabled = spec.enable(state) || false;
    }
    ctx.$set(item, 'enabled', enabled);
    // active
    let active = false;
    if (spec.active) {
      active = (enabled && spec.active(state)) || false;
    }
    ctx.$set(item, 'active', active);
    return true;
  }
}

export function menuBar(options) {
  return new Plugin({
    view(editorView) {
      return new MenuBarView(editorView, options);
    },
  });
}
