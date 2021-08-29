import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export function speckle() {
  const specklePlugin = new Plugin({
    state: {
      init(_, { doc }) {
        const speckles = [];
        for (let pos = 1; pos < doc.content.size; pos += 4) {
          speckles.push(Decoration.inline(pos - 1, pos, { style: 'background: yellow' }));
        }
        return DecorationSet.create(doc, speckles);
      },
      apply(tr, set) {
        return set.map(tr.mapping, tr.doc);
      },
    },
    props: {
      decorations(state) {
        return specklePlugin.getState(state);
      },
    },
  });
  return specklePlugin;
}
