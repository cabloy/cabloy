module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {},
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-baseadmin',
              name: 'userItemLayoutBlockDefaultTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baseadmin',
              name: 'userItemLayoutBlockDefaultSubnavbar',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'User',
    atomStaticKey: 'layoutAtomItemUser',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
