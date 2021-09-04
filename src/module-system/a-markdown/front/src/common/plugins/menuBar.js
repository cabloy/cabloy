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
    let selected = false;
    let enabled = false;
    for (const item of items) {
      const [_selected, _enabled] = this._checkUpdateMenuItem(state, item);
      if (_selected) {
        selected = _selected;
      }
      if (_enabled) {
        enabled = _enabled;
      }
    }
    return [selected, enabled];
  }

  _checkUpdateMenuItem(state, item) {
    const { ctx } = this.options;
    const spec = item.spec;
    if (spec.popup) {
      const [selected, enabled] = this._checkUpdateMenuItems(state, spec.menuItems);
      ctx.$set(item, 'selected', selected);
      if (!selected) return [false, false];
      // enable
      ctx.$set(item, 'enabled', enabled);
      // active
      ctx.$set(item, 'active', false);
      return [selected, enabled];
    }
    // select
    let selected = true;
    if (spec.select) {
      selected = spec.select(state);
    }
    ctx.$set(item, 'selected', selected);
    if (!selected) return [false, false];
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
    return [selected, enabled];
  }
}

export function menuBar(options) {
  return new Plugin({
    view(editorView) {
      return new MenuBarView(editorView, options);
    },
  });
}
