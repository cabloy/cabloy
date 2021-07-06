module.exports = app => {
  const routes = [{ method: 'post', path: 'stats/get', controller: 'stats' }];
  return routes;
};
