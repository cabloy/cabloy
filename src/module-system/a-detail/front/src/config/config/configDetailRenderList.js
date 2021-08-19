const list = {
  info: {
    layout: {
      viewSize: {
        small: { name: 'list' },
        medium: { name: 'table' },
        large: { name: 'table' },
      },
    },
    data: {
      adapter: {
        component: {
          module: 'a-detail',
          name: 'listLayoutDataAdapter',
        },
        providers: {
          all: {
            component: {
              module: 'a-detail',
              name: 'listLayoutDataProviderAll',
            },
          },
        },
      },
    },
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-detail',
            name: 'listLayoutBlockListTitle',
          },
        },
      },
    },
    list: {
      title: 'LayoutList',
      component: {
        module: 'a-detail',
        name: 'listLayoutList',
      },
      blocks: {
        items: {
          component: {
            module: 'a-detail',
            name: 'listLayoutBlockListItems',
          },
        },
      },
    },
    table: {
      title: 'LayoutTable',
      component: {
        module: 'a-detail',
        name: 'listLayoutTable',
      },
      blocks: {
        items: {
          component: {
            module: 'a-detail',
            name: 'listLayoutBlockTableItems',
          },
          columns: [
            {
              dataIndex: 'detailLineNo',
              title: '#',
              align: 'center',
              width: '50px',
              component: {
                module: 'a-detail',
                name: 'listLayoutTableCellDetailLineNo',
              },
            },
            {
              dataIndex: 'detailName',
              title: 'Name',
              align: 'left',
              component: {
                module: 'a-detail',
                name: 'listLayoutTableCellDetailName',
              },
            },
          ],
        },
      },
    },
  },
};
export default list;
