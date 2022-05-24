module.exports = app => {
  const routes = [
    // scene
    {
      method: 'post',
      path: 'scene/list',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
    {
      method: 'post',
      path: 'scene/save',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
    {
      method: 'post',
      path: 'scene/delete',
      controller: 'scene',
      meta: { right: { type: 'resource', name: 'mailManagement' } },
    },
  ];
  return routes;
};
