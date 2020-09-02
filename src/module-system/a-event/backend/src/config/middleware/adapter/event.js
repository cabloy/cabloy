const Fn = module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Event {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's event
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // support: returnValue / event.break
    async invoke({ module, name, data }) {
      //
      module = module || this.moduleName;
      const key = `${module}:${name}`;
      const events = ctx.app.meta.geto('events');
      const eventArray = events[key];
      if (!eventArray) return;
      // context
      const context = {
        data,
        result: undefined,
      };
      // invoke
      const adapter = (context, chain) => {
        const eventBean = ctx.bean._getBean(chain);
        if (!eventBean) throw new Error(`event not found: ${chain}`);
        if (!eventBean.execute) throw new Error(`event.execute not found: ${chain}`);
        return {
          receiver: eventBean,
          fn: eventBean.execute,
        };
      };
      await ctx.app.meta.util.composeAsync(eventArray, adapter)(context);
      // ok
      return context.result;
    }

  }

  return Event;
};
