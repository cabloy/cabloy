module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
