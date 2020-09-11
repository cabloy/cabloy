module.exports = app => {
  const routes = [
    // captcha
    { method: 'get', path: 'captcha/image', controller: 'captcha' },
    { method: 'post', path: 'captcha/verify', controller: 'captcha', middlewares: 'inner' },
  ];
  return routes;
};
