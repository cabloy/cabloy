const __snippet = `{
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
},`;

module.exports = {
  file: 'backend/src/config/static/resources.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet });
    ast.replace(`const resources = [$_$]`, `const resources = [$_$, ${code}]`);
    // ok
    return ast;
  },
};
