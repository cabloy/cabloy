export default {
  atoms: {
    note: {
      render: {
        list: {
          info: {
            layout: {
              viewSize: {
                small: [
                  { name: 'list', title: 'List' },
                  { name: 'table', title: 'Table' },
                ],
                medium: [
                  { name: 'list', title: 'List' },
                  { name: 'table', title: 'Table' },
                ],
                large: [
                  { name: 'list', title: 'List' },
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
        },
      },
    },
  },
};
