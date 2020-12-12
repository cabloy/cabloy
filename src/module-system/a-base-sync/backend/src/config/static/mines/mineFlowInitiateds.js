module.exports = app => {
  const actionPath = '';
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
