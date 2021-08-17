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
                caption: {
                  component: {
                    module: 'a-baselayout',
                    name: 'listLayoutBlockListCaption',
                  },
                },
                title: {
                  component: {
                    module: 'a-baselayout',
                    name: 'listLayoutBlockListTitle',
                  },
                },
                subnavbar: {
                  component: {
                    module: 'a-baselayout',
                    name: 'listLayoutBlockListSubnavbar',
                  },
                },
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
