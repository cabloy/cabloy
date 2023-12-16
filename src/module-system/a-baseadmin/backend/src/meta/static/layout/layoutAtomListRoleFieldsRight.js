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
              name: 'roleFieldsRightListLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baseadmin',
              name: 'roleFieldsRightListLayoutBlockListItem',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Fields Right',
    atomStaticKey: 'layoutAtomListRoleFieldsRight',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
