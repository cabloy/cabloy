module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class <%=argv.atomClassNameCapitalize%> extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
        options: {
          disableDeleted: false,
          cacheName: { module: moduleInfo.relativeName, name: 'model<%=argv.atomClassNameCapitalize%>' },
        }
      });
    }
  }
  return <%=argv.atomClassNameCapitalize%>;
};
