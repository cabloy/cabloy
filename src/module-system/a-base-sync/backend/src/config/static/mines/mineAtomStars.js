module.exports = app => {
  // actionPath
  const options = {
    stage: 'archive',
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
    }),
    resourceRoles: 'root',
  };
  return resource;
};
