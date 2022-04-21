module.exports = app => {
  const routes = [
    // progress
    {
      method: 'post',
      path: 'progress/check',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
    {
      method: 'post',
      path: 'progress/abort',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
    {
      method: 'post',
      path: 'progress/delete',
      controller: 'progress',
      meta: {
        auth: { user: true },
        right: { enableAuthOpen: true },
      },
    },
  ];
  return routes;
};
