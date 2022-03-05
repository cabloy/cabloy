module.exports = app => {
  const routes = [
    {
      method: 'post',
      path: 'userOnline/kickOut',
      controller: 'userOnline',
      meta: { right: { type: 'atom', action: 'kickOut' } },
    },
  ];
  return routes;
};
