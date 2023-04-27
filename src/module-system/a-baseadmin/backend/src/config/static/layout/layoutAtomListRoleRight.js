module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [],
    },
    layouts: {
      list: {
        blocks: {
          items: {
            component: {
              module: 'a-baseadmin',
              name: 'roleRightListLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baseadmin',
              name: 'roleRightListLayoutBlockListItem',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Atom Right',
    atomStaticKey: 'layoutAtomListRoleRight',
    atomRevision: 9,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
