module.exports = app => {
  const routes = [
    { method: 'post', path: 'message/group', controller: 'message' },
  ];
  return routes;
};
