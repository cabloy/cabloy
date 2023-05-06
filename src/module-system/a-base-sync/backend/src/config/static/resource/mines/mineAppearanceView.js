module.exports = app => {
  // resource
  const resource = {
    atomName: 'ViewLayout',
    atomStaticKey: 'mineAppearanceView',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Appearance',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionModule: 'a-user',
      actionComponent: 'action',
      name: 'appearanceView',
    }),
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
