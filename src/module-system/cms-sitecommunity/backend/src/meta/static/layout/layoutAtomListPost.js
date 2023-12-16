// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    info: {
      orders: [{ name: 'sticky', title: 'Sticky', by: 'desc', tableAlias: 'p' }],
    },
  };
  const layout = {
    atomName: 'CMSPostTitle',
    atomStaticKey: 'layoutAtomListPost',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
