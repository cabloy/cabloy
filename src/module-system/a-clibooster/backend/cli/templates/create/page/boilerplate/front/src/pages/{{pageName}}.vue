module.exports = app => {
  class <%=argv.controllerNameCapitalize%>Controller extends app.Controller {
    async action() {
      const res = await this.ctx.service.<%=argv.controllerName%>.action({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return <%=argv.controllerNameCapitalize%>Controller;
};
