// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
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
    atomRevision: 10,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
