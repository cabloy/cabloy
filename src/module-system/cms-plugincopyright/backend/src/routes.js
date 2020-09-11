module.exports = app => {
  const routes = [
    // util
    { method: 'get', path: 'util/md/:atomId', controller: 'util', action: 'md' },
  ];
  return routes;
};
