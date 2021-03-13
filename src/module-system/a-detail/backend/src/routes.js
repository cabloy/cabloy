module.exports = app => {
  const routes = [
    // detail
    { method: 'post', path: 'detail/create', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 1 } },
    },
  ];
  return routes;
};
