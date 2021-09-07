import { MenuItem } from 'prosemirror-menu';
import { toggleMark } from 'prosemirror-commands';
import { markActive } from './utils.js';

export const ButtonLink = {
  mark: true,
  title: 'EditorButtonTitleLink',
  icon: { material: 'link' },
  onBuild: insertLinkItem,
};

function insertLinkItem(markType, options) {
  return new MenuItem({
    ...options,
    active(state) {
      return markActive(state, markType);
    },
    enable(state) {
      return !state.selection.empty;
    },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch);
        return true;
      }
      // navigate
      const { ctx } = options;
      ctx.$view.navigate(`/a/validation/validate?t=${Date.now()}`, {
        context: {
          params: {
            params: {
              module: 'a-markdown',
              validator: 'link',
            },
            title: ctx.$text('Create Link'),
            data: {
              href: '',
              title: '',
            },
            performValidate: true,
          },
          callback: (code, res) => {
            if (code === 200) {
              const attrs = res.data;
              toggleMark(markType, attrs)(view.state, view.dispatch);
              view.focus();
            }
            if (code === false) {
              view.focus();
            }
          },
        },
      });
    },
  });
}
