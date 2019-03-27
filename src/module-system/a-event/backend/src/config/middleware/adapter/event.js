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
      //
      let returnValue;
      for (const eventUrl of eventArray) {
        const event = {
          break: false,
        };
        const res = await ctx.performAction({
          method: 'post',
          url: eventUrl,
          body: { event, data },
        });
        // check returnValue
        if (res !== undefined) returnValue = res;
        // check break
        if (event.break) break;
      }
      // ok
      return returnValue;
    }

  }

  return Event;
};
