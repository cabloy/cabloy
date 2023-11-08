module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // atomInfo
  schemas.atomInfo = {
    type: 'object',
    properties: {
      __groupCreateInfo: {
        ebType: 'group-flatten',
        ebTitle: 'CreateInfo',
      },
      userId: {
        ebType: 'userName',
        ebTitle: 'Username',
      },
      atomName: {
        ebType: 'text',
        ebTitle: 'Username',
      },
      __groupModificationInfo: {
        ebType: 'group-flatten',
        ebTitle: 'ModificationInfo',
      },
    },
  };
  return schemas;
};
