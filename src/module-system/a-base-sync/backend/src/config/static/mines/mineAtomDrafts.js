module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // actionPath
  const options = {
    stage: 'draft',
    mine: 1,
  };
  const actionPath = `/a/basefront/atom/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Drafts',
    atomStaticKey: 'mineAtomDrafts',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Atom',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: moduleInfo.relativeName,
          name: 'drafts',
        },
        color: 'orange',
      },
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
