module.exports = app => {
  const routes = [
    // detail
    { method: 'post', path: 'detail/create', controller: 'detail', middlewares: 'detail,transaction',
      meta: { detail: { action: 1 } },
    },
  ];
  return routes;
};
