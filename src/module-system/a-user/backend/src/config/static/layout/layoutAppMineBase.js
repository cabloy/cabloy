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
          autoInit: false,
        },
        subnavbar: false,
        blocks: {
          items: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListItems',
            },
          },
          mineHeader: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListMineHeader',
            },
          },
          mineBody: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListMineBody',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAppMineBase',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 14,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
