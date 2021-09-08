import { MenuItem } from 'prosemirror-menu';

export const ButtonSource = {
  title: 'EditorButtonTitleSource',
  icon: { material: 'source' },
  onBuild: menuItemSource,
};

function menuItemSource(_, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return true;
    },
    run() {
      openSource();
    },
  });
}

function openSource() {
  return true;
}
