module.exports = app => {
  const routes = [
    { method: 'post', path: 'task/select', controller: 'flowTask' },
    { method: 'post', path: 'atom/count', controller: 'flowTask' },
  ];
  return routes;
};
