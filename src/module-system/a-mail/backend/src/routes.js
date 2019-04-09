const version = require('./controller/version.js');
const mail = require('./controller/mail.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // mail
    { method: 'post', path: 'mail/create', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/read', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/select', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/write', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/delete', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/action', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'mail/enable', controller: mail, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};
