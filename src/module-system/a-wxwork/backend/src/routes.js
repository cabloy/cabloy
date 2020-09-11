module.exports = app => {
  const routes = [
    // message
    { method: 'get', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    { method: 'get', path: 'message/contacts', controller: 'message', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/contacts', controller: 'message', meta: { auth: { enable: false } } },
    // contacts
    { method: 'post', path: 'contacts/sync', controller: 'contacts', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'contacts/syncStatus', controller: 'contacts', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },

    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },
    { method: 'post', path: 'jssdk/jsconfigAgent', controller: 'jssdk' },

    // authMini
    { method: 'post', path: 'authMini/login', controller: 'authMini', meta: { auth: { enable: false } } },

  ];
  return routes;
};
