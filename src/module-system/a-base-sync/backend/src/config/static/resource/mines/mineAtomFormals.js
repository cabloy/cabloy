module.exports = app => {
  // actionPath
  const options = {
    stage: 'formal',
    mine: 1,
  };
  const actionPath = `/a/basefront/atom/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Formals',
    atomStaticKey: 'mineAtomFormals',
    atomRevision: 3,
    atomCategoryId: 'a-base:mine.Atom',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceIcon: ':outline:archive-outline',
    appKey: 'a-app:appDefault',
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
