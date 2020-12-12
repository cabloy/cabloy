module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Completeds',
    atomStaticKey: 'mineTaskCompleteds',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
