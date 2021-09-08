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
      openSource(options);
    },
  });
}

function openSource(options) {
  const { ctx } = options;
  ctx.$nextTick(() => {
    ctx._setViewMode('source');
  });
  return true;
}
