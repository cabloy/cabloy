module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [],
    },
    layouts: {
      list: {
        subnavbar: {
          render: true,
          enable: false,
        },
        blocks: {
          items: {
            component: {
              module: 'a-baseadmin',
              name: 'roleRightListLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Atom Right',
    atomStaticKey: 'layoutAtomListRoleRight',
    atomRevision: 8,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
