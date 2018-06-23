module.exports = app => {

  class HookController extends app.Controller {

    async installHooks() {
      // register all hooks
      await this.ctx.service.hook.registerAllHooks();
      this.ctx.success();
    }

  }

  return HookController;
};
