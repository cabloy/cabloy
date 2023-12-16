// const moduleInfo = module.info;

const resources = [
  // function
  {
    atomName: 'Settings',
    atomStaticKey: 'settings',
    atomRevision: 1,
    atomCategoryId: 'a-base:function.Tools',
    resourceType: 'a-base:function',
    resourceConfig: JSON.stringify({
      actionPath: '/a/settings/instance/list',
    }),
    resourceRoles: 'template.system',
  },
];
module.exports = resources;
