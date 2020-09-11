module.exports = app => {
  const routes = [
    // {{atomClassName}}
    { method: 'post', path: '{{atomClassName}}/create', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/read', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/select', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/write', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/delete', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/action', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: '{{atomClassName}}/enable', controller: '{{atomClassName}}', middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};
