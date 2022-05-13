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
        blocks: {},
      },
      list: {
        blocks: {
          // items: {
          //   component: {
          //     module: 'a-app',
          //     name: 'appListLayoutBlockBoxGrid9Items',
          //   },
          // },
        },
      },
    },
  };
  const layout = {
    atomName: 'System',
    atomStaticKey: 'layoutAppMenuSystem',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
