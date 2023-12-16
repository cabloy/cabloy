const moduleInfo = module.info;
module.exports = app => {
  const hook = {
    moduleLoaded(/* { module }*/) {
      if (app.meta.inApp) {
        // sessionStore
        app.sessionStore = app.bean._getBean(`${moduleInfo.relativeName}.local.sessionStore`);
      }
    },
  };
  return hook;
};
