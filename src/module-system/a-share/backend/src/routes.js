module.exports = app => {
  const routes = [
    { method: 'post', path: 'share/createLink', controller: 'user',
      meta: {
        auth: { user: true },
      },
    },
  ];
  return routes;
};
