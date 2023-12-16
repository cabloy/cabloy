// const moduleInfo = module.info;

const content = {
  info: {
    layout: {
      viewSize: {
        small: 'list',
        medium: 'list',
        large: 'list',
      },
    },
  },
  layouts: {
    base: {
      blocks: {
        subnavbar: false,
      },
    },
    list: {},
  },
};
const layout = {
  atomName: 'Base',
  atomStaticKey: 'layoutMessageListBase',
  atomRevision: 1,
  description: '',
  layoutTypeCode: 8,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
