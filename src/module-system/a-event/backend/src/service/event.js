module.exports = app => {

  class Event extends app.Service {

    // register all events
    async registerAllEvents() {
      // 注意模块之间有依赖关系，所以使用modulesArray
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.event) {
          this._registerEvents(module, module.main.meta.event);
        }
      }
    }

    async _registerEvents(module, metaEvent) {
      const events = this.app.meta.geto('events');
      for (const key in metaEvent) {
        events.geta(key).push(`/${module.info.url}/${metaEvent[key]}`);
      }
    }

  }

  return Event;
};
