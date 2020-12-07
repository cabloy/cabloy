module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Settings',
      atomStaticKey: 'settings',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Tools',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/settings/instance/list',
      }),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};
