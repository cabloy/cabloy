module.exports = app => {
  const routes = [
    { method: 'post', path: 'task/select', controller: 'flowTask' },
    { method: 'post', path: 'task/count', controller: 'flowTask' },
    { method: 'post', path: 'task/claim', controller: 'flowTask' },
    { method: 'post', path: 'task/complete', controller: 'flowTask' },
  ];
  return routes;
};
