module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Participateds',
    atomStaticKey: 'mineFlowParticipateds',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Flow',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
  };
  return resource;
};
