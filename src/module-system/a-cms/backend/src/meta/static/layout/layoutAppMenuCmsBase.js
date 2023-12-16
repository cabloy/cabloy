// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    layouts: {
      list: {
        blocks: {
          items: {
            component: {
              module: 'a-cms',
              name: 'appCmsBaseMenuLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'CMS(Base)',
    atomStaticKey: 'layoutAppMenuCmsBase',
    atomRevision: 1,
    description: '',
    layoutTypeCode: 13,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
