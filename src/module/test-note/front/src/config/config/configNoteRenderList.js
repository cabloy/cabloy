const list = {
  info: {
    layout: {
      viewSize: {
        small: [
          { name: 'list', title: 'LayoutList' },
          { name: 'card', title: 'LayoutCard' },
        ],
        medium: [
          { name: 'card', title: 'LayoutCard' },
          { name: 'table', title: 'LayoutTable' },
        ],
        large: [
          { name: 'card', title: 'LayoutCard' },
          { name: 'table', title: 'LayoutTable' },
        ],
      },
    },
  },
  layouts: {
    card: {
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
