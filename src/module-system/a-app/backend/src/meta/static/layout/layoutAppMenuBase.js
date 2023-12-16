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
        title: {
          component: {
            module: 'a-baselayout',
            name: 'baseLayoutBlockListTitle',
          },
        },
        subnavbar: false,
      },
    },
    list: {
      options: {
        dataProvider: {
          providerName: 'all',
          autoInit: true,
        },
      },
      blocks: {
        items: {
          component: {
            module: 'a-app',
            name: 'appMenuLayoutBlockListItems',
          },
        },
      },
    },
  },
};
const layout = {
  atomName: 'Base',
  atomStaticKey: 'layoutAppMenuBase',
  atomRevision: 7,
  description: '',
  layoutTypeCode: 13,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
