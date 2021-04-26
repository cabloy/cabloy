module.exports = app => {
  const routes = [
    { method: 'post', path: 'share/generate', controller: 'share',
      meta: {
        auth: { user: true },
      },
    },
  ];
  return routes;
};
