module.exports = app => {
  class <%=argv.controllerNameCapitalize%> extends app.Service {
    async action({ user }) {
      return user;
    }
  }

  return <%=argv.controllerNameCapitalize%>;
};
