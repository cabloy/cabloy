import { Plugin } from 'prosemirror-state';

export function markdownStyle() {
  const markdownStylePlugin = new Plugin({
    props: {
      attributes: { class: 'markdown-body' },
    },
  });
  return markdownStylePlugin;
}
