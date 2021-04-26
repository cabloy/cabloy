module.exports = app => {
  const routes = [
    { method: 'post', path: 'share/generate', controller: 'user',
      meta: {
        auth: { user: true },
      },
    },
  ];
  return routes;
};
