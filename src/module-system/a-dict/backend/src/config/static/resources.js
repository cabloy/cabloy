module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create Dict',
      atomStaticKey: 'createDict',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
        atomAction: 'create',
      }),
      resourceIcon: ':outline:dict-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Dict List',
      atomStaticKey: 'listDict',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'dict',
        atomAction: 'read',
      }),
      resourceIcon: ':outline:dict-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};
