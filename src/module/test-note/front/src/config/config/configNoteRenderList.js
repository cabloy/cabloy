const list = {
  info: {
    layout: {
      viewSize: {
        small: [
          { name: 'list', title: 'List' },
          { name: 'card', title: 'Card' },
        ],
        medium: [
          { name: 'card', title: 'Card' },
          { name: 'table', title: 'Table' },
        ],
        large: [
          { name: 'card', title: 'Card' },
          { name: 'table', title: 'Table' },
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
