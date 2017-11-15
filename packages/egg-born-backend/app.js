module.exports = app => {
  // coreMiddleware
  if (app.meta.isProd) app.config.coreMiddleware.push('disableVersionCheck');
};
