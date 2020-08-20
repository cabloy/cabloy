module.exports = app => {
  const index = app.config.coreMiddleware.indexOf('session');
  if (index === -1) {
    app.config.coreMiddleware.push('jwt');
  } else {
    app.config.coreMiddleware.splice(index, 0, 'jwt');
  }
};
