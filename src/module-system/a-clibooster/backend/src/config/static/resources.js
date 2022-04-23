module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // function
    {
      atomName: 'Cli Demo',
      atomStaticKey: 'cliDefaultDemo',
      atomRevision: 1,
      atomCategoryId: 'a-base:function.Cli',
      resourceType: 'a-base:function',
      resourceConfig: null,
      resourceRoles: 'template.system,RoleScopeCliDevelopment',
    },
    {
      atomName: 'Cli Token',
      atomStaticKey: 'cliToken',
      atomRevision: 0,
      atomCategoryId: 'a-base:function.Cli',
      resourceType: 'a-base:function',
      resourceConfig: null,
      resourceRoles: 'template.system,RoleScopeCliDevelopment',
    },
  ];
  // ok
  return resources;
};
