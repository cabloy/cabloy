module.exports = app => {
  class <%=argv.atomClassNameCapitalize%>Detail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>Detail', options: { disableDeleted: false } });
    }
  }
  return <%=argv.atomClassNameCapitalize%>Detail;
};
