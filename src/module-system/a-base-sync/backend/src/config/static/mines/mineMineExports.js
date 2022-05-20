module.exports = app => {
  const actionPath = '/a/user/user/exports';
  // resource
  const resource = {
    atomName: 'Exports',
    atomStaticKey: 'mineMineExports',
    atomRevision: 2,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceIcon: '::export',
    appKey: 'a-app:appDefault',
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
