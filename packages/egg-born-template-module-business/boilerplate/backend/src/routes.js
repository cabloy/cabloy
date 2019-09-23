const version = require('./controller/version.js');
const {{atomClassName}} = require('./controller/{{atomClassName}}.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // {{atomClassName}}
    { method: 'post', path: '{{atomClassName}}/create', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/read', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/select', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/write', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/delete', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/action', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/enable', controller: {{atomClassName}}, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};
