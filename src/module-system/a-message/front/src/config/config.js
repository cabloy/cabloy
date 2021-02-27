export default {
  notification: {
    closeTimeout: -1,
  },
  message: {
    render: {
      group: {
        layouts: {
          list: {
            component: {
              module: 'a-message',
              name: 'messageGroupLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-message',
                  name: 'messageGroupLayoutBlockListTitle',
                },
              },
              items: {
                component: {
                  module: 'a-message',
                  name: 'messageGroupLayoutBlockListItems',
                },
              },
            },
          },
        },
      },
      list: {
        layouts: {
          list: {
            component: {
              module: 'a-message',
              name: 'messageListLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-message',
                  name: 'messageListLayoutBlockListTitle',
                },
              },
              items: {
                component: {
                  module: 'a-message',
                  name: 'messageListLayoutBlockListItems',
                },
              },
            },
          },
        },
      },
    },
  },
};
