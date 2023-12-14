const moduleInfo = module.info;
module.exports = class <%=argv.atomClassNameCapitalize%> extends module.meta.class.ModelCache {
  constructor() {
    super({
      table: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
      options: {
        disableDeleted: false,
        cacheName: { module: moduleInfo.relativeName, name: 'model<%=argv.atomClassNameCapitalize%>' },
      }
    });
  }
};
