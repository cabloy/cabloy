module.exports = app => {
  const routes = [{ method: 'post', path: 'dict/getDict', controller: 'dict' }];
  return routes;
};
