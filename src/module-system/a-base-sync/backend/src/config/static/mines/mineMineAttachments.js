module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Attachments',
    atomStaticKey: 'mineMineAttachments',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Mine',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
  };
  return resource;
};
