module.exports = app => {
  // jwt
  let index = app.config.coreMiddleware.indexOf('session');
  if (index === -1) {
    app.config.coreMiddleware.push('appReady', 'instance', 'jwt');
  } else {
    app.config.coreMiddleware.splice(index, 0, 'appReady', 'instance', 'jwt');
  }
  // siteFile
  index = app.config.coreMiddleware.indexOf('siteFile');
  if (index > -1) {
    app.config.coreMiddleware.splice(index, 1);
  }
  // bodyCrypto
  index = app.config.coreMiddleware.indexOf('bodyParser');
  if (index > -1) {
    app.config.coreMiddleware.splice(index + 1, 0, 'bodyCrypto');
  }
};
