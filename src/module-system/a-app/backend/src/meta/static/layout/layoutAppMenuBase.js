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
        providerOptions: {
          providerName: 'all',
          autoInit: true,
        },
        subnavbar: false,
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
    atomRevision: 4,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
