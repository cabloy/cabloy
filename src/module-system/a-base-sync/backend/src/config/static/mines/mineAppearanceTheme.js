module.exports = app => {
  const actionPath = '/a/user/theme';
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
    resourceSorting: 2,
  };
  return resource;
};
