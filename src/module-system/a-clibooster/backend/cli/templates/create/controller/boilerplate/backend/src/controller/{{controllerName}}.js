module.exports =
  class <%=argv.controllerNameCapitalize%>Controller {
    async action() {
      const res = await this.ctx.service.<%=argv.controllerName%>.action({
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  ;
