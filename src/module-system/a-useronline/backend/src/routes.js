module.exports = app => {
  const routes = [
    {
      method: 'post',
      path: 'userOnline/kickOut',
      controller: 'userOnline',
      meta: { right: { type: 'atom', atomClass: 'a-useronline:userOnline', action: 'kickOut' } },
    },
  ];
  return routes;
};
