module.exports = app => {
  const actionPath = '/a/basefront/attachment/all?scene=mine';
  // resource
  const resource = {
    atomName: 'Attachments',
    atomStaticKey: 'mineMineAttachments',
    atomRevision: 4,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceIcon: '::attachment-line',
    appKey: 'a-appbooster:appGeneral',
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
