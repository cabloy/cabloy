module.exports = app => {
  const routes = [
    // base
    { method: 'post', path: 'base/actions', controller: 'base' },
    // detail
    {
      method: 'post',
      path: 'detail/create',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'create' } },
    },
    { method: 'post', path: 'detail/read', controller: 'detail', meta: { right: { type: 'detail', action: 2 } } },
    { method: 'post', path: 'detail/select', controller: 'detail', meta: { right: { type: 'detail', action: 2 } } },
    { method: 'post', path: 'detail/count', controller: 'detail', meta: { right: { type: 'detail', action: 2 } } },
    {
      method: 'post',
      path: 'detail/write',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 3 } },
    },
    {
      method: 'post',
      path: 'detail/delete',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 4 } },
    },
    {
      method: 'post',
      path: 'detail/clone',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 5 } },
    },
    {
      method: 'post',
      path: 'detail/moveUp',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 6 } },
    },
    {
      method: 'post',
      path: 'detail/moveDown',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 7 } },
    },
    { method: 'post', path: 'detail/actions', controller: 'detail' },
    { method: 'post', path: 'detail/actionsBulk', controller: 'detail' },
    { method: 'post', path: 'detail/validator', controller: 'detail' },
  ];
  return routes;
};
