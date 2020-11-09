module.exports = app => {
  const routes = [
    { method: 'post', path: 'task/select', controller: 'flowTask' },
  ];
  return routes;
};
