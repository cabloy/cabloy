export default {
  notification: {
    closeTimeout: -1,
  },
  messageGroup: {
    render: {
      list: {
        layouts: {
          list: {
            component: {
              module: 'a-flowtask',
              name: 'flowListLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowListLayoutBlockListTitle',
                },
              },
              items: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowListLayoutBlockListItems',
                },
              },
            },
          },
        },
      },
      item: {
        info: {
          attachment: true,
          comment: true,
        },
        layouts: {
          mobile: {
            component: {
              module: 'a-flowtask',
              name: 'flowLayoutMobile',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileTitle',
                },
              },
              subnavbar: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileSubnavbar',
                },
              },
              main: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileMain',
                },
              },
            },
          },
          pc: {
            component: {
              module: 'a-flowtask',
              name: 'flowLayoutPC',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockPCTitle',
                },
              },
              main: {
                component: {
                  module: 'a-flowtask',
                  name: 'flowLayoutBlockMobileMain',
                },
              },
            },
          },
        },
      },
    },
  },
};
