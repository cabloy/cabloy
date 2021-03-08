export default {
  atoms: {
    post: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'sticky', title: 'Sticky', by: 'desc' },
            ],
          },
        },
        item: {
          layouts: {
            mobile: {
              blocks: {
                main: {
                  component: {
                    module: 'a-cms',
                    name: 'itemLayoutBlockMobileMain',
                  },
                },
              },
            },
            pc: {
              blocks: {
                main: {
                  component: {
                    module: 'a-cms',
                    name: 'itemLayoutBlockMobileMain',
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
