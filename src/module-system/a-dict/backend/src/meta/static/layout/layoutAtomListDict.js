// const moduleInfo = module.info;

const content = {
  layouts: {
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
              dataIndex: 'description',
              title: 'Description',
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
  atomName: 'Dict',
  atomStaticKey: 'layoutAtomListDict',
  atomRevision: 3,
  description: '',
  layoutTypeCode: 3,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
