module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Comments',
    atomStaticKey: 'mineMineComments',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
