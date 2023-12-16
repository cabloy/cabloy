const moduleInfo = module.info;
module.exports = app => {
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
      atomName: 'Dicts',
      atomStaticKey: 'listDict',
      atomRevision: 3,
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
