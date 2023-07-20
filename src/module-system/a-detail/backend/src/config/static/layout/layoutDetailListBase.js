module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'list',
            medium: 'table',
            large: 'table',
          },
          edit: {
            small: 'list',
            medium: 'table',
            large: 'table',
          },
        },
      },
      filter: false,
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
              module: 'a-baselayout',
              name: 'baseLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
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
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            enableTableHeight: false,
            sorter: false,
            columns: [
              {
                dataIndex: 'detailLineNo',
                title: '#',
                align: 'center',
                width: 50,
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
  const layout = {
    atomName: 'Base(Details)',
    atomStaticKey: 'layoutDetailListBase',
    atomRevision: 4,
    description: '',
    layoutTypeCode: 5,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
