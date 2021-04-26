module.exports = app => {
  const routes = [
    { method: 'post', path: 'share/create', controller: 'user',
      meta: {
        auth: { user: true },
      },
    },
  ];
  return routes;
};
