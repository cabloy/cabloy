module.exports = app => {
  const routes = [
    // base
    { method: 'post', path: 'base/actions', controller: 'base' },
    // detail
    { method: 'post', path: 'detail/create', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 1, atomKey: true } },
    },
    { method: 'post', path: 'detail/read', controller: 'detail',
      meta: { right: { type: 'detail', action: 2, atomKey: false } },
    },
    { method: 'post', path: 'detail/select', controller: 'detail',
      meta: { right: { type: 'detail', action: 2, atomKey: true } },
    },
    { method: 'post', path: 'detail/count', controller: 'detail',
      meta: { right: { type: 'detail', action: 2, atomKey: true } },
    },
    { method: 'post', path: 'detail/write', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 3, atomKey: false } },
    },
    { method: 'post', path: 'detail/delete', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 4, atomKey: false } },
    },
    { method: 'post', path: 'detail/actions', controller: 'detail' },
    { method: 'post', path: 'detail/actionsBulk', controller: 'detail' },
  ];
  return routes;
};
