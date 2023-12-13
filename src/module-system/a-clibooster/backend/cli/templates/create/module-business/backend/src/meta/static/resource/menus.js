module.exports = app => {
  const moduleInfo = module.info;
  const resources = [
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
      resourceIcon: '::add',
      appKey: 'a-appbooster:appUnclassified',
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
      resourceIcon: ':outline:data-list-outline',
      appKey: 'a-appbooster:appUnclassified',
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};
