module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create <%=argv.atomClassNameCapitalize%>',
      atomStaticKey: 'create<%=argv.atomClassNameCapitalize%>',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: '<%=argv.atomClassName%>',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: '<%=argv.atomClassNameCapitalize%> List',
      atomStaticKey: 'list<%=argv.atomClassNameCapitalize%>',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: '<%=argv.atomClassName%>',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
