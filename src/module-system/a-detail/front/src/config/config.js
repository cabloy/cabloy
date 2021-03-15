export default {
  detail: {
    render: {
      list: {
        info: {
        },
        layouts: {
          list: {
            component: {
              module: 'a-detail',
              name: 'listLayoutList',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-detail',
                  name: 'listLayoutBlockListTitle',
                },
              },
              items: {
                component: {
                  module: 'a-detail',
                  name: 'listLayoutBlockListItems',
                },
              },
            },
          },
          table: {
            component: {
              module: 'a-detail',
              name: 'listLayoutTable',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-detail',
                  name: 'listLayoutBlockTableTitle',
                },
              },
              items: {
                component: {
                  module: 'a-detail',
                  name: 'listLayoutBlockTableItems',
                },
                columns: [
                  {
                    dataIndex: 'detailLineNo',
                    title: '#',
                    align: 'left',
                  },
                  {
                    dataIndex: 'detailCode',
                    title: 'Code',
                    align: 'left',
                  },
                  {
                    dataIndex: 'detailName',
                    title: 'Name',
                    align: 'left',
                  },
                ],
              },
              bottombar: {
                component: {
                  module: 'a-detail',
                  name: 'listLayoutBlockTableBottombar',
                },
              },
            },
          },
        },
      },
      item: {
        info: {
        },
        layouts: {
          mobile: {
            component: {
              module: 'a-detail',
              name: 'itemLayoutMobile',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-detail',
                  name: 'itemLayoutBlockMobileTitle',
                },
              },
              main: {
                component: {
                  module: 'a-detail',
                  name: 'itemLayoutBlockMobileMain',
                },
              },
            },
          },
          pc: {
            component: {
              module: 'a-detail',
              name: 'itemLayoutPC',
            },
            blocks: {
              title: {
                component: {
                  module: 'a-detail',
                  name: 'itemLayoutBlockPCTitle',
                },
              },
              main: {
                component: {
                  module: 'a-detail',
                  name: 'itemLayoutBlockMobileMain',
                },
              },
            },
          },
        },
      },
    },
  },
};
