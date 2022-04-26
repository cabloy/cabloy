module.exports = app => {
  class <%=argv.atomClassNameCapitalize%> extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>', options: { disableDeleted: false } });
    }
  }
  return <%=argv.atomClassNameCapitalize%>;
};
