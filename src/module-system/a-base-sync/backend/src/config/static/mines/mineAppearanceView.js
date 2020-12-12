module.exports = app => {
  // resource
  const resource = {
    atomName: 'ViewLayout',
    atomStaticKey: 'mineAppearanceView',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Appearance',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionModule: 'a-user',
      actionComponent: 'action',
      name: 'appearanceView',
    }),
    resourceRoles: 'root',
  };
  return resource;
};
