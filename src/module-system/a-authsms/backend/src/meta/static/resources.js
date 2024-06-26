// const moduleInfo = module.info;

const resources = [
  // menu
  {
    atomName: 'SMS Management',
    atomStaticKey: 'smsManagement',
    atomRevision: 1,
    atomCategoryId: 'a-base:menu.BasicAdmin',
    resourceType: 'a-base:menu',
    resourceConfig: JSON.stringify({
      actionPath: '/a/authsms/smsProvider/list',
    }),
    resourceIcon: ':auth:sms',
    appKey: 'a-appbooster:appSystem',
    resourceRoles: 'template.system',
    resourceSorting: 7,
  },
];
module.exports = resources;
