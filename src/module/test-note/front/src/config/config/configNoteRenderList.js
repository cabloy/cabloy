const list = {
  info: {
    layout: {
      viewSize: {
        small: [{ name: 'list' }, { name: 'card' }],
        medium: [{ name: 'card' }, { name: 'table' }],
        large: [{ name: 'card' }, { name: 'table' }],
      },
    },
  },
  layouts: {
    card: {
      title: 'LayoutCard',
      component: {
        module: 'test-note',
        name: 'listLayoutCard',
      },
      blocks: {
        items: {
          component: {
            module: 'test-note',
            name: 'listLayoutBlockCardItems',
          },
        },
      },
    },
  },
};
export default list;
