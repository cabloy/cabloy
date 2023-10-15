module.exports = app => {
  class <%=argv.atomClassNameCapitalize%> extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
        options: {
          disableDeleted: false,
          cacheName: null,
        }
      });
    }
  }
  return <%=argv.atomClassNameCapitalize%>;
};
