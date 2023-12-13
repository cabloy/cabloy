module.exports = app => {
  // const moduleInfo = module.info;
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'boxGrid9',
          medium: 'boxGrid9',
          large: 'boxGrid9',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      boxGrid9: {
        title: 'LayoutBoxGrid9',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
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
              name: 'appListLayoutBlockBoxGrid9Items',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Default',
    atomStaticKey: 'layoutAppMenuDefault',
    atomRevision: 3,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
