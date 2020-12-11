module.exports = app => {
  // actionPath
  const options = {
    stage: 'draft',
    mine: 1,
  };
  const actionPath = `/a/basefront/atom/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  console.log(actionPath);
  // resource
  const resource = {
    atomName: 'Drafts',
    atomStaticKey: 'mineDrafts',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Atom',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
  };
  return resource;
};
