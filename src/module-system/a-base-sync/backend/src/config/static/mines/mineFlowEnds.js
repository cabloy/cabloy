module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Ends',
    atomStaticKey: 'mineFlowEnds',
    atomRevision: 0,
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
