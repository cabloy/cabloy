module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // captcha
    { method: 'get', path: 'captcha/image', controller: 'captcha' },
    { method: 'post', path: 'captcha/verify', controller: 'captcha', middlewares: 'inner' },
  ];
  return routes;
};
