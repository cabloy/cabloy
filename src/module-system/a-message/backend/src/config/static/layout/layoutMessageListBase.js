module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {},
      },
      list: {},
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageListBase',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 8,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
