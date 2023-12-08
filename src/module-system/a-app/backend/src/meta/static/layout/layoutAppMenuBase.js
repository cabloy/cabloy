module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
    atomRevision: 6,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
