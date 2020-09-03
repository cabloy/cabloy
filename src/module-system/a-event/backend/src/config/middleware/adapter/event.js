const Fn = module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __adapter = (context, chain) => {
    const eventBean = ctx.bean._getBean(chain);
    if (!eventBean) throw new Error(`event not found: ${chain}`);
    if (!eventBean.execute) throw new Error(`event.execute not found: ${chain}`);
    return {
      receiver: eventBean,
      fn: eventBean.execute,
    };
  };

  class Event {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's event
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async invoke({ module, name, data, result, next }) {
      const eventArray = this._getEventArray({ module, name });
      // context
      const context = {
        data,
        result,
      };
      // invoke
      await ctx.app.meta.util.composeAsync(eventArray, __adapter)(context, async (context, _next) => {
        if (next) {
          await next(context, _next);
        } else {
          await _next();
        }
      });
      // ok
      return context.result;
    }

    _getEventArray({ module, name }) {
      module = module || this.moduleName;
      const key = `${module}:${name}`;
      const events = ctx.app.meta.geto('events');
      if (events[key]) return events[key];
      events[key] = this._collectEventArray(key);
      return events[key];
    }

    _collectEventArray(key) {
      const eventArray = [];
      for (const module of ctx.app.meta.modulesArray) {
        const implementations = module.main.meta && module.main.meta.event && module.main.meta.event.implementations;
        if (!implementations) continue;
        // bean
        const implementationName = implementations[key];
        if (!implementationName) continue;
        let beanFullName;
        if (typeof implementationName === 'string') {
          beanFullName = `${module.info.relativeName}.event.${implementationName}`;
        } else {
          beanFullName = `${implementationName.module || module.info.relativeName}.event.${implementationName.name}`;
        }
        eventArray.push(beanFullName);
      }
      return eventArray;
    }

  }

  return Event;
};
