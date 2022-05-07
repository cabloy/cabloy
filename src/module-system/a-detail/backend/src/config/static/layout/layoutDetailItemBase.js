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
        blocks: {},
      },
      default: {
        title: 'LayoutDefault',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutDefault',
        },
        subnavbar: {
          policyDefault: false,
        },
        blocks: {},
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutDetailItemBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 6,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
