module.exports = app => {
  // actionPath
  const options = {
    mode: 'mine',
  };
  const actionPath = `/a/flowtask/flow/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Initiateds',
    atomStaticKey: 'mineFlowInitiateds',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Flow',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
