export default {
  atoms: {
    article: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' },
              { name: 'sorting', title: 'Sorting', by: 'asc', tableAlias: 'p' },
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
                  // iframe: false,
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
