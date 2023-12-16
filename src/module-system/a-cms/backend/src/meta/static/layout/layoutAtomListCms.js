// const moduleInfo = module.info;

const content = {
  info: {
    orders: [
      { name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' },
      { name: 'sorting', title: 'Sorting', by: 'asc', tableAlias: 'p' },
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
              dataIndex: 'atomCategoryName',
              title: 'Category',
              align: 'left',
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
  atomName: 'CMS',
  atomStaticKey: 'layoutAtomListCms',
  atomRevision: 4,
  description: '',
  layoutTypeCode: 3,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
