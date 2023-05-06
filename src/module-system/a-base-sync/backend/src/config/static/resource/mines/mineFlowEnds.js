module.exports = app => {
  // actionPath
  const options = {
    mode: 'history',
    where: {
      'a.flowStatus': 1,
    },
  };
  const actionPath = `/a/flowtask/flow/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Ends',
    atomStaticKey: 'mineFlowEnds',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Flow',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
