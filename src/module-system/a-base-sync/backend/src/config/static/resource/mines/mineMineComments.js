module.exports = app => {
  const actionPath = '/a/basefront/comment/all?scene=mine';
  // resource
  const resource = {
    atomName: 'Comments',
    atomStaticKey: 'mineMineComments',
    atomRevision: 4,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceIcon: '::comment-dots',
    appKey: 'a-appbooster:appGeneral',
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
