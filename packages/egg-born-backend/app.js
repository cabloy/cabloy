module.exports = app => {
  // coreMiddleware
  app.config.coreMiddleware.push('disableVersionCheck');
};
