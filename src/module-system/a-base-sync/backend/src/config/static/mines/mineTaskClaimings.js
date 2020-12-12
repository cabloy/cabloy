module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Claimings',
    atomStaticKey: 'mineTaskClaimings',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
