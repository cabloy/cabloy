// const moduleInfo = module.info;

const content = {
  info: {
    layout: {},
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-baseadmin',
            name: 'userItemLayoutBlockDefaultTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baseadmin',
            name: 'userItemLayoutBlockDefaultSubnavbar',
          },
        },
      },
    },
  },
};
const layout = {
  atomName: 'User',
  atomStaticKey: 'layoutAtomItemUser',
  atomRevision: 0,
  description: '',
  layoutTypeCode: 4,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
