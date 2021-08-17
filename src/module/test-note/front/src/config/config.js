export default {
  atoms: {
    note: {
      render: {
        list: {
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
