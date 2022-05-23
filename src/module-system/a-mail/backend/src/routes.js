module.exports = app => {
  const routes = [
    // scene
    {
      method: 'post',
      path: 'scene/list',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
  ];
  return routes;
};
