// const moduleInfo = module.info;
module.exports = app => {
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
              name: 'roleItemLayoutBlockDefaultTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baseadmin',
              name: 'roleItemLayoutBlockDefaultSubnavbar',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Role',
    atomStaticKey: 'layoutAtomItemRole',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
