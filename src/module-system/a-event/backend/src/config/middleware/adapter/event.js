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

    async invoke({ module, name, data }) {
      module = module || this.moduleName;
      const key = `${module}:${name}`;
      const events = ctx.app.meta.geto('events');
      const eventArray = events[key];
      if (!eventArray) return;
      for (const event of eventArray) {
        await ctx.performAction({
          method: 'post',
          url: event,
          body: { data },
        });
      }
    }

  }

  return Event;
};
