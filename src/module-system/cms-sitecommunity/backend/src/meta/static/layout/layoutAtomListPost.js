module.exports = app => {
  // const moduleInfo = module.info;
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
