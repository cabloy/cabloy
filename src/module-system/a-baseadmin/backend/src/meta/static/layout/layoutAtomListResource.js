// const moduleInfo = module.info;

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
              renderType: 'atomName',
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
              renderType: 'icon',
              params: {
                size: 24,
              },
            },
            {
              dataIndex: 'userIdCreated',
              title: 'Creator',
              align: 'left',
              renderType: 'userName',
            },
            {
              dataIndex: 'atomCreatedAt',
              title: 'Created Time',
              align: 'center',
              params: {
                dateFormat: {
                  lines: true,
                },
              },
            },
            {
              dataIndex: 'atomUpdatedAt',
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
  atomRevision: 9,
  description: '',
  layoutTypeCode: 3,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
