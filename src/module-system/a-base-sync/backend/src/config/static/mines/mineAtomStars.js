module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // actionPath
  const options = {
    stage: 'formal',
    star: 1,
  };
  const actionPath = `/a/basefront/atom/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Stars',
    atomStaticKey: 'mineAtomStars',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Atom',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: moduleInfo.relativeName,
          name: 'stars',
        },
        color: 'orange',
      },
    }),
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
