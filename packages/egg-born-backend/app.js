module.exports = app => {
  // coreMiddleware
  if (app.isProd) app.config.coreMiddleware.push('disableVersionCheck');
};
