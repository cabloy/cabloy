module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // actionPath
  const actionPath = '/a/basefront/atom/starTabs';
  // resource
  const resource = {
    atomName: 'StarsLabels',
    atomStaticKey: 'mineAtomStars',
    atomRevision: 9,
    atomCategoryId: 'a-base:mine.Atom',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: moduleInfo.relativeName,
          name: 'starsLabels',
        },
        color: 'auto',
      },
    }),
    resourceIcon: ':outline:star-outline',
    appKey: 'a-app:appDefault',
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
