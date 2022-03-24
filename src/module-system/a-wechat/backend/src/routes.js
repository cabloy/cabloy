module.exports = app => {
  const routes = [
    // message
    {
      method: 'get',
      path: 'message/:providerName/:providerScene',
      controller: 'message',
      meta: { auth: { enable: false } },
    },
    {
      method: 'post',
      path: 'message/:providerName/:providerScene',
      controller: 'message',
      meta: { auth: { enable: false } },
    },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },

    // authMini
    { method: 'post', path: 'authMini/login', controller: 'authMini' },
  ];
  return routes;
};
