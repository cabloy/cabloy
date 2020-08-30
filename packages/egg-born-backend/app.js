module.exports = app => {
  // jwt
  let index = app.config.coreMiddleware.indexOf('session');
  if (index === -1) {
    app.config.coreMiddleware.push('jwt');
  } else {
    app.config.coreMiddleware.splice(index, 0, 'jwt');
  }
  // siteFile
  index = app.config.coreMiddleware.indexOf('siteFile');
  if (index > -1) {
    app.config.coreMiddleware.splice(index, 1);
  }
};
