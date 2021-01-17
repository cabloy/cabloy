module.exports = app => {
  // resource
  const resource = {
    atomName: 'Language',
    atomStaticKey: 'mineAppearanceLanguage',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Appearance',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionModule: 'a-user',
      actionComponent: 'action',
      name: 'appearanceLanguage',
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
