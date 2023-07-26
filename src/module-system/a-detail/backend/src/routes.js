module.exports = app => {
  const routes = [
    // detail
    {
      method: 'post',
      path: 'detail/create',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'create' } },
    },
    { method: 'post', path: 'detail/read', controller: 'detail', meta: { right: { type: 'detail', action: 'read' } } },
    {
      method: 'post',
      path: 'detail/select',
      controller: 'detail',
      meta: { right: { type: 'detail', action: 'read' } },
    },
    { method: 'post', path: 'detail/count', controller: 'detail', meta: { right: { type: 'detail', action: 'read' } } },
    {
      method: 'post',
      path: 'detail/write',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'write' } },
    },
    {
      method: 'post',
      path: 'detail/delete',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'delete' } },
    },
    {
      method: 'post',
      path: 'detail/clone',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'clone' } },
    },
    {
      method: 'post',
      path: 'detail/moveUp',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'moveUp' } },
    },
    {
      method: 'post',
      path: 'detail/moveDown',
      controller: 'detail',
      middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 'moveDown' } },
    },
    { method: 'post', path: 'detail/actions', controller: 'detail' },
    { method: 'post', path: 'detail/actionsBulk', controller: 'detail' },
    { method: 'post', path: 'detail/validator', controller: 'detail' },
  ];
  return routes;
};
