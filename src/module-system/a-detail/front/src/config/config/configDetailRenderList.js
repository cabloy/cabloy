const list = {
  info: {
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
