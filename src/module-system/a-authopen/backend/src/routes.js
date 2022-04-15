module.exports = app => {
  const routes = [
    // authOpen
    {
      method: 'post',
      path: 'authOpen/hideClientSecret',
      controller: 'authOpen',
      meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'hideClientSecret' } },
    },
    {
      method: 'post',
      path: 'authOpen/resetClientSecret',
      controller: 'authOpen',
      meta: { right: { type: 'atom', atomClass: 'a-authopen:authOpen', action: 'resetClientSecret' } },
    },
  ];
  return routes;
};
