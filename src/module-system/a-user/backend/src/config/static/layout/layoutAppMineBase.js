module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
          edit: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
        },
      },
    },
    layouts: {
      base: {
        blocks: {
          main: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockDefaultMain',
            },
          },
        },
      },
      default: {
        subnavbar: false,
        blocks: {
          mineHeader: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockDefaultMineHeader',
            },
          },
          mineBody: {
            component: {
              module: 'a-user',
              name: 'appMineLayoutBlockDefaultMineBody',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAppMineBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 14,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
