module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'ViewLayout',
    atomStaticKey: 'mineAppearanceView',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Appearance',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
  };
  return resource;
};
