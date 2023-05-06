module.exports = app => {
  // actionPath
  const options = {
    mode: 'others',
  };
  const actionPath = `/a/flowtask/flow/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Participateds',
    atomStaticKey: 'mineFlowParticipateds',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Flow',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
