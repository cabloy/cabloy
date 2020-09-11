module.exports = app => {
  const routes = [
    // captcha
    { method: 'post', path: 'captcha/createProviderInstance', controller: 'captcha' },
  ];
  return routes;
};
