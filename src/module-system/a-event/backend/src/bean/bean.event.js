// const moduleInfo = module.info;

const __adapter = (context, chain) => {
  const eventBean = chain;
  return {
    receiver: eventBean,
    fn: eventBean.execute,
  };
};
module.exports = class Event extends module.meta.class.BeanModuleBase {
  async invoke({ module, name, data, result, next }) {
    const eventArray = this._getEventArray({ module, name });
    const eventBeanArray = eventArray.map(item => {
      const eventBean = this.ctx.bean._getBean(item);
      if (!eventBean) throw new Error(`event not found: ${item}`);
      if (!eventBean.execute) throw new Error(`event.execute not found: ${item}`);
      return eventBean;
    });
    // context
    const context = {
      data,
      result,
    };
    // invoke
    await this.ctx.app.meta.util.composeAsync(eventBeanArray, __adapter)(context, async (context, _next) => {
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
    const events = this.ctx.bean.util.getPropertyObject(this.ctx.app.meta, 'events');
    if (events[key]) return events[key];
    events[key] = this._collectEventArray(key);
    return events[key];
  }

  _collectEventArray(key) {
    const eventArray = [];
    for (const module of this.ctx.app.meta.modulesArray) {
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
};
