module.exports = app => {

  class Event extends app.Service {

    // register all events
    async registerAllEvents() {
      // 注意模块之间有依赖关系，所以使用modulesArray
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.event && module.main.meta.event.implementations) {
          this._registerEvents(module, module.main.meta.event.implementations);
        }
      }
    }

    async _registerEvents(module, implementations) {
      const events = this.app.meta.geto('events');
      for (const key in implementations) {
        events.geta(key).push(`/${module.info.url}/${implementations[key]}`);
      }
    }

  }

  return Event;
};
