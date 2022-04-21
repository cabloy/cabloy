module.exports = app => {
  const routes = [
    // cli
    {
      method: 'post',
      path: 'cli/meta',
      controller: 'cli',
      meta: { right: { enableAuthOpen: true } },
    },
    {
      method: 'post',
      path: 'cli/execute',
      controller: 'cli',
      meta: { right: { enableAuthOpen: true } },
    },
  ];
  return routes;
};
