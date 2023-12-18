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
},`;

module.exports = {
  file: 'backend/src/meta/static/resource/menus.js',
  async transform({ cli, ast, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet });
    if (!ast.has('const resources = [$_$]')) {
      ast.replace('const resources = []', `const resources = [${code}]`);
    } else {
      ast.replace('const resources = [$_$]', `const resources = [$_$, \n ${code}]`);
    }
    // moduleInfo
    const moduleInfo = 'const moduleInfo = module.info';
    if (!ast.has(moduleInfo)) {
      ast.replace('module.exports = $$$0=>{$$$1}', `module.exports = $$$0=>{ ${moduleInfo} \n $$$1}`);
    }
    // ok
    return ast;
  },
};
