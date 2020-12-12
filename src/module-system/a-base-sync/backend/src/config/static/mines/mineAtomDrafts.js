module.exports = app => {
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
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
