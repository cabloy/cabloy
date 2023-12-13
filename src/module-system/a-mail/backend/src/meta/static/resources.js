module.exports = app => {
  // const moduleInfo = module.info;
  const resources = [
    // menu
    {
      atomName: 'Mail Management',
      atomStaticKey: 'mailManagement',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/mail/scene/list',
      }),
      resourceIcon: ':outline:mail-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 6,
    },
  ];
  return resources;
};
