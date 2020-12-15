module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create {{atomClassNameCapitalize}}',
      atomStaticKey: 'create{{atomClassNameCapitalize}}',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: '{{atomClassName}}',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: '{{atomClassNameCapitalize}} List',
      atomStaticKey: 'list{{atomClassNameCapitalize}}',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: '{{atomClassName}}',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
