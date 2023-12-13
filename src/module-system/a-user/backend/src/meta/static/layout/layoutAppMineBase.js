module.exports = app => {
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
            autoInit: false,
          },
        },
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
          mineSubHeader: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListMineSubHeader',
            },
          },
          mineBody: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListMineBody',
            },
          },
          mineFooter: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockListMineFooter',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAppMineBase',
    atomRevision: 6,
    description: '',
    layoutTypeCode: 14,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
