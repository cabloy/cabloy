module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Exports',
    atomStaticKey: 'mineMineExports',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
