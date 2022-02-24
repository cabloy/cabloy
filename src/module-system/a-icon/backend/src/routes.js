module.exports = app => {
  const routes = [
    // getIcons
    {
      method: 'post',
      path: 'icon/getIcons',
      controller: 'icon',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
  ];
  return routes;
};
