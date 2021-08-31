import { Plugin } from 'prosemirror-state';

class PlaceholderEmptyView {
  constructor(editorView, options) {
    this.editorView = editorView;
    this.options = options;
    this.placeholderText = options.placeholderText;
    this.placeholderId = options.ctx.$meta.util.nextId('placeholder');
    this.placeholderKey = { key: 'placeholder$' };
    this.showing = false;
    this.update();
  }

  update() {
    this._checkUpdate(this.editorView, this.editorView.state);
  }

  destroy() {
    // do nothing
  }

  _checkUpdate(view, state) {
    if (state.doc.content.size <= 2 && !this.showing) {
      this.showing = true;
      window.setTimeout(() => {
        const widget = document.createElement('placeholder');
        widget.classList = 'text-editor-placeholder';
        widget.innerText = this.placeholderText;
        const action = {
          add: {
            id: this.placeholderId,
            widget,
            pos: 0,
          },
        };
        view.dispatch(state.tr.setMeta(this.placeholderKey, action));
      }, 0);
    } else if (state.doc.content.size > 2 && this.showing) {
      this.showing = false;
      window.setTimeout(() => {
        const action = {
          remove: {
            id: this.placeholderId,
          },
        };
        view.dispatch(state.tr.setMeta(this.placeholderKey, action));
      }, 0);
    }
  }
}

export function placeholderEmpty(options) {
  return new Plugin({
    view(editorView) {
      return new PlaceholderEmptyView(editorView, options);
    },
  });
}
