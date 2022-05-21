module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    layouts: {
      list: {},
    },
  };
  const layout = {
    atomName: 'Default',
    atomStaticKey: 'layoutAppMineDefault',
    atomRevision: -1,
    description: '',
    layoutTypeCode: 14,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
