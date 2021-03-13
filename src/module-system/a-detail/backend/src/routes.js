module.exports = app => {
  const routes = [
    // detail
    { method: 'post', path: 'detail/create', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 1 } },
    },
    { method: 'post', path: 'detail/read', controller: 'detail',
      meta: { right: { type: 'detail', action: 2 } },
    },
    { method: 'post', path: 'detail/select', controller: 'detail',
      meta: { right: { type: 'detail', action: 2 } },
    },
    { method: 'post', path: 'detail/count', controller: 'detail',
      meta: { right: { type: 'detail', action: 2 } },
    },
    { method: 'post', path: 'detail/write', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 3 } },
    },
    { method: 'post', path: 'detail/delete', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 4 } },
    },
  ];
  return routes;
};
