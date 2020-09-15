module.exports = app => {
  const routes = [
    // captcha
    { method: 'get', path: 'captcha/image', controller: 'captcha' },
  ];
  return routes;
};
