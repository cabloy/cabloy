module.exports = app => {
  const actionPath = '';
  // resource
  const resource = {
    atomName: 'Theme',
    atomStaticKey: 'mineAppearanceTheme',
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
