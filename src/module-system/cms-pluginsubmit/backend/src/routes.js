module.exports = app => {
  const routes = [
    // util
    { method: 'post', path: 'util/submit', controller: 'util', middlewares: 'inner' },
  ];
  return routes;
};
