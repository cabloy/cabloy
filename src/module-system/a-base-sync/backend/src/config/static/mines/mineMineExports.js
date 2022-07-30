module.exports = app => {
  const actionPath = '/a/user/user/exports';
  // resource
  const resource = {
    atomName: 'Exports',
    atomStaticKey: 'mineMineExports',
    atomRevision: 4,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceIcon: '::export',
    appKey: 'a-appbooster:appGeneral',
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
