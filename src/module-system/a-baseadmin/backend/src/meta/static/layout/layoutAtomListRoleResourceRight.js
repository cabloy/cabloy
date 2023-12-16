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
              name: 'roleResourceRightListLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baseadmin',
              name: 'roleResourceRightListLayoutBlockListItem',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Resource Right',
    atomStaticKey: 'layoutAtomListRoleResourceRight',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
