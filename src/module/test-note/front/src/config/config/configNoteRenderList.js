const list = {
  info: {
    layout: {
      viewSize: {
        small: [{ name: 'card' }, { name: 'list' }],
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
        item: {
          component: {
            module: 'a-baselayout',
            name: 'listLayoutBlockListItem',
          },
        },
      },
    },
  },
};
export default list;
