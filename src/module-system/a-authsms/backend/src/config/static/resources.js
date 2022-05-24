module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'SMS Management',
      atomStaticKey: 'smsManagement',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/authsms/provider/list',
      }),
      resourceIcon: ':auth:sms',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 7,
    },
  ];
  return resources;
};
