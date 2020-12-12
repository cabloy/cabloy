module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Handlings',
    atomStaticKey: 'mineTaskHandlings',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
