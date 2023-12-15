module.exports = function (loader, modules) {
  // load controllers
  loadControllers();

  function loadControllers() {
    for (const key in modules) {
      const module = modules[key];
      const controllers = module.main.controllers;
      if (!controllers) continue;
      for (const controllerName in controllers) {
        const beanName = `controller.${controllerName}`;
        const bean = {
          bean: controllers[controllerName],
        };
        loader.app.bean._register(module.info.relativeName, beanName, bean);
      }
    }
  }
};
