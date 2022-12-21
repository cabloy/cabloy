module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      orders: [
        { name: 'resourceType', title: 'Resource Type', by: 'asc' },
        { name: 'resourceSorting', title: 'Resource Sorting', by: 'asc' },
      ],
    },
    layouts: {
      list: {},
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'resourceType',
                title: 'Resource Type',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record.resourceTypeLocale',
                  },
                },
              },
              {
                dataIndex: 'atomCategoryNameLocale',
                title: 'Category',
                align: 'left',
              },
              {
                dataIndex: 'appKey',
                title: 'App Key',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record.appNameLocale',
                  },
                },
              },
              {
                dataIndex: 'resourceIcon',
                title: 'Icon',
                align: 'left',
                component: {
                  module: 'a-baserender',
                  name: 'renderTableCellIcon',
                  options: {
                    props: {
                      size: 24,
                    },
                  },
                },
              },
              {
                dataIndex: 'userName',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellUserName',
                },
              },
              {
                dataIndex: 'createdAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'updatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Resource',
    atomStaticKey: 'layoutAtomListResource',
    atomRevision: 4,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
