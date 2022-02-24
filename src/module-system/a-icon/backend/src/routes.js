module.exports = app => {
  const routes = [{ method: 'post', path: 'icon/getIcons', controller: 'icon' }];
  return routes;
};
