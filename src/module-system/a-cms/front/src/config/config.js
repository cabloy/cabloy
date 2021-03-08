export default {
  atoms: {
    article: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'sticky', title: 'Sticky', by: 'desc' },
              { name: 'sorting', title: 'Sorting', by: 'asc' },
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
