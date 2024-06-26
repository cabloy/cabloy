const moduleInfo = module.info;

const content = {
  layouts: {
    list: {
      blocks: {
        items: {
          component: {
            module: moduleInfo.relativeName,
            name: 'appSystemMenuLayoutBlockListItems',
          },
        },
      },
    },
  },
};
const layout = {
  atomName: 'System',
  atomStaticKey: 'layoutAppMenuSystem',
  atomRevision: 2,
  description: '',
  layoutTypeCode: 13,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
